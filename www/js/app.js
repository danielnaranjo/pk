var app = angular.module('starter', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'angularMoment',
  'ngMap',
  'firebase',
  'greatCircles',
  'ngTagsInput',
  //'tandibar/ng-//Rollbar',
]);

app.constant("Config", {
  "googleMapsUrl" : "AIzaSyAUpXlOIJWDkb5y9SOv_yjHpvuCrF3OqFY",
  "Server": "https://pooock.com/admin/index.php/api/data",
  "API": "https://pooock.com/api",
})

app.run(function($ionicPlatform, $rootScope, $timeout, remoteServer, $ionicPopup, $window, $log, $ionicLoading, $ionicPopup, geoService, $state, $localstorage, Geofences, isUserLogged) {

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
  //if ($ionicAuth.isAuthenticated()) {
    //isUserLogged.check();
    //$state.go('tab.dash');
  //}

  $ionicPlatform.ready(function() {
    // Get user location
    geoService.getPosition();
    $log.debug('getPosition', geoService.getPosition() );
  });

  $ionicPlatform.ready(function(){
    //var points = Geofences.all();
    var points = $localstorage.getObject('points');
    // run when is already done!
    if(points && points.length>0 && points!==undefined){
      $log.debug('Geofences: Pooock around ', points.length);
      try {
        $window.geofence.addOrUpdate(points);
        $window.geofence.onTransitionReceived = function (geofences) {
          //$log.debug('onTransitionReceived', geofences);

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
      }
      catch(err) {
        $log.error('Try/catch', err);
      }
      
      $window.geofence.initialize(function () {
        $log.log("Geofences: OK");
      })
    } else {
      $state.go('tab.dash');
      //$log.info('Geofences: Users must be logged to get some Pooock');
    }
    //
    $window.geofence.onNotificationClicked = function (notificationData) {
      //$log.debug('Geofences: onNotificationClicked', notificationData);

      // Add metrics to Firebase
      remoteServer.pushFirebase(notificationData.g, notificationData.n, notificationData.u, 'notifications');

      if (notificationData) {
        //$log.debug('Geofences: onNotificationClicked (if)', notificationData);
        //$localstorage.set('notificationData_'+moment().unix(), angular.toJson(notificationData) );
        
        // Add metrics to Firebase
        remoteServer.pushFirebase(notificationData.g, notificationData.n, notificationData.u, 'clicked');
        
        // Deberia abrir el popup
        $state.go('tab.timeline');
      }
    }
    //
  });  

  $ionicPlatform.ready(function() {
      //TestFairy services
      TestFairy.begin("f83570976e406303162da183ffae62f5b6a89684");
      // //Rollbar
      //window.cordova.plugins.//Rollbar.init();
  });


});

app.config(function($compileProvider){
    // Add base64 to whiteList
    // http://stackoverflow.com/a/25452592
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|blob):|data:image\//);
});

// app.config(function(RollbarProvider) {
//     RollbarProvider.init({
//       accessToken: '1129bb602016431291f96e2d09c52da3',
//         captureUncaught: true,
//       payload: {
//         environment: 'production'
//       }
//   });
// });//</rollbar_environment> </your-application-token>

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

  // .state('tab.account', {
  //   url: '/account',
  //   views: {
  //     'tab-account': {
  //       templateUrl: 'templates/account.html',
  //       controller: 'AccountCtrl'
  //     }
  //   }
  // })

  // .state('logout', {
  //     url: '/logout',
  //     controller: 'AppCtrl'
  // })

  // .state('login', {
  //     url: '/login',
  //     templateUrl: 'templates/dashboard.html', //'templates/login.html',
  //     controller: 'DashCtrl' //'LoginCtrl'
  // })

  // .state('slider', {
  //     url: '/slider',
  //     templateUrl: 'templates/principal.html',
  //     controller: 'SetupCtrl'
  // })
  ;

  $urlRouterProvider.otherwise('/tab/dash');

});
