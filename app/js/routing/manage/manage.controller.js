'use strict';

var component = require('../routing.module');

component.controller('ManageController', ManageController);

function ManageController(PluginSystemService) {
  var vm = this;
  vm.switchPlugin = switchPlugin;
  vm.collapse = collapse;
  
  vm.plugins = {};
  init();
  
  function init() {
    PluginSystemService.getPlugins().then(getPlugins);
    
    function getPlugins(data) {
      vm.plugins = data;
      collapseAll(vm.plugins);
    }
  }
  
  function switchPlugin(name) {
    PluginSystemService.switchPlugin(name).then(init);
  }
  
  function collapseAll(plugins) {
    plugins.forEach(function(plugin) {
      if (plugin.plugins.length > 0) {
        plugin.collapse = true;
        collapseAll(plugin.plugins);
      }
    });
  }
  
  function collapse(plugin) {
    plugin.collapse = !plugin.collapse;
  }

}
