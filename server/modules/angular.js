'use strict';

var path = require('path');

module.exports = Angular;

Angular.$inject = ['server', 'config'];
function Angular(server, config) {
  var distDir = path.join(config.dist.root, 'plugin_system', 'dist');
  
  //resolve glyphicons fonts
  server.get('/fonts/:font', function(req, res) {
    res.sendFile('/fonts/' + req.params.font, {root: distDir});
  });

  // Serve index.html for all routes to leave routing up to Angular
  server.get('/*', function(req, res) {
    res.sendFile('index.html', {root: distDir});
  });

}
