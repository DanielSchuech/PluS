'use strict';

var component = require('../routing.module');

component.controller('LoginController', LoginController);

function LoginController($translate, UserManagementService, $state) {
  var vm = this;
  
  vm.changeLanguageTo = changeLanguageTo;
  vm.compareRegPasswords = compareRegPasswords;
  vm.login = login;
  vm.signup = signup;
  
  UserManagementService.checkLogin();
  loadInitialLang();
  
  function changeLanguageTo(newLang) {
    $translate.use(newLang);
    vm.lang = newLang;
  }
  
  function loadInitialLang() {
    vm.lang = localStorage['WEB.LCID'];
    if (!vm.lang) {
      vm.lang = $translate.proposedLanguage();
    }
  }
  
  vm.invalidPW2 = false;
  function compareRegPasswords() {
    if (vm.reg_pw1 !== vm.reg_pw2) {
      vm.invalidPW2 = true;
    } else {
      vm.invalidPW2 = false;
    }
  }
  
  
  function login() {
    vm.loginFailure = 0;
    
    var loginPromise = UserManagementService.login(vm.log_email, vm.log_pw);
    
    loginPromise.then(loginCorrect, loginFailed);
    
    function loginCorrect() {console.log('correct')
      $state.go('home.status');
    }
    
    function loginFailed(err) {
      console.log(err);
      vm.loginFailure = err.status; 
    }
  }
  
  vm.regFailed = false;
  function signup() {
    vm.regFailed = false;
    
    UserManagementService.signup(vm.reg_email, vm.reg_pw1).then(regSuccess, regFailed);
    
    function regSuccess() {
      $state.go('home.status');
    }
    
    function regFailed() {
      vm.regFailed = true;;
    }
  }
}
