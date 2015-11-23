'use strict';

var component = require('../routing.module');

component.controller('HomeController', HomeController);

function HomeController(UserManagementService, $interval, PluginSystemService) {
  var vm = this;
  
  UserManagementService.checkLogin();
  
  refreshSystemStatus();
  $interval(refreshSystemStatus, 5000);
  
  function refreshSystemStatus() {
    PluginSystemService.getStatus().then(statusGetSuccess);
    
    function statusGetSuccess(status) {
      vm.pluginSystemStatus = status;
    }
  };
}
