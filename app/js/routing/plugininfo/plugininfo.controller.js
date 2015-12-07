'use strict';

var component = require('../routing.module');

component.controller('PluginInfoController', PluginInfoController);

function PluginInfoController(PluginSystemService, $stateParams, $timeout) {
  var vm = this;
  
  $timeout(function() {
    console.log($stateParams)
  }, 1000);  
  
  PluginSystemService.getProperties('express').then(function(data) {
    vm.config = data;
  });
}
