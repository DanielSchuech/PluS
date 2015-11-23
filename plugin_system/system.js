'use strict';

var pathToPlugins = "../plugins/";
var pluginConfig = require(pathToPlugins + 'config.json');

var system = {};
system.start = start;
system.stop = stop;

var exchange = {}; 
system.status = '0';
system.pluginStatus = {};

function start() {
  pluginConfig.plugins.forEach(function initialisePlugin(plugin) {
    
  });
  loadPlugins(pluginConfig.plugins, pathToPlugins, exchange, system.pluginStatus)
  system.status = '1';
}

function loadPlugins(plugins, pluginsRootPath, exchange, pluginStatus) {
  if (!plugins) {
    return;
  }
  
  plugins.forEach(function initialisePlugin(plugin) {
    loadPlugin(pluginsRootPath, plugin, exchange, pluginStatus);
  });
}

function loadPlugin(moduleRootPath, config, exchange, pluginStatus) {
  if (config.enabled) {
      console.log('Starting ' + config.name + ' ...');
      
      try {
        var module = require(moduleRootPath + config.name);
        
        module.start(exchange);
        pluginStatus[config.name] = true;
        
        var pluginsPath = moduleRootPath + config.name + '/plugins/';
        loadPlugins(config.plugins, pluginsPath, exchange, pluginStatus);
      } catch (e) {
        console.log('Could not load plugin: ' + config.name);
        console.log(e);
        pluginStatus[config.name] = false;
      }
    
    }
}

function stop() {
  pluginConfig.plugins.forEach(function initialisePlugin(plugin) {
    if (system.pluginStatus[plugin.name]) {
      var module = require(pathToPlugins + plugin.name);
      if (module.stop) {console.log(plugin.name);
        module.stop(exchange);
      }
      system.pluginStatus[plugin.name] = false;
    }
  });  
  system.status = '0';
}

module.exports = system;
