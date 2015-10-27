module.exports = createServer;

function createServer(exchange) {
  
  var express = require('express');
  var app = express();
   
  app.get('/', function (req, res) {
    res.send('Hello World');
  });
   
  //TODO Port konfigurierbar gestalten 
  app.listen(3000);
  
  //TODO namen aus package JSON des Plugins auslesen
  exchange['express'] = {
    'server': app
  };

}