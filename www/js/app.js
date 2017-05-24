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

app.run(function($ionicPlatform, $rootScope, $http, remoteServer, $ionicPopup, $window, $log, $ionicLoading, Geofences, geoService, $state, $ionicAuth) {

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
    //version
    //appVersion.check();
  });

  $ionicPlatform.ready(function() {
    // Geofences
    Geofences.getting();
    Geofences.check();
    // $http.get('https://pooock.com/admin/index.php/api/data/points')
    //   .success(function(response) {
    //     $log.debug('How many Pooock are available?', response.length);
    //     var points = [];
    //     for(var i=0; i<response.length; i++){
    //       //$log.debug(angular.toJson(response[i]));
    //       var point = {
    //         id:             UUIDjs.create().toString(),//response[i].geofence_id,
    //         latitude:       response[i].latitude,
    //         longitude:      response[i].longitude,
    //         radius:         response[i].radius||100,
    //         transitionType: response[i].transitionType||1,
    //         notification: {
    //           id:             response[i].notification_id,
    //           title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
    //           text:           response[i].message||'Tenemos un algo para ti!',
    //           vibration:      [response[i].vibration||0], // si paga mas, tiene vibracion personalizado!
    //           smallIcon:      'response://icon', // transparente
    //           icon:           'file://img/pooock.png',
    //           openAppOnClick: response[i].openAppOnClick||true,
    //           data: {
    //             geofence_id: response[i].geofence_id,
    //             notification_id: response[i].notification_id,
    //             behavior_id: response[i].behavior_id
    //           }
    //         }
    //       };
    //       $log.debug(response[i].geofence_id, angular.toJson(point) );
    //       points.push(point);
    //     }
    //     $log.info('res', angular.toJson(points));
    //     $localstorage.setObject('points');
    //   })
    //   .error(function(err){
    //     $log.error('remoteServer > new', err);
    //   });
  });

  $ionicPlatform.ready(function() {
    // Get user location
    //geoService.getPosition(); 
  });  

  // si esta autenticado, ir a tareas
  if ($ionicAuth.isAuthenticated()) {
    $state.go('tab.dash');
    //$log.debug('$ionicAuth.isAuthenticated()', $ionicAuth.isAuthenticated());
  }

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
