app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log, remoteServer, $localstorage) {

// Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  $log.info('Exchange at timeline', angular.toJson(Exchange.data));

  $scope.getAll = function(){
    $ionicLoading.show();

    remoteServer.getData('points')
    .success(function(data) {
      var points = [];
      for(var i=0; i<data.results.length+1; i++){
        var point = {
            id:             data.results[i].notification_id||UUIDjs.create().toString(),
            latitude:       data.results[i].latitude||0,
            longitude:      data.results[i].longitude||0,
            radius:         data.results[i].radius||100,
            transitionType: data.results[i].notification.transitionType||1,
            notification: {
              id:             1,
              title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
              text:           data.results[i].notification.message||'Tenemos una promo para ti!',
              vibration:      data.results[i].notification.vibration||[0], // si paga mas, tiene vibracion personalizado!
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
      $ionicLoading.hide();
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
