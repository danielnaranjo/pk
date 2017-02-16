app.controller('MapaCtrl', function($scope, $timeout, $ionicLoading, $http, Exchange, geoService, $ionicUser, $ionicAuth, $cordovaGeolocation, $state, $localstorage, $ionicHistory, ConnectivityMonitor, $log, Config) {

  // monitor de conexion a internet
  ConnectivityMonitor.startWatching();

  $ionicLoading.show();
  $scope.zoom=5;

  //$scope.lat = -34.603704;
  //$scope.long = -58.381613;
  $scope.ubicar = function(){
    $log.log('ubicar');
    geoService.getPosition().then(function(position) {
      $scope.coords = position.coords;
      $log.info('geoService', $scope.coords.latitude,$scope.coords.longitude);
      $scope.geolocalization = $scope.coords.latitude.toFixed(3)+','+$scope.coords.longitude.toFixed(3);

      $scope.lat = $scope.coords.latitude;
      $scope.long = $scope.coords.longitude;
      //http://ngmap.github.io/#/!custom-marker-ng-repeat.html
      $scope.map = {
        center: {
          latitude: $scope.lat,
          longitude: $scope.long
        }
      };
      $log.debug('geolocalization', $scope.lat, $scope.long);
    }, function(err) {
      $ionicLoading.hide();
      $log.error('MapaCtrl getCurrentPosition error: ', err.message);
    });
  };

  $scope.mapa = function(){
    $scope.$on('$ionicView.enter', function(){
      $scope.ubicar();
      //$scope.lat = $scope.coords.latitude||'-34.59';
      //$scope.long = $scope.coords.longitude||'-58.38';
      $http({
        method:'GET',
          url:Config.Server+'/notifications',
          //headers: { 'Access-Control-Allow-Origin': '*' }
      })
      .success(function(data) {
          $scope.timeline=data.data;
          $scope.zoom=16;
          //$log.info('MapaCtrl mapa()', angular.toJson($scope.tasks) );
          $ionicLoading.hide();
      })
      .error(function(){
        $ionicLoading.hide();
        $log.error('Error MapaCtrl mapa()');
      });
    });
  }; // mapa

})
