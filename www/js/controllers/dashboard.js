app.controller('DashCtrl', function($scope, $rootScope, remoteServer, $ionicPlatform, $ionicLoading, $ionicPopup, Exchange, geoService, Config, $log, Geofences, $localstorage) {

  $scope.getInfo = function(){
    geoService.getPosition()
    .then(function(position) {
      $scope.coords = position.coords;
      //$log.log('Dash > geoService', $scope.coords);
      $scope.geolocalization = $scope.coords.latitude.toFixed(3)+','+$scope.coords.longitude.toFixed(3);

      // GPS to Address by Google Maps API Service
      geoService.getLocation($scope.coords.latitude+','+$scope.coords.longitude)
        .then(function(location){
        var itemLocation =
        location.results[0].address_components[1].long_name+' ' + 
        location.results[0].address_components[0].long_name+', ' + 
        location.results[0].address_components[2].short_name+', ' +
        location.results[0].address_components[5].short_name;
        $scope.address = itemLocation;
      },
      function(error){
        $log.error('Dash > Cant connect with Google Maps API');
        //Rollbar.warning("Dash > Cant connect with Google Maps API");
      });

      Geofences.all($scope.coords.latitude,$scope.coords.longitude,5000);
      $log.log("Getting some pooock");
    }, function(err) {
      $log.error('Dash > getCurrentPosition: ',err.message);
      //Rollbar.critical("dashboard > getinfo > geoService > getPosition");
    });

    // viene de account. 17/08 Ver mail
    remoteServer.getStatic('category.json')
    .success(function(data) {
        $scope.categorias = data.result;
        $log.debug('category', data.result);
    })
    .error(function(err){
        $log.error('category',err);
        //Rollbar.critical("dashboard > remoteServer > getStatic > category");
    });
    //

  }

});
