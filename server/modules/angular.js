'use strict';

var path = require('path');

module.exports = Angular;

Angular.$inject = ['server', 'config'];
function Angular(server, config) {
  //resolve glyphicons fonts
  server.get('/fonts/:font', function(req, res) {console.log('A '+req.params.font)
    res.sendFile('/dist/fonts/' + req.params.font, {root: config.dist.root});
  });

  // Serve index.html for all routes to leave routing up to Angular
  var distDir = path.join(config.dist.root, 'plugin_system', 'dist');
  server.get('/*', function(req, res) {
    res.sendFile('index.html', {root: distDir});
  });

}
