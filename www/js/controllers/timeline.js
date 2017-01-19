app.controller('TimelineCtrl', function($scope, $ionicDeploy, Exchange, $http, $ionicLoading, $ionicPopup) {

// Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at timeline', angular.toJson(Exchange.data));


  $scope.getAll = function(){
    $ionicLoading.show();
    //http://pooock.com/api/v1/notifications
    $http({
      method: 'GET',
      url: 'https://pooock.stamplayapp.com/api/cobject/v1/notifications'
    })
    .success(function(data){
      $scope.timeline=data.data;
      $ionicLoading.hide();
      console.log('data @timeline', data.pagination.total_elements);
      // Pass timeline to memory
      Exchange.data.timeline=data.data;
    })
    .error(function(){
      console.log('Error API');
      $ionicLoading.hide();
    });
  }

  $scope.doRefresh = function() {
        $scope.getAll();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

})