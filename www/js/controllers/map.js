app.controller('MapaCtrl', function($scope, $timeout, $ionicLoading, $http, Exchange, geoService, $cordovaGeolocation, $state, $ionicHistory, $log, Config, remoteServer, $localstorage, $ionicPopup) {

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
        //Rollbar.critical("map > ubicar > Cant connect with Google Maps API");
      });
    }, function(err) {
      $ionicLoading.hide();
      $log.error('MapaCtrl getCurrentPosition error: ', err.message);
      //Rollbar.warning("map > ubicar > geoService > getPosition");
    });
  };

  $scope.mapa = function(){
    $scope.ubicar();
  }; // mapa

  $scope.pooock = function() {
    $log.info('pooocked');
     var alertPopup = $ionicPopup.show({
       title: 'Pooock: '+this.data.label,
       //subTitle: 'Obtén más beneficios en '+i.label,
       template: this.data.message,
       buttons: [ { text: 'OK' }]
     });
     alertPopup.then(function() {
       $log.log('TL > showMessage > alertPopup');
     });
   };

})
