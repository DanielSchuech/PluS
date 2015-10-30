angular.module("app.templateCache", []).run(["$templateCache", function($templateCache) {$templateCache.put("dummy.cache.html","dummy");
$templateCache.put("routing/home/home.cache.html","<div class=\"container main-container\">\n  <div class=\"main-header\">\n    <any>\n      {{ \"welcome.message\" | translate }}\n    </any>\n    <any class=\"main-serverstatus\">\n      Current Status: \n      <any ng-show=\"homeCtrl.pluginSystemStatus == 1\" class=\"success\">\n        running\n      </any>\n      <any ng-show=\"homeCtrl.pluginSystemStatus == 0\" class=\"error\">\n        stopped\n      </any>\n    </any>\n  </div>\n  <div>\n    <table class=\"main-table full-width\">\n      <tr>\n        <td class=\"col-xs-3 col-sm-3 col-md-3 col-lg-3\">\n          <div class=\"list-group main-menu\">\n            <a class=\"list-group-item main-menu-item\">\n              Server Status\n            </a>\n            <a class=\"list-group-item main-menu-item\">\n              Plugins verwalten\n            </a>\n            <a class=\"list-group-item main-menu-item\">\n              Plugins installieren\n            </a>\n            <a class=\"list-group-item main-menu-item\">\n              Menüs verwalten\n            </a>\n          </div>\n        </td>\n        \n        <td class=\"col-xs-9 col-sm-9 col-md-9 col-lg-9\">\n          <div class=\"main-content\" ui-view=\"content\">\n      \n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>");
$templateCache.put("routing/login/login.cache.html","<div class=\"main-login\">\n  <any class=\"login-h\">\n    {{ \"welcome.message\" | translate }}\n  </any>\n  <any class=\"login-lang-box\">\n    <a class=\"login-lang-link\" ng-click=\"loginCtrl.changeLanguageTo(\'de\')\"\n      ng-class=\"{\'bold\': loginCtrl.lang == \'de\'}\">DE</a> \n    |\n    <a class=\"login-lang-link\" ng-click=\"loginCtrl.changeLanguageTo(\'en\')\"\n      ng-class=\"{\'bold\': loginCtrl.lang == \'en\'}\">EN</a>\n  </any>\n  \n  <table class=\"login-table\">\n    <tr>\n      <td>\n        <div class=\"bold login-header\">\n          {{ \"signin\" | translate }}\n        </div>\n        <div>\n          <div class=\"form-group\">\n              <label>{{ \"email\" | translate }}</label>\n              <input type=\"text\" class=\"form-control nearly-full-width\" ng-model=\"loginCtrl.log_email\">\n          </div>\n          <div class=\"form-group\">\n              <label>{{ \"password\" | translate }}</label>\n              <input type=\"password\" class=\"form-control nearly-full-width\" ng-model=\"loginCtrl.log_pw\">\n          </div>\n  \n          <button type=\"button\" class=\"btn btn-warning\" ng-click=\"loginCtrl.login()\">\n            {{ \"signin\" | translate }}\n          </button>\n          \n          <div>\n            <div ng-show=\"loginCtrl.loginFailure === 401\" class=\"alert alert-danger login-alert\">\n              {{ \"login.failure.not_found\" | translate }}\n            </div>\n            <div ng-show=\"loginCtrl.loginFailure === 402\" class=\"alert alert-danger login-alert\">\n              {{ \"login.failure.password_incorrect\" | translate }}\n            </div>\n            <div ng-show=\"loginCtrl.loginFailure === 403\" class=\"alert alert-danger login-alert\">\n              {{ \"login.failure.max_attemps\" | translate }}\n            </div>\n          </div>\n        </div>\n      </td>\n      <td>\n        \n      </td>\n      <td>\n        <div class=\"bold login-header\">\n          {{ \"signup\" | translate }}\n        </div>\n        <div>\n          <div class=\"form-group\">\n              <label>{{ \"email\" | translate }}</label>\n              <input type=\"text\" class=\"form-control\" ng-model=\"loginCtrl.reg_email\">\n          </div>\n          <div class=\"form-group\">\n              <label>{{ \"password\" | translate }}</label>\n              <input type=\"password\" class=\"form-control\" ng-model=\"loginCtrl.reg_pw1\"\n                ng-change=\"loginCtrl.compareRegPasswords()\">\n          </div>\n          <div class=\"form-group\">\n              <label>{{ \"repeat.password\" | translate }}</label>\n              <input type=\"password\" class=\"form-control\" ng-model=\"loginCtrl.reg_pw2\"\n                ng-class=\"{\'input-error\': loginCtrl.invalidPW2}\"\n                ng-change=\"loginCtrl.comparRegePasswords()\">\n          </div>\n  \n          <button type=\"button\" class=\"btn btn-warning\"\n            ng-disabled=\"loginCtrl.invalidPW2\">\n            {{ \"signup\" | translate }}\n          </button>\n        </div>\n      </td>\n    </tr>\n  </table>\n</div>");
$templateCache.put("routing/status/status.cache.html","<div>\n  asdasdsadsadasdsadsadsasdads\n</div>");}]);