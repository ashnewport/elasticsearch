webpackJsonp([5],{0:function(module,exports,__webpack_require__){"use strict";__webpack_require__(1),__webpack_require__(1498),__webpack_require__(1377),__webpack_require__(1385),__webpack_require__(1386),__webpack_require__(1387),__webpack_require__(1388),__webpack_require__(1391),__webpack_require__(1398),__webpack_require__(1453),__webpack_require__(1455),__webpack_require__(1183),__webpack_require__(1275),__webpack_require__(1).bootstrap()},724:function(module,exports,__webpack_require__){"use strict";var context=__webpack_require__(1321);context.keys().forEach(function(key){return context(key)})},726:function(module,exports){},727:function(module,exports){},728:function(module,exports){},729:function(module,exports){},730:function(module,exports){},731:function(module,exports){},732:function(module,exports){},733:function(module,exports){},734:function(module,exports){},735:function(module,exports){},736:function(module,exports){},737:function(module,exports){},738:function(module,exports){},739:function(module,exports){},740:function(module,exports){},741:function(module,exports){},742:function(module,exports){},743:function(module,exports){},1321:function(module,exports,__webpack_require__){function webpackContext(req){return __webpack_require__(webpackContextResolve(req))}function webpackContextResolve(req){return map[req]||function(){throw new Error("Cannot find module '"+req+"'.")}()}var map={"./base.less":726,"./callout.less":727,"./config.less":728,"./control_group.less":729,"./dark-theme.less":730,"./dark-variables.less":731,"./fonts.less":732,"./hintbox.less":733,"./input.less":734,"./list-group-menu.less":735,"./local_tabs.less":736,"./navbar.less":737,"./pagination.less":738,"./sidebar.less":739,"./spinner.less":740,"./table.less":741,"./theme.less":742,"./truncate.less":743};webpackContext.keys=function(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=1321},1498:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(1338)["default"],_url=__webpack_require__(379),_lodash=__webpack_require__(1348);__webpack_require__(724),__webpack_require__(1499);var _uiChrome=__webpack_require__(1),_uiChrome2=_interopRequireDefault(_uiChrome),_pluginsSecurityLibParse_next=__webpack_require__(1500),_pluginsSecurityLibParse_next2=_interopRequireDefault(_pluginsSecurityLibParse_next),_pluginsSecurityViewsLoginLoginHtml=__webpack_require__(1501),_pluginsSecurityViewsLoginLoginHtml2=_interopRequireDefault(_pluginsSecurityViewsLoginLoginHtml),messageMap={SESSION_EXPIRED:"Your session has expired. Please log in again."};_uiChrome2["default"].setVisible(!1).setRootTemplate(_pluginsSecurityViewsLoginLoginHtml2["default"]).setRootController("login",function($http,$window,secureCookies,loginState){function setupScope(){var defaultLoginMessage="Login is currently disabled because the license could not be determined. Please check that Elasticsearch is running, then refresh this page.";self.allowLogin=loginState.allowLogin,self.loginMessage=loginState.loginMessage||defaultLoginMessage,self.infoMessage=(0,_lodash.get)(messageMap,(0,_url.parse)($window.location.href,!0).query.msg),self.isDisabled=!isSecure&&secureCookies,self.isLoading=!1,self.submit=function(username,password){self.isLoading=!0,self.error=!1,$http.post("./api/security/v1/login",{username:username,password:password}).then(function(){return $window.location.href="."+next},function(){setupScope(),self.error=!0,self.isLoading=!1})}}var next=(0,_pluginsSecurityLibParse_next2["default"])($window.location),isSecure=!!$window.location.protocol.match(/^https/),self=this;setupScope()})},1499:function(module,exports){},1500:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _url=__webpack_require__(379);exports["default"]=function(location){var _parse=(0,_url.parse)(location.href,!0),query=_parse.query,hash=_parse.hash;return query.next?query.next+(hash||""):"/"},module.exports=exports["default"]},1501:function(module,exports){module.exports='<div class="container" ng-class="{error: !!login.error}">\n  <div class="logo-container">\n    <div class="logo"></div>\n  </div>\n\n  <div class="form-container">\n    <form class="login-form" ng-submit="login.submit(username, password)">\n      <div ng-show="login.error" class="form-group error-message">\n        <label class="control-label">Oops! Error. Try again.</label>\n      </div>\n\n      <div class="form-group inner-addon left-addon">\n        <i class="fa fa-user fa-lg fa-fw"></i>\n        <input type="text" ng-disabled="login.isDisabled || !login.allowLogin" ng-model="username" class="form-control" id="username" name="username" placeholder="Username" autofocus />\n      </div>\n\n      <div class="form-group  inner-addon left-addon">\n        <i class="fa fa-lock fa-lg fa-fw"></i>\n        <input type="password" ng-disabled="login.isDisabled|| !login.allowLogin" ng-model="password" class="form-control" id="password" name="password" placeholder="Password" />\n      </div>\n\n      <div class="form-group">\n        <button type="submit" ng-disabled="login.isDisabled || !login.allowLogin || !username || !password || login.isLoading" class="btn btn-block btn-default login">LOG IN</button>\n      </div>\n    </form>\n  </div>\n\n  <div ng-if="login.infoMessage" class="info-container">\n    {{login.infoMessage}}\n  </div>\n\n  <div ng-if="!login.allowLogin" class="warning-container">\n    {{login.loginMessage}}\n  </div>\n\n  <div ng-if="login.isDisabled" class="warning-container">\n    Logging in requires a secure connection. Please contact your administrator.\n  </div>\n</div>\n'}});