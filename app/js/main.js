'use strict';

window.LiveReloadOptions = {host: 'dschuech.koding.io'};
require('livereload-js');
// Angular
require('angular');

require('./templatecache');
require('./translation');
require('./routing');
require('./apiv1');
require('./helpers');

// create and bootstrap application

var requires = [
  'app.templateCache',
  'app.translation',
  'app.routing',
  'app.apiv1',
  'app.helpers'
];

angular.module('app', requires);
