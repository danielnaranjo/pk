app.controller('DashCtrl', function($scope, $ionicDeploy, $rootScope, $ionicPlatform, $ionicLoading, $cordovaGeolocation, $cordovaBatteryStatus, $cordovaLocalNotification, $ionicPopup, $cordovaNetwork, Exchange, locationService, geoService) {

  geoService.getPosition()
  .then(function(position) {
    $scope.coords = position.coords;
    console.log('geoService', angular.toJson(position.coords));
    $scope.geolocalization = $scope.coords.latitude.toFixed(3)+','+$scope.coords.longitude.toFixed(3);

    // GPS to Address by Google Maps API Service
    locationService.getLocation($scope.coords.latitude+','+$scope.coords.longitude)
      .then(function(location){
      var itemLocation = 
      location.results[0].address_components[1].long_name+', ' +
      location.results[0].address_components[2].short_name+', ' +
      location.results[0].address_components[5].short_name;
      $scope.address = itemLocation;
    },
    function(error){
      console.log('Error: Cant connect with Google Maps API')
    });
    // Exchange's services
    Exchange.data.lat=$scope.coords.latitude;
    Exchange.data.long=$scope.coords.longitude;
    console.info('Exchange at dash', angular.toJson(Exchange.data));
  }, function(err) {
    console.log('getCurrentPosition error: ' + angular.toJson(err));
  });

  //bateryStatus
  $ionicPlatform.ready(function() {
    $rootScope.$on("$cordovaBatteryStatus:status", function(event, args) {
      if(args.isPlugged) {
        $scope.batteryLevel = "Charging " + args.level + "%";
      } else {
        $scope.batteryLevel = "Battery " + args.level + "%";
      }
    });
    console.log('cordovaBatteryStatus');
  });

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  /*
    //geolocalization
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        $scope.geolocalization = lat.toFixed(3)+','+long.toFixed(3);

      // GPS to Address by Google Maps API Service
      locationService.getLocation(lat+','+long)
        .then(function(location){
        var itemLocation = 
        location.results[0].address_components[1].long_name+', ' +
        location.results[0].address_components[2].short_name+', ' +
        location.results[0].address_components[5].short_name;
        $scope.address = itemLocation;
      },
      function(error){
        console.log('Error: Cant connect with Google Maps API')
      });

      // Exchange's services
        Exchange.data.lat=lat;
        Exchange.data.long=long;
        console.info('Exchange', Exchange.data);

        console.log('cordovaGeolocation', lat, long);
      }, function(err) {
      // error
    });
    */

    /*
    var watchOptions = {
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };
    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        // error
      },
      function(position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        $scope.geolocalization = lat+','+long;
    });
    watch.clearWatch();
    */

    /*
    $scope.add = function() {
      var alarmTime = new Date();
      var uuid = guid();
      alarmTime.setMinutes(alarmTime.getMinutes() + 1);
      $cordovaLocalNotification.add({
        id: uuid,
        date: alarmTime,
        message: uuid,
        title: "Hey Pooock! Let's Pooock!",
        autoCancel: true,
        sound: null
      }).then(function () {
          //console.log("The notification has been set");
      });
    };
    $scope.isScheduled = function() {
      $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
        alert("Notification 1234 Scheduled: " + isScheduled);
      });
    }
    */

    document.addEventListener('deviceready', function () {
      // Schedule notification for tomorrow to remember about the meeting
      cordova.plugins.notification.local.schedule({
        id: 10,
        title: "Meeting in 15 minutes!",
        text: "Jour fixe Produktionsbesprechung",
        at: tomorrow_at_8_45_am,
        data: { meetingId:"#123FG8" }
      });

      // Join BBM Meeting when user has clicked on the notification 
      cordova.plugins.notification.local.on("click", function (notification) {
        if (notification.id == 10) {
          joinMeeting(notification.data.meetingId);
        }
      });

      // Notification has reached its trigger time (Tomorrow at 8:45 AM)
      cordova.plugins.notification.local.on("trigger", function (notification) {
        if (notification.id != 10)
            return;

        // After 10 minutes update notification's title 
        setTimeout(function () {
          cordova.plugins.notification.local.update({
            id: 10,
            title: "Meeting in 5 minutes!"
          });
        }, 600000);
      });
      cordova.plugins.notification.local.hasPermission(function (granted) {
        console.log('Permission has been granted: ' + granted);
      });
      cordova.plugins.notification.local.registerPermission(function (granted) {
        console.log('Permission has been granted: ' + granted);
      });
    }, false);

    //connection
    $ionicPlatform.ready(function() {
      try {
        /*
        if(window.Connection) {
          if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
              title: "Internet Disconnected",
              content: "The internet is disconnected on your device."
            })
            .then(function(result) {
              if(!result) {
                ionic.Platform.exitApp();
                console.log('connection', result);
              }
            });
            $scope.connection = "Internet Disconnected";
          }
        }
        */
        if ($cordovaNetwork.isOffline()) {
           $ionicPopup.confirm({
              title: "Internet is not working",
              content: "Internet is not working on your device."
           });
           console.log('isOffline');
        }
      } catch(e) {
        console.log('catched', angular.toJson(e));
      }
    });
})

