'use strict';

var component = require('./apiv1.module');

component.service('PluginSystemService', PluginSystemService);

function PluginSystemService($http) {
  this.getStatus = getStatus;
  this.start = start;
  this.stop = stop;
  this.getPlugins = getPlugins;
  
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
    return $http.get('/plugin-system/plugins').then(returnDataOfResponse).then(JSON2Array);
  }
  
  function JSON2Array(json) {
      var array = [];
      var keys = Object.keys(json);
      keys.forEach(function(key) {
        array.push({
          name: key,
          status: json[key]
        });
      });
      
      return array;
    }
}
