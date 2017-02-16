app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log, remoteServer) {

// Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  $log.info('Exchange at timeline', angular.toJson(Exchange.data));

  $scope.getAll = function(){
    $ionicLoading.show();

    remoteServer.getData('points')
    .success(function(data) {
      $scope.timeline=data.result;
      $ionicLoading.hide();
      $log.log('data @timeline', data.result.length);
      Exchange.data.timeline=data.data;
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
