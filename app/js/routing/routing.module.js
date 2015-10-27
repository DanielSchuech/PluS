'use strict';

require('angular-ui-router');

var requires = [
  'ui.router'
];

module.exports = angular.module('app.routing', requires);

// controllers

// directives

// services

// routes
require('./routing.routes');
