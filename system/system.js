'use strict';

module.exports = System;

var fs = require("q-io/fs");
var path = require('path');

var config = require('./config');

System.$inject = ['depmanager'];
function System(depManager) {console.log('a');
  var vm = {};
  vm.start = start;
  vm.stop = stop;
  vm.switchPlugin = switchPlugin;
  vm.restartPlugin = restartPlugin;
  vm.getProperties = getProperties;
  vm.setProperties = setProperties;
  
  var exchange = {}; 
  vm.status = '0';
  vm.pluginStatus = {};
  
  start();
  
  return vm; 
  
  function start() {
    console.log('Starting plugins........');
    loadPlugins();
    
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
      keys.forEach(function(plugin) {console.log('begin '+plugin)
        vm.pluginStatus[plugin] = loadPlugin(plugin);
      });
    }
  }
  
  function loadPlugin(plugin) {
    //check if enabled
    if (config.plugins[plugin]) {
      var depsLoaded = loadDeps(depManager.plugins[plugin]);
      
      console.log('Starting ' + plugin + ' ...');
      
      try {
        var module = require(plugin);
        
        module.start(exchange, config.config);
        
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
      if (!vm.pluginStatus[key]) {
        var keyLoaded = loadPlugin(key);
        if (!keyLoaded) {
          allPluginsLoaded = false;
        }
      }
    });
    return allPluginsLoaded;
  }
  
  //---------------------------------------------------------------OLD CODE -----------------------------------------------------------------------
  function loadPluginsConfigs(globalConfig) {
    globalConfig.plugins.forEach(function(entry) {
      var entryConfig = {};
      try {
        var entryModulePath = pathToPlugins + getModulePath(entry.name);
        entryConfig = require(entryModulePath + '/config.json');
      } catch(e) {}
      entry.config = entryConfig;
      
      if (entry.plugins) {
        loadPluginsConfigs(entry);
      }
    });
  }
  
  function _loadPlugins(plugins, exchange, pluginStati, depLoaded) {
    if (!plugins) {
      return;
    }
    
    plugins.forEach(function initialisePlugin(plugin) {
      pluginStati[plugin.name] = {
        status: false,
        plugins: {}
      };
      loadPlugin(plugin, exchange, pluginStati[plugin.name], depLoaded);
    });
  }
  
  function _loadPlugin(config, exchange, pluginStatus, depLoaded) {
    if (config.enabled && depLoaded) {
      console.log('Starting ' + config.name + ' ...');
      
      try {
        var modulePath = pathToPlugins + getModulePath(config.name);
        var module = require(modulePath);
        
        module.start(exchange, config.config);
        
        pluginStatus.status = true;
        
        loadPlugins(config.plugins, exchange, pluginStatus.plugins, true);
      } catch (e) {
        console.log('Could not load plugin: ' + config.name);
        console.log(e);
        pluginStatus.status = false;
      }
    
    } else {
      loadPlugins(config.plugins, exchange, pluginStatus.plugins, false);
    }
  }
  
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
