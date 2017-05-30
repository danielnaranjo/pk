var app = angular.module('starter', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'angularMoment',
  'ngMap',
  //'firebase',
  'greatCircles',
  'ngTagsInput',
]);

app.constant("Config", {
  "googleMapsUrl" : "AIzaSyAUpXlOIJWDkb5y9SOv_yjHpvuCrF3OqFY",
  "Server": "https://pooock.com/admin/index.php/api/data", // https://pooock.stamplayapp.com/api/cobject/v1
})

app.run(function($ionicPlatform, $rootScope, $http, $timeout, remoteServer, $ionicPopup, $window, $log, $ionicLoading, geoService, $state, $ionicAuth, $localstorage, Geofences, isUserLogged, updateApp) {

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

  $ionicPlatform.ready(function() {
    // Get user location
    geoService.getPosition();
    isUserLogged.check();
    updateApp.checkForUpdates();
    $localstorage.set('compile_version',moment().unix());
    $log.debug('compile_version', $localstorage.get('compile_version') );

    // si esta autenticado, ir a tareas
    if ($ionicAuth.isAuthenticated()) {
      $state.go('tab.dash');
      //$log.debug('$ionicAuth.isAuthenticated()', $ionicAuth.isAuthenticated());
    }
  });

  $ionicPlatform.ready(function(){
    //var points = Geofences.all();
    var points = $localstorage.getObject('points');
    // run when is already done!
    if(points && points.length>0 && points!==undefined){
      $log.debug('Pooock around ', points.length);

      $window.geofence.addOrUpdate(points);
      $window.geofence.onTransitionReceived = function (geofences) {
          $log.log(geofences);
          if (geofences) {
              $rootScope.$apply(function () {
                  geofences.forEach(function (geo) {
                      geo.notification = geo.notification || {
                          title: "Geofence transition",
                          text: "Without notification"
                      };
                      $ionicLoading.show({
                          template: geo.notification.title + ": " + geo.notification.text,
                          noBackdrop: true,
                          duration: 2000
                      });
                  });
              });
          }
      }
      $window.geofence.onNotificationClicked = function (notificationData) {
          //$log.log(notificationData);
          $log.info('onNotificationClicked',notificationData);
          if (notificationData) {
              $log.log('onNotificationClicked', notificationData);
          }
      }
      $window.geofence.initialize(function () {
          $log.log("geofence > Successful initialization");
      })
    } else {
      $log.info('Users must be logged to get some Pooock');
    }
    //
  })  

});

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
        "sender_id": "260441399546",
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

  $urlRouterProvider.otherwise('/login');

});
