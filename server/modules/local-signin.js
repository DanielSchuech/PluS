'use strict';

var express = require('express');
var mongoose = require('mongoose');

module.exports = LocalSignIn;

LocalSignIn.$inject = ['server', 'passport', 'userModel'];
function LocalSignIn(server, passport, User) {
  server.get('/signin', function(req, res) {
    passport.authenticate('local-signin', function(err, user, reason) {

      if (err) throw err;

      // login was successful if we have a user
      if (user) {
        // handle login success
        res.send(user);
        return;
      }

      // otherwise we can determine why we failed
      var reasons = User.failedLogin;
      switch (reason) {
        case reasons.NOT_FOUND:
          res.sendStatus(401);
          break;
        case reasons.PASSWORD_INCORRECT:
          // note: these cases are usually treated the same - don't tell
          // the user *why* the login failed, only that it did
          res.sendStatus(402);
          break;
        case reasons.MAX_ATTEMPTS:
          // send email or otherwise notify user that account is
          // temporarily locked
          res.sendStatus(403);
          break;
      }

    });
  });

}
