'use strict';

module.exports = PluginSys;

PluginSys.$inject = ['server', 'config', 'plugin-system'];
function PluginSys(server, config, pluginSystem) {
  server.use('/plugin-system/status', function(req, res, next) {
    res.send(pluginSystem.status);
  });
  server.use('/plugin-system/stop', function(req, res, next) {
    if (req.user) {
      pluginSystem.stop();
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });  
  server.use('/plugin-system/start', function(req, res, next) {
    if (req.user) {
      pluginSystem.start();
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  }); 
}
