var express = require('express');

var exp = {};
exp.start = startServer;
exp.stop = stopServer;
module.exports = exp;

var server;

function startServer(exchange) {
  var app = express();
  
  app.get('/', function (req, res) {
    res.send('Hello World');
  });
   
  //TODO Port konfigurierbar gestalten 
  server = app.listen(3000);
  
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
