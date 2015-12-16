var express = require('express');

var exp = {};
exp.start = startServer;
exp.stop = stopServer;
module.exports = exp;

var server;

function startServer(exchange, config) {
  var app = express();
  
  app.get('/', function (req, res) {
    res.send('Hello World');
  });
   
  //TODO Port konfigurierbar gestalten 
  server = app.listen(config.port);console.log('started on '+config.port)
  
  //TODO namen aus package JSON des Plugins auslesen
  exchange['express'] = {
    'server': app
  };
}

function stopServer() {
  server.close(function() {
    console.log('closing express server')
  });
}
