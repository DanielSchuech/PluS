'use strict';

var pathToPlugins = "../plugins/";
var pluginConfig = require(pathToPlugins + 'config.json');

var system = {};
system.start = start;


var exchange = {}; 
system.status = '0';
system.pluginStatus = {};

function start() {
  pluginConfig.plugins.forEach(function initialisePlugin(plugin) {
    if (plugin.enabled) {
      console.log('Starting ' + plugin.name + ' ...');
      
      try {
        var module = require(pathToPlugins + plugin.name);
        
        module(exchange);
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

module.exports = system;
