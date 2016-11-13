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