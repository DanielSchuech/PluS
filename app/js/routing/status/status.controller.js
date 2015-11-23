'use strict';

var component = require('../routing.module');

component.controller('StatusController', StatusController);

function StatusController(PluginSystemService, $interval) {
  var vm = this;
  vm.startAndStop = startAndStop;
  
  var startTranslationKey = 'start';
  var stopTranslationKey = 'stop';
  
  vm.startStopButtonText = stopTranslationKey;
  refreshStatus();
  $interval(refreshStatus, 5000);
  
  function startAndStop() {
    if (vm.status === '0') {
      PluginSystemService.start().then(refreshStatus);
    } else {
      PluginSystemService.stop().then(refreshStatus);
    }
  }
  
  function refreshStatus() {
    PluginSystemService.getStatus().then(function(status) {
      vm.status = status;
      
      if (status === '1') {
        vm.startStopButtonText = stopTranslationKey;
      } else {
        vm.startStopButtonText = startTranslationKey;
      }
    });
  }
}