app.controller('TimelineCtrl', function($scope, $ionicDeploy, Exchange, $http, $ionicLoading, $ionicPopup) {

// Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at timeline', angular.toJson(Exchange.data));

  $ionicLoading.show();
  //http://pooock.com/api/v1/notifications
  $http({
    method: 'GET',
    url: 'https://pooock.stamplayapp.com/api/cobject/v1/notifications'
  })
  .success(function(data){
    $scope.timeline=data.data;
    $ionicLoading.hide();
    console.log('data @timeline', data.pagination.total_elements);
    // Pass timeline to memory
    Exchange.data.timeline=data.data;
  })
  .error(function(){
    console.log('Error API');
    $ionicLoading.hide();
  });

})

app.controller('MapaCtrl', function($scope, $ionicLoading, $http, Exchange, Config) {
  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at maps', angular.toJson(Exchange.data));
  var d = [];

  $http({
      method: 'GET',
      url: 'https://pooock.stamplayapp.com/api/cobject/v1/notifications'
    })
  .success(function(data){
    $scope.timeline=data.data;
    console.log('data @maps', data.data);
    $ionicLoading.hide();
  })
  .error(function(){
    console.log('Error API');
    $ionicLoading.hide();
  });

  //http://ngmap.github.io/#/!custom-marker-ng-repeat.html
  $scope.map = { 
    center: { 
      latitude: $scope.lat,
      longitude: $scope.long 
    }, 
    zoom: 13 
  };
  //console.info('googleMapsUrl', Config.googleMapsUrl);

})

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

app.controller('AppCtrl', function($scope, $ionicDeploy, $ionicPopup, $timeout, Exchange, $ionicPush) {

    $scope.checkForPush = function(){
      // register to received pushes :)
      $ionicPush.register().then(function(t) {
          return $ionicPush.saveToken(t);
      }).then(function(t) {
          console.log('Token saved:', t.token);
      });

      // push received :p
      $scope.$on('cloud:push:notification', function(event, data) {
          var msg = data.message;
          alert(msg.title + ': ' + msg.text);
          console.info('push received:', msg.title, msg.text);
      });
    }

// Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
        //console.info('Ionic Deploy: Checking for updates');
        $scope.version="Buscando actualizaciones";
        $ionicDeploy.channel = 'production'; //dev

        $ionicDeploy.check().then(function(hasUpdate) {
            $scope.hasUpdate = hasUpdate;
            if(hasUpdate==false){
                $scope.version=$rootScope.version;
            } else {
                $scope.doUpdate();
            }
            console.info('Ionic Deploy: Update available is ' + hasUpdate);
        }, function(err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        });
    }

    // check deploy service
    $scope.doUpdate = function() {
        $ionicDeploy.update().then(function(res) {
            $scope.version='Completada';
            // force to apply
            $ionicDeploy.load();
            console.error('Update Success! ', angular.toJson(res));
        }, function(err) {
            $scope.version='Error en descarga';
            console.error('Update error! ', angular.toJson(error));
        }, function(prog) {
            $scope.version='Descargando..';
            console.error('Progress... ', angular.toJson(prog));
        });
    };


});
