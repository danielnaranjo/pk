app.controller('TimelineCtrl', function($scope, Exchange, $http, $ionicLoading, Config, $log, remoteServer, geoService, $ionicPopup, $timeout, $ionicUser) {

  $scope.getAll = function(){
    $ionicLoading.show();
    remoteServer.getData('nearby/'+$scope.lat+'/'+$scope.long+'/5000')
    //remoteServer.getData('nearby')
    .success(function(data) {
      $ionicLoading.hide();
      $scope.timeline = data.results;
      $log.log('data @timeline', data.results.length);
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
  $scope.showCoupon = function(i) {
    $scope.data = {};
    $scope.data.geofence_id = i.geofence_id;
    $scope.data.notification_id = i.notification_id;
    $log.debug('showCoupon', i);
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.coupon">',
      title: 'Tienes un cupón de descuento?',
      subTitle: 'Obtén más beneficios en '+i.label,
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Enviar</b>',
          type: 'button-energized',
          onTap: function(e) {
            remoteServer.postData('coupon', $scope.data)
            .success(function(data) {
              $log.log('TL > showCoupon > post', data);
            })
            .error(function(err){
              $log.error('TL > showCoupon > post', err);
            });
          }
        }
      ]
    });
    myPopup.then(function(res) {
      //$log.log('Tapped!', res);
    });
    $timeout(function() {
       myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
   };

   // A confirm dialog
   $scope.showVotes = function(i) {
    $log.debug('showVotes', i);
    var confirmPopup = $ionicPopup.confirm({
       title: 'Recomiendas este Pooock?',
       template: 'Ayudanos a mejorar',
       buttons: [
        {
          text: '<i class="ion-thumbsdown"></i>',
          type: 'button-assertive',
          onTap: function() {
            var valores = { n: i, d: 1, u: 0, t: $ionicUser.id };
            remoteServer.postData('votes', valores)
            .success(function(data) {
              $log.log('TL > showVotes > post', data);
            })
            .error(function(err){
              $log.error('TL > showVotes > post', err);
            });
          }
        },
        {
          text: '<i class="ion-thumbsup"></i>',
          type: 'button-balanced',
          onTap: function() {
            var valores = { n: i, d: 0, u: 1, t: $ionicUser.id };
            remoteServer.postData('votes', valores)
            .success(function(data) {
              $log.log('TL > showVotes > post', data);
            })
            .error(function(err){
              $log.error('TL > showVotes > post', err);
            });
          }
        }
      ]
     });
     confirmPopup.then(function(res) {
       if(res) {
          // vote!
         $log.log('showVotes > Si, me gustaria recomendarlo');
       } else {
         $log.log('showVotes > No lo recomiendo!');
       }
     });
   };

   // An alert dialog
   $scope.showComments = function(i) {
    $log.debug('showComments', i);
    $ionicPopup.show({
      template: '<input type="text" ng-model="data.comments">',
      title: 'Envia tus comentarios',
      subTitle: 'Ayudanos a mejorar',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Enviar',
          // type: 'button-positive',
          onTap: function(e) {
            var valores = { n: i, c: $scope.data.comments, u: $ionicUser.id };
            remoteServer.postData('comments', valores)
            .success(function(data) {
              $log.log('TL > showComments > post', data);
            })
            .error(function(err){
              $log.error('TL > showComments > post', err);
            });
          }
        }
      ]
    });
   };

   $scope.showMessage = function(i) {
     var alertPopup = $ionicPopup.show({
       title: 'Pooock: '+i.label,
       //subTitle: 'Obtén más beneficios en '+i.label,
       template: i.message,
       buttons: [ { text: 'OK' }]
     });
     alertPopup.then(function() {
       $log.log('TL > showMessage > alertPopup');
     });
   };

})
