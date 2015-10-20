var LocalStrategy = require('passport-local').Strategy;

module.exports = PassportLocal;

PassportLocal.$inject = ['passport', 'userModel', 'logFunc'];
function PassportLocal(passport, User, log) {

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
      log('test0')
      // asynchronous
      // User.findOne wont fire unless data is sent back

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({'email': email}, function (err, user) {

          log(err, user)
          // if there are any errors, return the error
          if (err) {
            return done(err);
          }
          log('test1')


          // check to see if there is already a user with that email
          if (user) {
            return done(null, false, 'That email is already taken.');
            log('test2')
          } else {
            log('test3')

            // if there is no user with that email
            // create the user
            var newUser = new User({
              'email': email,
              'local.password': password
            });

            // save the user
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }

        });

    }));

  passport.use('local-signin', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) { // callback with email and password from our form

      // attempt to authenticate user
      User.getAuthenticated(email, password, function (err, user, reason) {
        if (err) done(err);

        // login was successful if we have a user
        if (user) {
          // handle login success
          done(null, user);
        }

        // otherwise send back the reason why it failed
        done(null, false, reason)
      });

    }));
}
