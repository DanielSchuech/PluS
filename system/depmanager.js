'use strict';

module.exports = DependencyManager;

var exec = require('child_process').exec;
var q = require('q');

DependencyManager.$inject = ['config'];
function DependencyManager(config) {
  var vm = {};
  vm.initialise = initialise;
  vm.isInitialised = isInitialised;
  
  vm.plugins = {};
  
  
  var _isInitialised = false;
  function isInitialised() {
    return _isInitialised;
  }
  
  function initialise() {
    var deffered = q.defer();
    var plugins = [];
    //Buffer max size: 10mb
    var child = exec("npm ls --json --long", {maxBuffer: 1024 * 10000}, processNpmList);
    
    function processNpmList(error, stdout, stderr) {
      if (error || stderr) {
        console.log('Error on searching for plugins: '+ error + stderr);
        return deffered.reject('Error on searching for plugins: '+ error + stderr);
      }
      plugins = JSON.parse(stdout).dependencies;
      plugins = filterDependencies(plugins, "^" + config.pluginPrefix);
       
      //console.log('test '+JSON.stringify(plugins, null ,2))
      vm.plugins = plugins;
      _isInitialised = true;
      deffered.resolve(plugins);
    }
    
    return deffered.promise;
  }
  
  function filterDependencies(json, regexString) {
    if (!json || json === {}) {
      return {};
    }
    var pattern = new RegExp(regexString);
    var returnJson = {};
    var keys = Object.keys(json);
    keys.forEach(function(entry) {
      if (pattern.test(entry)) {
        returnJson[entry] = json[entry];
        returnJson[entry].dependencies = filterDependencies(returnJson[entry].dependencies, regexString);
      }
    });
    
    return returnJson;
  }
  
  return vm;
}
