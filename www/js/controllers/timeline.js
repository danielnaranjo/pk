app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log, remoteServer, geoService, $ionicPopup, $timeout) {

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
  };

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

  // Triggered on a button click, or some other target
  $scope.showCoupon = function() {
    $scope.data = {};
    $log.debug('i', this.data);
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.coupon">',
      title: 'Tienes un cupón de descuento?',
      subTitle: 'Obtén más beneficios',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Enviar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.coupon) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.coupon;
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      $log.log('Tapped!', res);
    });

    $timeout(function() {
       myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
   };

   // A confirm dialog
   $scope.showVotes = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Recomiendas este Pooock?',
       template: 'Ayudanos a mejorar',
       buttons: [
        { text: '<i class="ion-thumbsdown"></i>' },
        {
          text: '<i class="ion-thumbsup"></i>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.coupon) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.coupon;
            }
          }
        }
      ]
     });

     confirmPopup.then(function(res) {
       if(res) {
          // vote!
         $log.log('Si, me gustaria recomendarlo');
       } else {
         $log.log('No lo recomiendo!');
       }
     });
   };

   // An alert dialog
   $scope.showComments = function() {
     $ionicPopup.show({
      template: '<input type="text" ng-model="data.comments">',
      title: 'Envia tus comentarios',
      subTitle: 'Ayudanos a mejorar',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Enviar',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.comments) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.comments;
            }
          }
        }
      ]
    });
   }

})
