'use strict';

var pathToPlugins = "../plugins/";
var pluginConfig = require(pathToPlugins + 'config.json');

module.exports = startPluginSystem;

function startPluginSystem() {
  var exchange = {};
  
  pluginConfig.plugins.forEach(function initialisePlugin(plugin) {
    if (plugin.enabled) {
      console.log('Starting ' + plugin.name + ' ...');
      
      try {
        var module = require(pathToPlugins + plugin.name);
        
        module(exchange);
      } catch (e) {
        console.log('Could not load plugin: ' + plugin.name);
        console.log(e);
      }
    
    }
  });
}
