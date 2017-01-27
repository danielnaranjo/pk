app.controller('MapaCtrl', function($scope, $ionicLoading, $http, Exchange, Config, $log) {
  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  $log.info('Exchange at maps', angular.toJson(Exchange.data));
  var d = [];

  $scope.getMap = function(){

    $http({
        method: 'GET',
        url: Config.Server+'/notifications'
      })
    .success(function(data){
      $scope.timeline=data.data;
      $log.log('data @maps', data.data);
      $ionicLoading.hide();
    })
    .error(function(){
      $log.error('Error API');
      $ionicLoading.hide();
    });

    //http://ngmap.github.io/#/!custom-marker-ng-repeat.html
    $scope.map = {
      center: {
        latitude: $scope.lat,
        longitude: $scope.long
      },
      zoom: 13
    };
    //$log.info('googleMapsUrl', Config.googleMapsUrl);

  }

})
