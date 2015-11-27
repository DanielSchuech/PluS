//Author: Daniel Schuech
'use strict';

var component = require('./../helpers.module');

component.directive('switch', switchDirective);

/**
 * * @ngInject
 */
function switchDirective() {
  return {
    restrict: 'E',
    scope: {
      inputModel: '=',
      onChange: '=',
      onChangeArgs: '=',
      ngDisabled: '=',
      changeModel: '='
    },
    template: require('./switch.directive.html'),
    controller: 'SwitchController',
    controllerAs: 'SwitchCtrl',
    bindToController: true
  };
}
