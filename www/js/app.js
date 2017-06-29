var app = angular.module('starter', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'angularMoment',
  'ngMap',
  'firebase',
  'greatCircles',
  'ngTagsInput',
]);

app.constant("Config", {
  "googleMapsUrl" : "AIzaSyAUpXlOIJWDkb5y9SOv_yjHpvuCrF3OqFY",
  "Server": "https://pooock.com/admin/index.php/api/data", // https://pooock.stamplayapp.com/api/cobject/v1
})

app.run(function($ionicPlatform, $rootScope, $timeout, remoteServer, $ionicPopup, $window, $log, $ionicLoading, $ionicPopup, geoService, $state, $ionicAuth, $localstorage, Geofences, isUserLogged, updateApp) {

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

  // si esta autenticado, ir a tareas
  if ($ionicAuth.isAuthenticated()) {
    isUserLogged.check();
    $state.go('tab.dash');
  }

  $ionicPlatform.ready(function() {
    // Get user location
    geoService.getPosition();
    //updateApp.checkForUpdates();
    //$localstorage.set('compile_version',moment().unix());
    //$log.debug('compile_version', $localstorage.get('compile_version') );
  });

  $ionicPlatform.ready(function(){
    //var points = Geofences.all();
    var points = $localstorage.getObject('points');
    // run when is already done!
    if(points && points.length>0 && points!==undefined){
      $log.debug('Geofences: Pooock around ', points.length);

      $window.geofence.addOrUpdate(points);
      $window.geofence.onTransitionReceived = function (geofences) {
          //$log.debug('onTransitionReceived', geofences);
          //$localstorage.set('onTransitionReceived_'+moment().unix(), angular.toJson(geofences) );

          // Add metrics to Firebase
          var res = geofences[0].notification.data;
          remoteServer.pushFirebase(res.g, res.n, res.u, 'received');

          if (geofences) {
            $rootScope.$apply(function () {
              geofences.forEach(function (geo) {
                geo.notification = geo.notification || {
                  title: "Geofence transition",
                  text: "Without notification"
                };
                // $ionicLoading.show({
                //   //title: geo.notification.title,
                //   template: geo.notification.text,
                //   noBackdrop: true,
                //   duration: 5000
                // });
                //$log.debug('geofences (geo)', geofences);
                var alertPopup = $ionicPopup.show({
                    title: geo.notification.title,
                    subTitle: 'Beneficios exclusivos de Pooock',
                    template: geo.notification.text,
                    buttons: [ { text: 'OK!' }]
                });
                alertPopup.then(function(res) {
                  $log.log('App > alertPopup', res);
                });
                //
              });
            });
          }
      }
      
      $window.geofence.initialize(function () {
        $log.log("Geofences: OK");
      })
    } else {
      $log.info('Geofences: Users must be logged to get some Pooock');
    }
    //
    $window.geofence.onNotificationClicked = function (notificationData) {
      //$log.debug('Geofences: onNotificationClicked', notificationData);
      //$localstorage.set('onNotificationClicked_'+moment().unix(), angular.toJson(notificationData) );

      // Add metrics to Firebase
      remoteServer.pushFirebase(notificationData.g, notificationData.n, notificationData.u, 'notifications');

      if (notificationData) {
        //$log.debug('Geofences: onNotificationClicked (if)', notificationData);
        //$localstorage.set('notificationData_'+moment().unix(), angular.toJson(notificationData) );
        
        // Add metrics to Firebase
        remoteServer.pushFirebase(notificationData.g, notificationData.n, notificationData.u, 'clicked');
        
        // Deberia abrir el popup
        $state.go('app.timeline');
      }
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
