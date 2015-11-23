var exp = {}
exp.start = newRoute;
module.exports = exp;

function newRoute(exchange) {
  var app = exchange['express'].server;
  
  app.get('/test', function (req, res) {
    res.send('New Page through Plugin');
  });
}
