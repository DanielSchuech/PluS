'use strict';

require('angular-ui-router');

var requires = [
  'ui.router'
];

module.exports = angular.module('app.routing', requires);

// controllers
require('./login/login.controller');
require('./home/home.controller');
require('./status/status.controller');
require('./manage/manage.controller');

// directives

// services

// routes
require('./routing.routes');
