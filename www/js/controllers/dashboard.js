app.controller('DashCtrl', function($scope, $rootScope, remoteServer, $ionicPlatform, $ionicLoading, $ionicPopup, Exchange, locationService, geoService, Config, $log, Geofences, $localstorage, Geofences) {
    /*{
        id:             String, //A unique identifier of geofence
        latitude:       Number, //Geo latitude of geofence
        longitude:      Number, //Geo longitude of geofence
        radius:         Number, //Radius of geofence in meters
        transitionType: Number, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
        notification: {         //Notification object
            id:             Number, //optional should be integer, id of notification
            title:          String, //Title of notification
            text:           String, //Text of notification
            smallIcon:      String, //Small icon showed in notification area, only res URI
            icon:           String, //icon showed in notification drawer
            openAppOnClick: Boolean,//is main app activity should be opened after clicking on notification
            vibration:      [Integer], //Optional vibration pattern - see description
            data:           Object  //Custom object associated with notification
        }
    }*/
      // remoteServer.getData('points')
      // .success(function(res) {
      //   $log.debug('How many Pooock are available?', res.length, $localstorage.getObject('points')); 
      //   var points = [];
      //   for(var i=0; i<res.length; i++){
      //     //$log.debug(angular.toJson(res[i]));
      //     var point = {
      //       id:             UUIDjs.create().toString(),//res[i].geofence_id,
      //       latitude:       res[i].latitude,
      //       longitude:      res[i].longitude,
      //       radius:         res[i].radius||100,
      //       transitionType: res[i].transitionType||1,
      //       notification: {
      //         id:             res[i].notification_id,
      //         title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
      //         text:           res[i].message||'Tenemos un algo para ti!',
      //         vibration:      [res[i].vibration||0], // si paga mas, tiene vibracion personalizado! -> res.results[i].notification.vibration||
      //         smallIcon:      'res://icon', // transparente
      //         icon:           'file://img/pooock.png',
      //         openAppOnClick: res[i].openAppOnClick||true,
      //         data: {
      //           geofence_id: res[i].geofence_id,
      //           notification_id: res[i].notification_id,
      //           behavior_id: res[i].behavior_id
      //         }
      //       }
      //     };
      //     $log.debug(res[i].geofence_id, angular.toJson(point) );
      //     points.push(point);
      //   }
      //   $localstorage.setObject('points');
      //   $log.debug('$localstorage.getObject',$localstorage.getObject('points'));
      // })
      // .error(function(err){
      //   $log.error('remoteServer > new', err);
      // });

      geoService.getPosition()
      .then(function(position) {
        $scope.coords = position.coords;
        //$log.log('Dash > geoService', $scope.coords);
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
          $log.error('Dash > Cant connect with Google Maps API')
        });

      }, function(err) {
        $log.error('Dash > getCurrentPosition: ',err.message);
      });

});
