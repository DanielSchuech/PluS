'use strict';

var component = require('./apiv1.module');

component.service('PluginSystemService', PluginSystemService);

function PluginSystemService($http) {
  this.getStatus = getStatus;
  this.start = start;
  this.stop = stop;
  
  function getStatus() {
    return $http.get('/plugin-system/status').then(statusGetSuccess, statusGetFailed);
    
    function statusGetSuccess(status) {
      return status.data;
    }
    function statusGetFailed() {
      return 0;
    }
  }
  
  function start() {
    return $http.get('/plugin-system/start');
  }
  
  function stop() {
    return $http.get('/plugin-system/stop');
  }
}
