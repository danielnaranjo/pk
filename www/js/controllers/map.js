app.controller('MapaCtrl', function($scope, $timeout, $ionicLoading, $http, Exchange, geoService, $cordovaGeolocation, $state, $ionicHistory, $log, Config, remoteServer, $localstorage) {

  $ionicLoading.show();
  $scope.zoom=5;

  $scope.ubicar = function(){
    $log.log('ubicar');
    geoService.getPosition().then(function(position) {
      $scope.coords = position.coords;
      $log.info('geoService', $scope.coords.latitude,$scope.coords.longitude);
      $scope.geolocalization = $scope.coords.latitude.toFixed(3)+','+$scope.coords.longitude.toFixed(3);
      //http://ngmap.github.io/#/!custom-marker-ng-repeat.html
      $scope.map = {
        center: {
          latitude: $scope.lat,
          longitude: $scope.long
        }
      };
      remoteServer.getData('nearby/'+$scope.coords.latitude+'/'+$scope.coords.longitude+'/5000')
      //remoteServer.getData('points')
      .success(function(data) {
          $scope.timeline=data.results;
          $scope.zoom=16;
          $ionicLoading.hide();
      })
      .error(function(){
        $ionicLoading.hide();
        $log.error('Error MapaCtrl mapa()');
      });
    }, function(err) {
      $ionicLoading.hide();
      $log.error('MapaCtrl getCurrentPosition error: ', err.message);
    });
  };

  $scope.mapa = function(){
    $scope.ubicar();
  }; // mapa

})
