app.controller('DashCtrl', function($scope, $rootScope, $ionicPlatform, $ionicLoading, $ionicPopup, Exchange, locationService, geoService, Config, $log, Geofences, $localstorage) {
    
    $scope.$on('$ionicView.enter', function(){

      //$ionicPlatform.ready(function(){
        $log.debug('@points',$localstorage.getObject('points'));
        Geofences.new();
        $log.debug('@@points',$localstorage.getObject('points'));

      //});

      geoService.getPosition()
      .then(function(position) {
        $scope.coords = position.coords;
        $log.log('Dash > geoService', angular.toJson(position));
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
})
