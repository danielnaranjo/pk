var app = angular.module('starter', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  //'firebase',
  'angularMoment',
  'ngMap'
]);

app.constant("Config", {
    "googleMapsUrl" : "AIzaSyAUpXlOIJWDkb5y9SOv_yjHpvuCrF3OqFY",
    "Server": "https://pooock.stamplayapp.com/api/cobject/v1", // http://pooock.com/api/v1/notifications
  })

app.run(function($rootScope, $ionicPlatform) {
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
})

app.config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "c48ef6d6"
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
