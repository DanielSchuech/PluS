//Author: Daniel Schuech
'use strict';

var component = require('./../helpers.module');

component.directive('statusStyler', statusStyler);

/**
 * * @ngInject
 */
function statusStyler() {
  return {
    restrict: 'E',
    scope: {
      inputModel: '='
    },
    template: require('./statusstyler.directive.html'),
    controller: 'StatusStylerController',
    controllerAs: 'stylerCtrl',
    bindToController: true
  };
}
