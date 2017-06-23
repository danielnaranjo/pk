app.controller('LoginCtrl', function ($scope, $ionicAuth, $http, $ionicUser, Exchange, $state, Config, $ionicLoading, $ionicHistory, $log, $ionicPlatform, $ionicPopup, $ionicModal, $ionicPush, $localstorage, Geofences) {
    $scope.detener = function(){
        // Previene el boton de Volver
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    // $http.get('https://pooock.com/admin/index.php/api/data/points')
    //   .success(function(response) {
    //     $log.debug('How many Pooock are available?', response.length);
    //     var points = [];
    //     for(var i=0; i<response.length; i++){
    //       //$log.debug(angular.toJson(response[i]));
    //       var point = {
    //         id:             UUIDjs.create().toString(),//response[i].geofence_id,
    //         latitude:       response[i].latitude,
    //         longitude:      response[i].longitude,
    //         radius:         response[i].radius||100,
    //         transitionType: response[i].transitionType||1,
    //         notification: {
    //           id:             response[i].notification_id,
    //           title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
    //           text:           response[i].message||'Tenemos un algo para ti!',
    //           vibration:      [response[i].vibration||0], // si paga mas, tiene vibracion personalizado!
    //           smallIcon:      'response://icon', // transparente
    //           icon:           'file://img/pooock.png',
    //           openAppOnClick: response[i].openAppOnClick||true,
    //           data: {
    //             geofence_id: response[i].geofence_id,
    //             notification_id: response[i].notification_id,
    //             behavior_id: response[i].behavior_id
    //           }
    //         }
    //       };
    //       //$log.debug(response[i].geofence_id, angular.toJson(point) );
    //       points.push(point);

    //     }
    //     //$localstorage.setObject('points');
    //     $log.info('res', angular.toJson(points));
    //   })
    //   .error(function(err){
    //     $log.error('remoteServer > new', err);
    //   });

  // Geofences.getting();

  $scope.login = function(provider){
    switch (provider) {
      case provider='facebook':
        $scope.withFacebook();
      break;
      case provider='google':
        $scope.withGoogle();
      break;
      case provider='twitter':
        $scope.withTwitter();
      break;
      default:
        $scope.try();
        //$log.error('Metodo desconocido, por favor, verifique');
    }
	};// login

$scope.withFacebook = function(){
    $scope.detener();
    $log.log('LoginCtrl > withFacebook()');
    $ionicLoading.show();
    if($ionicUser.social.facebook===true){
      $log.debug('fb > object', $ionicUser.social);
    }
    $ionicAuth.login('facebook').then(function(){
      $localstorage.set('pooock_uid', $ionicUser.social.facebook.uid);
      $localstorage.set('pooock_name', $ionicUser.social.facebook.data.full_name);
      $localstorage.set('pooock_username', $ionicUser.social.facebook.data.full_name);
      $localstorage.set('pooock_picture', $ionicUser.social.facebook.data.profile_picture);
      $localstorage.setObject('pooock_data', $ionicUser.social.facebook.data.raw_data);
      if ($ionicAuth.isAuthenticated()) {
        $ionicLoading.hide();
        $ionicPush.register()
        .then(function(t) {
          return $ionicPush.saveToken(t);
        }).then(function(t) {
          //$log.log('Token saved:', t.token);
        });
        $state.go('tab.dash');
        $log.info('loginCtrl > withFacebook()');
      }
    }).catch (function(err){
      $log.error('loginCtrl > ionicFacebookAuth()', err);
      $ionicLoading.hide();
      $scope.onError = "Error: No es posible conectar con Facebook";
    });
};// withFacebook

//$scope.withGoogle = function(){
//     $log.log('LoginCtrl > withGoogle()');
//     $ionicLoading.show();
//     if($ionicUser.social.google===true){
//       $log.debug('g+ > object', $ionicUser.social);
//     }
//     $ionicAuth.login('google').then(function(){
//       //$log.debug('$ionicGoogleAuth', $ionicAuth);
//       if ($ionicAuth.isAuthenticated()) {
//         $ionicLoading.hide();
//         $ionicPush.register().then(function(t) {
//             return $ionicPush.saveToken(t);
//         }).then(function(t) {
//             //$log.log('Token saved:', t.token);
//         });
//         $state.go('tab.dash');
//         $log.info('loginCtrl > withGoogle()');
//       }
//     }).catch (function(err){
//       $log.error('loginCtrl > ionicGoogleAuth()', err);
//       $ionicLoading.hide();
//       $scope.onError = "No es posible conectar con Google";
//     });
// }; // withGoogle

$scope.withTwitter = function(){
    $log.log('LoginCtrl > withTwitter()');
    $ionicLoading.show();
    if($ionicUser.social.twitter===true){
      $log.debug('twitter > object', $ionicUser.social);
    }
    $ionicAuth.login('twitter').then(function(){
      $localstorage.set('pooock_uid', $ionicUser.social.twitter.uid);
      $localstorage.set('pooock_name', $ionicUser.social.twitter.data.username);
      $localstorage.set('pooock_username', $ionicUser.social.twitter.data.full_name);
      $localstorage.set('pooock_picture', $ionicUser.social.twitter.data.profile_picture);
      $localstorage.setObject('pooock_data', $ionicUser.social.twitter.data.raw_data);
      //$log.debug('$ionicGoogleAuth', $ionicAuth, $ionicGoogleAuth);
      if ($ionicAuth.isAuthenticated()) {
        $ionicLoading.hide();
        $ionicPush.register()
        .then(function(t) {
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            //$log.log('Token saved:', t.token);
        });
        $state.go('tab.dash');
        $log.info('loginCtrl > withTwitter()');
      }
    }).catch (function(err){
      $log.error('loginCtrl > withTwitter()', err);
      $ionicLoading.hide();
      $scope.onError = "No es posible conectar con Twitter";
    });
}; // withTwitter

$scope.try = function(){
    $log.log('LoginCtrl > try()');
    $state.go('tab.dash');
}; // withTwitter

});
