app.controller('AccountCtrl', function($scope, $ionicDeploy, $ionicPopup, $timeout, Exchange) {

  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at account', angular.toJson(Exchange.data));

  $scope.mostrar = function(){
    var alertPopup = $ionicPopup.alert({
      title: '<i class="icon ion-ios-pricetag-outline"> Muy Pronto!',
      template: 'Personalizar lo que recibes en la palma de tu mano..',
      buttons: [{
        text:'OK',
        type: 'button-energized'
      }]
    });
    alertPopup.then(function(res) {
      //console.log('Extra Pooock');
    });
    $timeout(function() {
      //close the popup after 5 seconds for some reason
      alertPopup.close();
    }, 5000);
    console.log('fire!');
  };

  ////
  // As with all Cordova plugins, you must configure within an #deviceready callback.
  //
  document.addEventListener("deviceready",function (){
      // Get a reference to the plugin.
      var bgGeo = window.BackgroundGeolocation;


      //This callback will be executed every time a geolocation is recorded in the background.
      var callbackFn = function(location, taskId) {
          var coords = location.coords;
          var lat    = coords.latitude;
          var lng    = coords.longitude;
          console.log('- Location: ', angular.toJson(ocation));

          // Must signal completion of your callbackFn.
          bgGeo.finish(taskId);
      };

      // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
      var failureFn = function(errorCode) {
          console.warn('- BackgroundGeoLocation error: ', errorCode);
      }

      // Listen to location events & errors.
      bgGeo.on('location', callbackFn, failureFn);

      // Fired whenever state changes from moving->stationary or vice-versa.
      bgGeo.on('motionchange', function(isMoving) {
        console.log('- onMotionChange: ', isMoving);
      });

      // BackgroundGeoLocation is highly configurable.
      bgGeo.configure({
          // Geolocation config
          desiredAccuracy: 0,
          distanceFilter: 10,
          stationaryRadius: 50,
          locationUpdateInterval: 1000,
          fastestLocationUpdateInterval: 5000,
          // Activity Recognition config
          activityType: 'AutomotiveNavigation',
          activityRecognitionInterval: 5000,
          stopTimeout: 5,
          // Application config
          debug: true,
          stopOnTerminate: false,
          startOnBoot: true,
          // HTTP / SQLite config
          url: 'http://api.pooock.com/post.php?dir=cordova-background-geolocation',
          method: 'POST',
          autoSync: true,
          maxDaysToPersist: 1,
          //headers: { "X-FOO": "bar" },
          //params: { "auth_token": "maybe_your_server_authenticates_via_token_YES?" }
      }, function(state) {
          // This callback is executed when the plugin is ready to use.
          console.log('BackgroundGeolocation ready: ', state);
          if (!state.enabled) {
              bgGeo.start();
          }
      });

      // The plugin is typically toggled with some button on your UI.
      function onToggleEnabled(value) {
          if (value) {
              bgGeo.start();
          } else {
              bgGeo.stop();
          }
      }
  });
  //
})