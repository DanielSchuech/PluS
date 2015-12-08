'use strict';

var component = require('../routing.module');

component.controller('PluginInfoController', PluginInfoController);

function PluginInfoController(PluginSystemService, $stateParams, $timeout) {
  var vm = this;
  vm.save = save;
  
  $timeout(init, 10);
  
  function init() {
    PluginSystemService.getProperties($stateParams.plugin).then(function(data) {
      structureInfo(data.info)
      
      if (data.config.length > 0) {
        vm.configAvailable = true;
        vm.config = data.config;
      } else {
        vm.configAvailable = false;
      }
    });
  }
  
  function structureInfo(info) {
    vm.info = info;
    
    vm.info.author = makeArray(vm.info.author);
    vm.info.keywords = convertArrayToString(vm.info.keywords);
  
  }
  
  function makeArray(json) {
    if (!Array.isArray(json)) {
      json = [json];
    }
    return json;
  }
  
  function convertArrayToString(input) {
    if (Array.isArray(input)) {
      var array = input;
      input = '';
      array.forEach(function(author) {
        input += author;
        if (array.indexOf(author) < array.length - 1) {
          input += ', ';
        }
      });
    }
    return input;
  }
  
  function save() {
    PluginSystemService.setProperties($stateParams.plugin, vm.config);
  }
}
