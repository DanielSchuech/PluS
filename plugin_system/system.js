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
    if (plugin.enabled) {
      console.log('Starting ' + plugin.name + ' ...');
      
      try {
        var module = require(pathToPlugins + plugin.name);
        
        module.start(exchange);
        system.pluginStatus[plugin.name] = true;
      } catch (e) {
        console.log('Could not load plugin: ' + plugin.name);
        console.log(e);
        system.pluginStatus[plugin.name] = false;
      }
    
    }
  });
  system.status = '1';
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
