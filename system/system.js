'use strict';

var pathToPlugins = "../../plugins/";
var pluginConfig = require(pathToPlugins + 'config.json');

var system = {};
system.start = start;
system.stop = stop;
system.stopPlugin = stopPlugin;

var exchange = {}; 
system.status = '0';
system.pluginStatus = {};

function start() {
  loadPlugins(pluginConfig.plugins, pathToPlugins, exchange, system.pluginStatus, true);
  system.status = '1';
}

function loadPlugins(plugins, pluginsRootPath, exchange, pluginStatus, depLoaded) {
  if (!plugins) {
    return;
  }
  
  plugins.forEach(function initialisePlugin(plugin) {
    loadPlugin(pluginsRootPath, plugin, exchange, pluginStatus, depLoaded);
  });
}

function loadPlugin(moduleRootPath, config, exchange, pluginStatus, depLoaded) {
  if (config.enabled && depLoaded) {
    console.log('Starting ' + config.name + ' ...');
    
    pluginStatus[config.name] = {
      status: false,
      plugins: {}
    };
    try {
      var module = require(moduleRootPath + config.name);
      
      module.start(exchange);
      
      pluginStatus[config.name].status = true;
      
      var pluginsPath = moduleRootPath + config.name + '/plugins/';
      loadPlugins(config.plugins, pluginsPath, exchange, pluginStatus[config.name].plugins, true);
    } catch (e) {
      console.log('Could not load plugin: ' + config.name);
      console.log(e);
      pluginStatus[config.name].status = false;
    }
  
  } else {
    pluginStatus[config.name] = {
      status: false,
      plugins: {}
    };
    loadPlugins(config.plugins, pluginsPath, exchange, pluginStatus[config.name].plugins, false);
  }
}

function stop() {
  pluginConfig.plugins.forEach(stopPlugin);  
  system.status = '0';
}

function stopPlugin(plugin) {
  var status = getStatus(plugin);
  
  if (status.status) {
    var pluginPath = getModulePath(plugin);
    
    try {
      //stop all plugins which require this one
      var inlinePlugins = Object.keys(status.plugins);
      inlinePlugins.forEach(function(inlinePlugin) {
        stopPlugin(inlinePlugin);
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
    currentPlugin.plugins.forEach(function(plugin) {
      calculatePathAndSaveIfExists(pathToReturn, plugin, name);
    });
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

module.exports = system;
