app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log) {

// Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  $log.info('Exchange at timeline', angular.toJson(Exchange.data));

  $scope.getAll = function(){
    $ionicLoading.show();
    $http({
      method: 'GET',
      url: Config.Server+'/notifications'
    })
    .success(function(data){
      $scope.timeline=data.data;
      $ionicLoading.hide();
      $log.log('data @timeline', data.pagination.total_elements);
      // Pass timeline to memory
      Exchange.data.timeline=data.data;
    })
    .error(function(){
      $log.error('Error API');
      $ionicLoading.hide();
    });
  }

  $scope.doRefresh = function() {
        $scope.getAll();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

})
