'use strict';

var component = require('../routing.module');

component.controller('LoginController', LoginController);

function LoginController($translate) {
  var vm = this;
  
  vm.changeLanguageTo = changeLanguageTo;
  
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
}
