module.exports = DependencyManager;

var exec = require('child_process').exec;
var q = require('q');

DependencyManager.$inject = ['config'];
function DependencyManager(config) {console.log('b')
  var vm = this;
  vm.getPluginsAndDeps = searchForPlugins;
  
  searchForPlugins();
  
  function searchForPlugins() {console.log('start')
    var deffered = q.defer();
    var plugins = [];
    //Buffer max size: 5mb
    var child = exec("npm ls --json", {maxBuffer: 1024 * 5000}, processNpmList);
    
    function processNpmList(error, stdout, stderr) {console.log('a')
      if (error || stderr) {
        return deffered.reject('Error on searching for plugins: '+ error + stderr);
      }
      plugins = JSON.parse(stdout).dependencies;
      plugins = filterDependencies(plugins, "^ang");//"^" + config.pluginPrefix);
      
      console.log(JSON.stringify(plugins, null ,2))
      deffered.resolve(plugins);
    }
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
}
