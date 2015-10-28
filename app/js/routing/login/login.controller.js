'use strict';

var component = require('../routing.module');

component.controller('LoginController', LoginController);

function LoginController($translate) {
  var vm = this;
  
  vm.changeLanguageTo = changeLanguageTo;
  vm.comparePasswords = comparePasswords;
  
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
  function comparePasswords() {
    if (vm.pw1 !== vm.pw2) {
      vm.invalidPW2 = true;
    } else {
      vm.invalidPW2 = false;
    }
  }
}
