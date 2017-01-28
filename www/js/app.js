var db = null;

var app = angular.module('starter', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'angularMoment',
  'ngMap',
  //'firebase',
  'greatCircles',
]);

app.constant("Config", {
  "googleMapsUrl" : "AIzaSyAUpXlOIJWDkb5y9SOv_yjHpvuCrF3OqFY",
  "Server": "https://pooock.stamplayapp.com/api/cobject/v1", // http://pooock.com/api/v1/notifications
})

app.run(function($ionicPlatform, $rootScope, $cordovaAppVersion, $ionicPopup, $window, $log, $ionicLoading, Geofences, geoService, $localstorage, $cordovaSQLite, $state, $ionicAuth, $ionicHistory, updateApp) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //version
    $ionicPlatform.ready(function() {
      //console.debug('$cordovaAppVersion', angular.toJson($cordovaAppVersion)) ;
      $rootScope.device = ionic.Platform.device();
      $rootScope.isWebView = ionic.Platform.isWebView();
      cordova.getAppVersion.getVersionNumber().then(function (version){ // <-- No disponible en Local
          $rootScope.version = version;
          $log.info('device@info', $rootScope.version, $rootScope.device.platform);
      }, function(error){
          $log.error('getVersionNumber failed', angular.toJson(error));
          //window.fabric.Crashlytics.addLog("Error AppCtrl cordovaAppVersion()");
      });
    });

    $ionicPlatform.ready(function(){
        Geofences.check();
    });

    // Get user location
    $ionicPlatform.ready(function(){
        geoService.getPosition();
    });

    // $cordovaSQLite
    $ionicPlatform.ready(function(){
        var isAndroid = ionic.Platform.isAndroid();
        //http://phonegapcmsworld.blogspot.com.ar/2016/06/iosDatabaseLocation-value-is-now-mandatory-in-openDatabase-call.html
        if(isAndroid){
            // Works on android but not in iOS
            db = $cordovaSQLite.openDB({ name: "pooock.db", iosDatabaseLocation:'default'});
            $log.info('cordovaSQLite is on Android');
        } else{
            // Works on iOS
            db = window.sqlitePlugin.openDatabase({ name: "pooock.db", location: 2, createFromLocation: 1});
            $log.info('cordovaSQLite is on iOS');
        }
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS logs (id integer primary key, action text, date text)");
        $log.info('cordovaSQLite database created');
    });

    // check version
    $ionicPlatform.ready(function(){
      updateApp.checkForUpdates();
    })

    // si esta autenticado, ir a tareas
    if ($ionicAuth.isAuthenticated()) {
        $state.go('app.map');
        //$log.debug('$ionicAuth.isAuthenticated()', $ionicAuth.isAuthenticated());
    }

})

app.config(function($compileProvider){
    // Add base64 to whiteList
    // http://stackoverflow.com/a/25452592
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|blob):|data:image\//);
});

app.config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "c48ef6d6"
    },
    "auth": {
        "facebook": {
            "scope": []
        }
    },
    "push": {
        "sender_id": "1015002537149",
        "pluginConfig": {
            "ios": {
                "badge": true,
                "sound": true
            },
            "android": {
                "iconColor": "#343434"
            }
        }
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.timeline', {
    url: '/timeline',
    views: {
      'tab-timeline': {
        templateUrl: 'templates/timeline.html',
        controller: 'TimelineCtrl'
      }
    }
  })

  .state('tab.maps', {
    url: '/map',
    views: {
      'tab-maps': {
        templateUrl: 'templates/map.html',
        controller: 'MapaCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('logout', {
      url: '/logout',
      controller: 'AppCtrl'
  })

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  .state('slider', {
      url: '/slider',
      templateUrl: 'templates/principal.html',
      controller: 'SetupCtrl'
  });

  $urlRouterProvider.otherwise('/slider');

});
