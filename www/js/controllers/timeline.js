app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log, remoteServer, $localstorage, geoService) {

// Exchange's services
  //$scope.lat = Exchange.data.lat;
  //$scope.long = Exchange.data.long;
  //$log.info('Exchange at timeline', angular.toJson(Exchange.data));

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

  $scope.getAll = function(){
    $ionicLoading.show();
    $scope.ubicar();
    //remoteServer.getData('points/null/'+$scope.lat+'/'+$scope.long)
    remoteServer.getData('points')
    .success(function(data) {
      $ionicLoading.hide();
      $scope.timeline = data.results;
      var points = [];
      for(var i=0; i<data.results.length+1; i++){
        //$log.debug(angular.toJson(data.results[i]));
        var point = {
            //id:             data.results[i].geofence_id,
            latitude:       data.results[i].latitude||0,
            longitude:      data.results[i].longitude||0,
            radius:         data.results[i].radius||100,
            transitionType: data.results[i].notification.transitionType||1,
            notification: {
              id:             data.results[i].notification.notification_id,
              title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
              text:           data.results[i].notification.message||'Tenemos una promo para ti!',
              vibration:      [0], // si paga mas, tiene vibracion personalizado! -> data.results[i].notification.vibration||
              smallIcon:      'res://icon', // transparente
              icon:           'file://img/icono.png',
              openAppOnClick: data.results[i].notification.openAppOnClick||true,
              data: {
                raw: data.results[i].notification.data
              }
            }
        };
        points.push(point);
      }
      $log.log('data @timeline', data.results.length);
      $localstorage.clear('points');
      $localstorage.setObject('points', data.results);
    })
    .error(function(err){
      $log.error(err);
      $ionicLoading.hide();
    });
  }

  $scope.doRefresh = function() {
        $scope.getAll();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

})
