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
    // appVersion.check();
    updateApp.checkForUpdates();
    $localstorage.set('compile_version',moment().unix());
    $log.debug('compile_version', $localstorage.get('compile_version') );

    // si esta autenticado, ir a tareas
    if ($ionicAuth.isAuthenticated()) {
      $state.go('tab.dash');
      //$log.debug('$ionicAuth.isAuthenticated()', $ionicAuth.isAuthenticated());
    }
  });

  // $ionicPlatform.ready(function() {
  //   // Geofences
  //   var new_points = [], 
  //       pooock_points;

  //     // run when is already done!
  //     pooock_points = $localstorage.getObject('pooock_points');
  //     //$log.log('Line 42: app > geofences > points', angular.toJson(pooock_points));
      
  //     if(pooock_points.length>0){
  //       //for(var i=0; i<pooock_points.length; i++){      
  //         window.geofence.addOrUpdate(pooock_points)
  //         .then(function (d) {
  //             $log.info('Geofence successfully added',d);
  //         }, function (error) {
  //             $log.error('Adding geofence failed', error);
  //         });//addOrUpdate
  //       //}
  //       //
  //       window.geofence.onTransitionReceived = function (geofences) {
  //         //$log.log(geofences);
  //         if (geofences) {
  //           $rootScope.$apply(function () {
  //             geofences.forEach(function (geo) {
  //               geo.notification = geo.notification || {
  //                 title: "Geofence transition",
  //                 text: "Without notification",
  //                 vibration: [0]// desactivado
  //               };
  //               $ionicLoading.show({
  //                 template: geo.notification.title + ": " + geo.notification.text,
  //                 noBackdrop: true,
  //                 duration: 5000
  //               });
  //               // if ($ionicAuth.isAuthenticated()) {
  //               //   //$state.go('app.timeline', { geofence_id: geo.notification.data.geofence_id, notification_id: geo.notification.data.notification_id, behavior_id: geo.notification.data.behavior_id });
  //               //   $log.debug('geofences > onTransitionReceived', angular.toJson(geo));
  //               // } else {
  //               //   $log.error('geofences required your logged');
  //               //   $state.go('login');
  //               // }
  //             });
  //           });
  //         }
  //       };//onTransitionReceived

  //       window.geofence.onNotificationClicked = function (notificationData) {
  //         //$log.log('notificationData',notificationData);
  //         $log.info('notificationData',notificationData);
  //         if (notificationData) {
  //           $log.warn('onNotificationClicked', notificationData);
  //         }
  //       };//onNotificationClicked
  //       //
  //     } else {
  //         // $http.get('https://pooock.com/admin/index.php/api/data/points')
  //         remoteServer.getData('points').success(function(response) {
  //         $log.debug('How many Pooock are available?', response.length);
  //         for(var i=0; i<response.length; i++){
  //           //$log.debug(angular.toJson(response[i]));
  //           var new_point = {
  //             id:             UUIDjs.create().toString(),//response[i].geofence_id,
  //             latitude:       response[i].latitude,
  //             longitude:      response[i].longitude,
  //             radius:         response[i].radius||100,
  //             transitionType: response[i].transitionType||1,
  //             notification: {
  //               id:             response[i].notification_id,
  //               title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
  //               text:           response[i].message||'Tenemos un algo para ti!',
  //               vibration:      [0], // si paga mas, tiene vibracion personalizado!
  //               smallIcon:      'res://icon', // transparente
  //               icon:           'file://img/pooock.png',
  //               openAppOnClick: response[i].openAppOnClick||true,
  //               data: {
  //                 geofence_id: response[i].geofence_id,
  //                 notification_id: response[i].notification_id,
  //                 behavior_id: response[i].behavior_id
  //               }
  //             }
  //           };
  //           //$log.debug(response[i].geofence_id, angular.toJson(new_point) );
  //           new_points.push(new_point);
  //         }
  //         $log.info('Line 81: app', new_points);
  //         $localstorage.setObject('pooock_points', new_points);
  //       })
  //       .error(function(err){
  //         $log.error('remoteServer > new', err);
  //       });
  //     }// if/else
  // });//geofences

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
      Geofences.all();
      $log.log("Getting some pooock");
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
