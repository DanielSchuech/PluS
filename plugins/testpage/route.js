module.exports = newRoute;

function newRoute(exchange) {
  var app = exchange['express'].server;
  
  app.get('/test', function (req, res) {
    res.send('New Page through Plugin');
  });
}
