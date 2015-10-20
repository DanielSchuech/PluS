// connect to userDatabase
mongoose.connect(config.databases.user, function(err) {
  if (err) logFunc(err);
});