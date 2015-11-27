//Author: Daniel Schuech
'use strict';

var component = require('./../helpers.module');

component.controller('SwitchController', SwitchController);

/**
 * @ngInject
 */
function SwitchController($timeout) {
  var vm = this;

  vm.switch = function() {
    if (vm.changeModel) {
      vm.inputModel = !vm.inputModel;
    }
  
    if (vm.onChange) {
      $timeout(function() {
        vm.onChange(vm.onChangeArgs);
      });
    }
  };
}
