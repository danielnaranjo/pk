app.controller('MapaCtrl', function($scope, $ionicLoading, $http, Exchange, Config) {
  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at maps', angular.toJson(Exchange.data));
  var d = [];

  $scope.getMap = function(){

    $http({
        method: 'GET',
        url: 'https://pooock.stamplayapp.com/api/cobject/v1/notifications'
      })
    .success(function(data){
      $scope.timeline=data.data;
      console.log('data @maps', data.data);
      $ionicLoading.hide();
    })
    .error(function(){
      console.log('Error API');
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
    //console.info('googleMapsUrl', Config.googleMapsUrl);

  }

})