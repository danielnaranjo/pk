app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log, remoteServer, $localstorage, geoService) {

// Exchange's services
  //$scope.lat = Exchange.data.lat;
  //$scope.long = Exchange.data.long;
  //$log.info('Exchange at timeline', angular.toJson(Exchange.data));

  $scope.getAll = function(){
    $ionicLoading.show();
    remoteServer.getData('nearby/'+$scope.lat+'/'+$scope.long+'/5000')
    //remoteServer.getData('nearby')
    .success(function(data) {
      $ionicLoading.hide();
      $scope.timeline = data.results;
      //$log.log('data @timeline', data.results.length);
    })
    .error(function(err){
      $log.error(err);
      $ionicLoading.hide();
    });
  }


$scope.ubicar = function(){
    $log.log('ubicar');
    geoService.getPosition().then(function(position) {
      $scope.coords = position.coords;
      $log.info('geoService', $scope.coords.latitude,$scope.coords.longitude);
      $scope.geolocalization = $scope.coords.latitude.toFixed(3)+','+$scope.coords.longitude.toFixed(3);

      $scope.lat = $scope.coords.latitude;
      $scope.long = $scope.coords.longitude;
      //http://ngmap.github.io/#/!custom-marker-ng-repeat.html
      $scope.getAll();
      $log.debug('geolocalization', $scope.lat, $scope.long);
    }, function(err) {
      $ionicLoading.hide();
      $log.error('MapaCtrl getCurrentPosition error: ', err.message);
    });
  };

  $scope.doRefresh = function() {
        $scope.getAll();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

})
