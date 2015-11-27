'use strict';

var requires = [
  
];

module.exports = angular.module('app.helpers', requires);

// controllers
require('./switch/switch.controller');
require('./statusstyler/statusstyler.controller');

// directives
require('./switch/switch.directive');
require('./statusstyler/statusstyler.directive');

// services

// routes
