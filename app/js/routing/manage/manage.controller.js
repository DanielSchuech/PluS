'use strict';

var component = require('../routing.module');

component.controller('ManageController', ManageController);

function ManageController(PluginSystemService) {
  var vm = this;
  
  init();
  
  function init() {
    PluginSystemService.getPlugins().then(getPlugins);
    
    function getPlugins(data) {
      vm.plugins = data;
    }
  }
}
