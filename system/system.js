'use strict';

module.exports = System;

var fs = require("q-io/fs");
var q = require('q');
var path = require('path');
var tiny = require('tiny-di');

var config = require('./config');
var ROOT = '../../../';

var pluginConfigs = {};
var $pluginInjector;

System.$inject = ['depmanager', 'config'];
function System(depManager, serverConfig) {
  var vm = {};
  vm.start = start;
  vm.stop = stop;
  vm.switchPlugin = switchPlugin;
  vm.restartPlugin = restartPlugin;
  vm.getProperties = getProperties;
  vm.setProperties = setProperties;
  
  vm.status = '0';
  vm.pluginStatus = {};
  
  start();
  
  return vm; 
  
  function start() {
    $pluginInjector = new tiny();
    $pluginInjector.bind('$pluginInjector').to($pluginInjector);
    $pluginInjector.bind('pluginStatus').to(vm.pluginStatus);
    $pluginInjector.setResolver(dependencyResolver);
  
    console.log('Starting plugins........');
    loadPluginsConfigs()
        .then(loadPlugins);
    
    //loadPluginsConfigs(pluginConfig);
    //loadPlugins(pluginConfig.plugins, exchange, system.pluginStatus, true);
    vm.status = '1';
  }
  
  function loadPlugins() {
    if (!depManager.isInitialised()) {
      depManager.initialise().then(depInitialisedLoadPlugins)
    } else {
      depInitialisedLoadPlugins();
    }
    
    function depInitialisedLoadPlugins() {
      var keys = Object.keys(depManager.plugins);
      keys.forEach(function(plugin) {
        vm.pluginStatus[plugin] = loadPlugin(plugin);
      });
    }
  }
  
  function loadPlugin(plugin) {
    //check if enabled
    if (config.plugins[plugin]) {
      var depsLoaded = loadDeps(depManager.plugins[plugin].dependencies);
      if (!depsLoaded) {
        //dependencies not load -> cant start plugin
        console.log('deps coudnt be loaded for ' + plugin);
        return false;
      }
      
      console.log('Starting ' + plugin + ' ...');
      
      try {
        /*var module = require(plugin);*/
        var module = $pluginInjector.bind(plugin).load(plugin);
        
        module.start(pluginConfigs[plugin]);
        
        return true;
        
      } catch (e) {
        console.log('Could not load plugin: ' + plugin);
        console.log(e);
        return false;
      }
    
    }
  }
  
  function loadDeps(dependencies) {
    if (!dependencies || dependencies === {} ) {
      return true;
    }
    
    var allPluginsLoaded = true;
    var keys = Object.keys(dependencies);
    keys.forEach(function(key) {
      if (vm.pluginStatus[key] === undefined) {
        var keyLoaded = loadPlugin(key);
        if (!keyLoaded) {
          allPluginsLoaded = false;
        }
      } else {
        // plugin has already tried to start
        if (!vm.pluginStatus[key]) {
          allPluginsLoaded = false;
        }
      }
    });
    return allPluginsLoaded;
  }
  
  function loadPluginsConfigs() {
    if (!depManager.isInitialised()) {
      return depManager.initialise().then(loadConfigsForPlugins);
    } else {
      return loadConfigsForPlugins();
    }
    
    function loadConfigsForPlugins() {
      var deffered = q.defer();
      var plugins = depManager.plugins;
      var keys = Object.keys(plugins);
      
      keys.forEach(function(plugin) {
        var pluginConfig = {};
        try {
          var pluginPath = ROOT + 'node_modules/' + plugin;
          pluginConfig = require(pluginPath + '/config.json');
        } catch(e) {
          console.log('------------ No Config File for ' + plugin);
        }
        pluginConfigs[plugin] = pluginConfig;
      });
      deffered.resolve(pluginConfigs);
      return deffered.promise;
    }
  }
  
  function dependencyResolver(moduleId) {
    var modulePath = path.resolve(path.join(serverConfig.dist.root, serverConfig.server.path, moduleId));
    try {
      return require(modulePath);
    } catch (e) {
      try {
        var module = require(moduleId);
        
        //classes from es6, typescript require new operator
        if (module.__esModule) {
          var injects = [];
          module.default.$inject && module.default.$inject.forEach(function(dep) {
            injects.push($pluginInjector.get(dep));
          });
          
          var argsMaxLength = 10;
          for(var i = injects.length; i < argsMaxLength; i++) {
            injects.push(undefined);
          }
          
          return new module.default(injects[0], injects[1], injects[2], injects[3], injects[4],
            injects[5], injects[6], injects[7], injects[8], injects[9]);
          //spread operator combined with new currently not supported by node
          //return new t.default(...injects);
        }
        
        //default
        return require(moduleId);
      } catch (e2) {
        console.log('Plugin ' + moduleId + ' failed to load');
        console.log(modulePath);
        console.log('errors', e, e2);
        console.log(new Error().stack);
        return false;
      }
    }
  }
  
  //---------------------------------------------------------------OLD CODE -----------------------------------------------------------------------
  function stop() {
    pluginConfig.plugins.forEach(stopPlugin);  
    system.status = '0';
  }
  
  function stopPlugin(plugin, isInlinePlugin) {
    var status = getStatus(plugin);
    
    if (status.status) {
      if (!isInlinePlugin) {
        savePluginSwitch(plugin, false);
      }
      
      var pluginPath = getModulePath(plugin);
      
      try {
        //stop all plugins which require this one
        var inlinePlugins = Object.keys(status.plugins);
        inlinePlugins.forEach(function(inlinePlugin) {
          stopPlugin(inlinePlugin, true);
        });
        
        var module = require(pathToPlugins + pluginPath);
        if (module.stop) {console.log('stop '+plugin);
          module.stop(exchange);
        }
        status.status = false;
      } catch(e) {
        console.log(e);
      }
      
    }
  }
  
  function getModulePath(plugin) {
    var pluginPath = findPluginPath(plugin);
    var path ='';
    pluginPath.forEach(function(part) {
      if (pluginPath.indexOf(part) === pluginPath.length - 1) {
        path = path + plugin;
      } else {
        path = path + part + '/plugins/';
      }
    });
    return path;
  }
  
  function getStatus(plugin) {
    var pluginPath = findPluginPath(plugin);
    if (pluginPath.length === 0) {
      return 0;
    }
     
    var status = system.pluginStatus;
    pluginPath.forEach(function(path) {
      try {
        if (pluginPath.indexOf(path) === pluginPath.length - 1) {
          status = status[path];
        } else {
          status = status[path].plugins;
        }
      } catch(e) {
        status = false;
      }
      
    });
    return status;
  }
  
  function findPluginPath(name) {
    var path = [];
    pluginConfig.plugins.forEach(function(plugin) {
      calculatePathAndSaveIfExists(path, plugin, name);
    });
    
    //last entry is doubled -> remove one
    path.splice(path.length-1,1);
    return path;
  }
  
  function findPluginPathHelper(currentPlugin, name){
    if (currentPlugin.name === name) {
      //Path found
      return [currentPlugin.name];
    } else {
      var pathToReturn = [];
      if (currentPlugin.plugins) {
        currentPlugin.plugins.forEach(function(plugin) {
          calculatePathAndSaveIfExists(pathToReturn, plugin, name);
        });
      }  
      return pathToReturn;
    }
  }
  
  function calculatePathAndSaveIfExists(path, plugin, name) {
    if (path.length === 0) {
      var calculatedPath = findPluginPathHelper(plugin, name);
      if (calculatedPath.length > 0) {
        calculatedPath.forEach(function(item) {
          path.push(item);
        })
      
        path.unshift(plugin.name);
      }
    }
  }
  
  function getProperties(pluginName) {
    var pathInPlugin = getModulePath(pluginName);
    var config = {};
    try {
      config = require(pathToPlugins + pathInPlugin + '/config.json');
    } catch(e) {
      console.log('config to ' + pluginName + ' not found');
    }
    
    var info = {}
    try {
      info = require(pathToPlugins + pathInPlugin + '/plugin.json');
    } catch(e) {
      console.log('plugin.json to ' + pluginName + ' not found');
    }
    return {config: config, info: info};
  }
  
  function setProperties(pluginName, properties) {
    //write to local config in pluginConfig
    var localconfig = getConfigForPlugin(pluginConfig, pluginName);
    localconfig.config = properties;
    
    //write to config file
    var pathInPlugin = findPluginPath(pluginName);
    var configPath = pathToPlugins + pathInPlugin + '/config.json';
    var dir = path.join(__dirname, configPath);
    
    return fs.write(dir, JSON.stringify(properties, null, 2));
  }
  
  function savePluginSwitch(pluginName, enabled) {
    try {
      var pathToConfig = pathToPlugins + 'config.json';
      var config = require(pathToConfig);
       
      var inlineConfig = getConfigForPlugin(config, pluginName);
      inlineConfig.enabled = enabled;
      
      var dir = path.join(__dirname, pathToConfig);
      fs.write(dir, JSON.stringify(config, null, 2));
    } catch(e) {
      console.log(e);
      console.log('Save of Plugin switch not possible');
    }
  }
  
  function getConfigForPlugin(globalConfig, pluginName) {
    var inlineConfig = globalConfig.plugins;
    
    var pluginPath = findPluginPath(pluginName);
    pluginPath.forEach(function(part) {
      inlineConfig = findPluginInArray(inlineConfig, part);
      if (pluginPath.indexOf(part) !== pluginPath.length - 1) {
        inlineConfig = inlineConfig.plugins;
      }
    });
    
    return inlineConfig;
  }
  
  function findPluginInArray(array, pluginName) {
    var plugin;
    array.forEach(function(item) {
      if (item.name === pluginName) {
        plugin = item;
      }
    });
    return plugin;
  }
  
  function startPlugin(pluginName) {
    //check if already started
    var currentStatus = getStatus(pluginName);
    if (!currentStatus.status) {
      var config = getConfigForPlugin(pluginConfig, pluginName);
      config.enabled = true;
      loadPlugin(config, exchange, currentStatus, true);
    }
  }
  
  function switchPlugin(pluginName) {
    var currentStatus = getStatus(pluginName).status;
    if (currentStatus) {
      stopPlugin(pluginName);
    } else {
      startPlugin(pluginName);
    }
  }
  
  function restartPlugin(pluginName) {
    var currentStatus = getStatus(pluginName);
    if (currentStatus.status) {
      stopPlugin(pluginName);
      startPlugin(pluginName);
    }  
  }
  
}
