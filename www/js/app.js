var app = angular.module('starter', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'firebase',
  'angularMoment',
  'ngMap'
]);

app.constant("Config", { "googleMapsUrl" : "AIzaSyAUpXlOIJWDkb5y9SOv_yjHpvuCrF3OqFY" })

app.constant('TransitionType', {
  'ENTER' : 1,
  'EXIT' : 2,
  'BOTH' : 3
})

app.run(function($rootScope, $ionicPlatform, $cordovaBatteryStatus, $cordovaNetwork, $cordovaAppVersion) {

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

  //bateryStatus
  $ionicPlatform.ready(function() {
    $rootScope.$on("$cordovaBatteryStatus:status", function(event, args) {
      if(args.isPlugged) {
          $rootScope.batteryStatus = args.isPlugged;//Cargando
      } else {
          $rootScope.batteryStatus = args.isPlugged;//Bateria
      }
      $rootScope.batteryLevel = args.level;
      console.debug('cordovaBatteryStatus',args.level);
    })
  })

  //connection
  $ionicPlatform.ready(function() {
    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      $rootScope.offlineState = true;
      console.debug('networkState->Offline', networkState);
    })
  })

  //version
  $ionicPlatform.ready(function() {
    //console.debug('$cordovaAppVersion', angular.toJson($cordovaAppVersion)) ;
    $rootScope.device = ionic.Platform.device();
    $rootScope.isWebView = ionic.Platform.isWebView();
    cordova.getAppVersion.getVersionNumber().then(function (version){
      $rootScope.version = version;
      console.debug('device@info', $rootScope.version, $rootScope.device.platform);
    }, function(error){
      console.error('getVersionNumber failed', angular.toJson(error));
      //window.fabric.Crashlytics.addLog("Error AppCtrl cordovaAppVersion()");
    });
  }) 

  // geofence
  $ionicPlatform.ready(function(){
    if ($window.geofence === undefined) {
      console.error("Geofence Plugin not found. Using mock instead.");
    }
    // window.geofence is now available
    window.geofence.initialize().then(function () {
        console.log("Geofence: Successful initialization");
    }, function (error) {
        console.log("Error geofence()", error);
    });
  })

})

app.config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "c48ef6d6"
    },
    "push": {
      "sender_id": "682230280860",
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

app.constant('configuration', {
    'protocol':'http://',
    'url': 'pooock.stamplayapp.com/api/cobject/v1/',
    //'url': 'http://pooock.com/api/v1/notifications',
    'port':'',
    'mediafolder':'public/',
    'imagefolder':'public/images/',
    'audiofolder':'public/audios/'
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
  });

  $urlRouterProvider.otherwise('/tab/dash');

});
