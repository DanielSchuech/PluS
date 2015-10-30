'use strict';

module.exports = PluginSys;

PluginSys.$inject = ['server', 'config', 'plugin-system'];
function PluginSys(server, config, pluginSystem) {
  console.log('a')
  server.use('/plugin-system/status', function(req, res, next) {
    res.send(pluginSystem.status);
  });  
}
