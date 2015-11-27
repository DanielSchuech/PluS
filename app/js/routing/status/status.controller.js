'use strict';

var component = require('../routing.module');

component.controller('StatusController', StatusController);

function StatusController(PluginSystemService, $interval, $scope) {
  var vm = this;
  vm.startAndStop = startAndStop;
  
  var startTranslationKey = 'start';
  var stopTranslationKey = 'stop';
  
  vm.startStopButtonText = stopTranslationKey;
  refreshStatus();
  
  var interval = $interval(refreshStatus, 5000);
  $scope.$on('$destroy', function iVeBeenDismissed() {
    $interval.cancel(interval);
  });
  
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
