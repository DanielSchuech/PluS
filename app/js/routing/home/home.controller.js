'use strict';

var component = require('../routing.module');

component.controller('HomeController', HomeController);

function HomeController(UserManagementService) {
  var vm = this;
  
  UserManagementService.checkLogin();
}
