app.controller('DashCtrl', function($scope, $rootScope, $ionicPlatform, $ionicLoading, $cordovaGeolocation, $cordovaBatteryStatus, $cordovaLocalNotification, $ionicPopup, $cordovaNetwork, Exchange, locationService, geoService) {

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

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

})