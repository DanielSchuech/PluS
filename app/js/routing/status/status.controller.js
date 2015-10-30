'use strict';

var component = require('../routing.module');

component.controller('StatusController', StatusController);

function StatusController() {
  var vm = this;
  console.log('status')
}
