app.controller('LoginCtrl', function ($scope, $ionicAuth, $ionicUser, Exchange, $state, Config, $ionicLoading, $ionicHistory, $log, $ionicPlatform, $ionicPopup, $ionicModal) {
    $scope.detener = function(){
        // Previene el boton de Volver
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

	if ($ionicAuth.isAuthenticated()) {
		var points = 0;//$localstorage.getObject('points');
		if(points.length>0){
			$state.go('app.map');
		} else {
			$state.go('app.dash');
		}
	}

  $scope.login = function(provider){
      switch (provider) {
        case provider='facebook':
          $scope.withFacebook();
        break;
        case provider='google':
          $scope.withGoogle();
        break;
        case provider='twitter':
          $scope.withGoogle();
        break;
        default:
          $log.error('Metodo desconocido, por favor, verifique');
      }
	};// login

$scope.withFacebook = function(){
    $scope.detener();
    $log.log('LoginCtrl > withFacebook()');
    $ionicLoading.show();
    if($ionicUser.social===true){
      $log.debug('fb > object', $ionicUser.social);
    }
    $ionicAuth.login('facebook').then(function(){
    if ($ionicAuth.isAuthenticated()) {
      $ionicLoading.hide();
      $ionicPush.register().then(function(t) {
          return $ionicPush.saveToken(t);
      }).then(function(t) {
          //$log.log('Token saved:', t.token);
      });
        $state.go('app.mapa');
        $log.info('loginCtrl > withFacebook()');
      }
    }).catch (function(err){
      $log.error('loginCtrl > ionicFacebookAuth()', err);
      $ionicLoading.hide();
      $scope.onError = "Error: No es posible conectar con Facebook";
    });
};// withFacebook

$scope.withGoogle = function(){
    $log.log('LoginCtrl > withGoogle()');
    $ionicLoading.show();
    if($ionicUser.social===true){
      $log.debug('g+ > object', $ionicUser.social);
    }
    $ionicAuth.login('google').then(function(){
      $log.debug('$ionicGoogleAuth', $ionicAuth);
      if ($ionicAuth.isAuthenticated()) {
        $ionicLoading.hide();
        $ionicPush.register().then(function(t) {
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            //$log.log('Token saved:', t.token);
        });
        $state.go('app.mapa');
        $log.info('loginCtrl > withGoogle()');
      }
    }).catch (function(err){
      $log.error('loginCtrl > ionicGoogleAuth()', err);
      $ionicLoading.hide();
      $scope.onError = "No es posible conectar con Google. Error: "+err;
    });
}; // withGoogle

$scope.withTwitter = function(){
    $log.log('LoginCtrl > withTwitter()');
    $ionicLoading.show();
    if($ionicUser.social===true){
      $log.debug('twitter > object', $ionicUser.social);
    }
    $ionicAuth.login('twitter').then(function(){
      $log.debug('$ionicGoogleAuth', $ionicAuth, $ionicGoogleAuth);
      if ($ionicAuth.isAuthenticated()) {
        $ionicLoading.hide();
        $ionicPush.register().then(function(t) {
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            //$log.log('Token saved:', t.token);
        });
        $state.go('app.mapa');
        $log.info('loginCtrl > withTwitter()');
      }
    }).catch (function(err){
      $log.error('loginCtrl > ionicGoogleAuth()', err);
      $ionicLoading.hide();
      $scope.onError = "No es posible conectar con Twitter. Error: "+err;
    });
}; // withTwitter

  $scope.open = function(){
    $scope.modal.show();
  };//open

  $ionicModal.fromTemplateUrl('templates/signin.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.closeModal = function(){
      $scope.modal.hide();
  }; // closeModal

});
