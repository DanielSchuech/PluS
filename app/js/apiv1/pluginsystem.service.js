'use strict';

var component = require('./apiv1.module');

component.service('PluginSystemService', PluginSystemService);

function PluginSystemService($http) {
  this.getStatus = getStatus;
  
  function getStatus() {
    return $http.get('/plugin-system/status');
  }
}
