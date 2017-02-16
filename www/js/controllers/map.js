app.controller('MapaCtrl', function($scope, $timeout, $ionicLoading, $http, Exchange, geoService, $ionicUser, $ionicAuth, $cordovaGeolocation, $state, $localstorage, $ionicHistory, ConnectivityMonitor, $log, Config, remoteServer) {

  // monitor de conexion a internet
  ConnectivityMonitor.startWatching();

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
      //remoteServer.getData('points/null/'+$scope.coords.latitude+'/'+$scope.coords.longitude)
      remoteServer.getData('points')
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
    $scope.$on('$ionicView.enter', function(){
      $scope.ubicar();
    });
  }; // mapa

})
