var exp = {}
exp.start = newRoute;
module.exports = exp;

function newRoute(exchange) {
  var app = exchange['express'].server;
  
  app.get('/secondlevel', function (req, res) {
    res.send('Everything is a PLUGIN');
  });
}
