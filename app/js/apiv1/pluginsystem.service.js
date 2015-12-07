'use strict';

var component = require('./apiv1.module');

component.service('PluginSystemService', PluginSystemService);

function PluginSystemService($http) {
  this.getStatus = getStatus;
  this.start = start;
  this.stop = stop;
  this.getPlugins = getPlugins;
  this.startPlugin = startPlugin;
  this.getProperties = getProperties;
  this.setProperties = setProperties;
  
  function getStatus() {
    return $http.get('/plugin-system/status').then(returnDataOfResponse, statusGetFailed);
    
    function statusGetFailed() {
      return 0;
    }
  }
  
  function returnDataOfResponse(res) {
      return res.data;
    }
  
  function start() {
    return $http.get('/plugin-system/start');
  }
  
  function stop() {
    return $http.get('/plugin-system/stop');
  }
  
  function getPlugins() {
    return $http.get('/plugin-system/plugins').then(returnDataOfResponse).then(JSON2ArrayPlugins);
  }
  
  function JSON2ArrayPlugins(json) {
    var array = [];
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      var inlinePlugins = JSON2ArrayPlugins(json[key].plugins);
      array.push({
        name: key,
        status: json[key].status,
        plugins: inlinePlugins
      });
    });
    
    return array;
  }
  
  function startPlugin(name) {
    return $http.get('/plugin-system/stop-plugin/' + name);
  }
  
  function getProperties(name) {
    return $http.get('/plugin-system/properties/' + name).then(returnDataOfResponse).then(JSON2Array);
  }
  
  function setProperties(name, array) {
    return $http.post('/plugin-system/properties/' + name, {
      properties: Array2JSON(array)
    });
  }
  
  function JSON2Array(json) {
    var array = [];
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      array.push({
        name: key,
        value: json[key]
      });
    });
    return array;
  }
  
  function Array2JSON(array) {
    var json = {};
    array.forEach(function(item) {
      json[item.name] = item.value;
    });
    return json;
  }
}
