'use strict';

//@if !isProd
window.LiveReloadOptions = {host: 'localhost'};
require('livereload-js');
//@endif

// Angular
require('angular');

require('./templatecache.js');
require('./translation');

// create and bootstrap application

var requires = [
  'app.templateCache',
  'app.translation'
];

angular.module('app', requires);
