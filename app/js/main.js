'use strict';

window.LiveReloadOptions = {host: 'dschuech.koding.io'};
require('livereload-js');
// Angular
require('angular');

require('./templatecache');
require('./translation');
require('./routing');

// create and bootstrap application

var requires = [
  'app.templateCache',
  'app.translation',
  'app.routing'
];

angular.module('app', requires);
