'use strict';

var component = require('../routing.module');

component.controller('PluginInfoController', PluginInfoController);

function PluginInfoController(PluginSystemService, $stateParams, $timeout) {
  var vm = this;
  vm.save = save;
  
  $timeout(init, 10);
  
  function init() {
    PluginSystemService.getProperties($stateParams.plugin).then(function(data) {
      if (data.length > 0) {
        vm.configAvailable = true;
        vm.config = data;
      } else {
        vm.configAvailable = false;
      }
    });
  }
  
  function save() {
    PluginSystemService.setProperties($stateParams.plugin, vm.config);
  }
}
