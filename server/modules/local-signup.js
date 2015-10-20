'use strict';

var express = require('express');
var mongoose = require('mongoose');

module.exports = LocalSignUp;

LocalSignUp.$inject = ['server', 'passport', 'logFunc'];
function LocalSignUp(server, passport, log) {
  server.post('/signup', function(req, res) {
    passport.authenticate('local-signup', function(err, user) {
      log(2);
      if (err) res.sendStatus(500);
      log(3);

      if (user) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }

    })(req, res);
  });
}
