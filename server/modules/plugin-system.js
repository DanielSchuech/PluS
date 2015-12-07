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
  
  server.get('/plugin-system/plugins', function(req, res, next) {
    res.send(pluginSystem.pluginStatus);
  });
  
  server.get('/plugin-system/stop-plugin/:plugin', function(req, res, next) {
    res.send(pluginSystem.stopPlugin(req.params.plugin));
  });
  
  server.get('/plugin-system/properties/:plugin', function(req, res, next) {
    res.send(pluginSystem.getProperties(req.params.plugin));
  });  
  
  server.post('/plugin-system/properties/:plugin', function(req, res, next) {
    pluginSystem.setProperties(req.params.plugin, req.body.properties).then(success, failed);
    
    function success() {
      res.sendStatus(200);
    }
    
    function failed(a) {console.log(a)
      res.sendStatus(400);
    }
  });  
}
