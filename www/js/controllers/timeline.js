app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, $ionicPopup, configuration,TransitionType, geoService) {

  // geofence
  $scope.geofences = [];
  $scope.TransitionType = TransitionType;

  $scope.isTransitionOfType = function (transitionType) {
    return ($scope.geofence.transitionType & transitionType);
  };

  $scope.isWhenGettingCloser = function () {
    return $scope.geofence.transitionType === TransitionType.ENTER;
  };

  $scope.toggleWhenIgetCloser = function () {
    $scope.geofence.transitionType ^= TransitionType.ENTER;
  };

  $scope.toggleWhenIamLeaving = function () {
    $scope.geofence.transitionType ^= TransitionType.EXIT;
  };

  // Exchange services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at timeline', angular.toJson(Exchange.data));

  $scope.getAll = function(){
    $ionicLoading.show();
    $http({
      method: 'GET',
      url:configuration.protocol+configuration.url+'/notifications',
    })
    .success(function(data){
      $scope.timeline=data.data;
      $ionicLoading.hide();
      console.log('data @timeline', data.pagination.total_elements);
      // Pass timeline to memory
      Exchange.data.timeline=data.data;
    })
    .error(function(err){
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