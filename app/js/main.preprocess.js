'use strict';

//@if !isProd
window.LiveReloadOptions = {host: 'dschuech.koding.io'};
require('livereload-js');
//@endif

// Angular
require('angular');

require('./templatecache');
require('./translation');
require('./routing');
require('./apiv1');

// create and bootstrap application

var requires = [
  'app.templateCache',
  'app.translation',
  'app.routing',
  'app.apiv1'
];

angular.module('app', requires);
