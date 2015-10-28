'use strict';

require('angular-ui-router');

var requires = [
  'ui.router'
];

module.exports = angular.module('app.routing', requires);

// controllers
require('./login/login.controller');

// directives

// services

// routes
require('./routing.routes');
