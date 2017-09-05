app.controller('LoginCtrl', function ($scope, $http, Exchange, $state, Config, $ionicLoading, $ionicHistory, $log, $ionicPlatform, $ionicPopup, $ionicModal, $ionicPush, $localstorage, Geofences) {
    $scope.detener = function(){
        // Previene el boton de Volver
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

  $scope.login = function(provider){
    switch (provider) {
      case provider='facebook':
        $scope.facebookSignIn();
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

$scope.withGoogle = function(){
    $log.log('LoginCtrl > withGoogle()');
    // $ionicLoading.show();
    // window.plugins.googleplus.login({},function (user_data) {
    //     $log.info('LoginCtrl > withGoogle()', user_data);
    //     $localstorage.set('pooock_uid', $ionicUser.social.twitter.uid);
    //     $localstorage.set('pooock_name', $ionicUser.social.twitter.data.username);
    //     $localstorage.set('pooock_username', $ionicUser.social.twitter.data.full_name);
    //     $localstorage.set('pooock_picture', $ionicUser.social.twitter.data.profile_picture);
    //     $localstorage.setObject('pooock_data', $ionicUser.social.twitter.data.raw_data);
    //     $ionicLoading.hide();
    //     $state.go('tab.dash');
    // },
    // function (err) {
    //     $scope.errorMessage='Ha ocurrido un problema, intenta nuevamente. Code E0'+err;
    //     $log.error('LoginCtrl > withGoogle()', err);
    //     $ionicLoading.hide();
    // });
}; // withGoogle

$scope.withTwitter = function(){
    // $log.log('LoginCtrl > withTwitter()');
    // $ionicLoading.show();
    // if($ionicUser.social.twitter===true){
    //   $log.debug('twitter > object', $ionicUser.social);
    // }
    // $ionicAuth.login('twitter').then(function(){
    //   $localstorage.set('pooock_uid', $ionicUser.social.twitter.uid);
    //   $localstorage.set('pooock_name', $ionicUser.social.twitter.data.username);
    //   $localstorage.set('pooock_username', $ionicUser.social.twitter.data.full_name);
    //   $localstorage.set('pooock_picture', $ionicUser.social.twitter.data.profile_picture);
    //   $localstorage.setObject('pooock_data', $ionicUser.social.twitter.data.raw_data);
    //   //$log.debug('$ionicGoogleAuth', $ionicAuth, $ionicGoogleAuth);
    //   if ($ionicAuth.isAuthenticated()) {
    //     $ionicLoading.hide();
    //     $ionicPush.register()
    //     .then(function(t) {
    //         return $ionicPush.saveToken(t);
    //     }).then(function(t) {
    //         //$log.log('Token saved:', t.token);
    //     });
    //     $state.go('tab.dash');
    //     $log.info('loginCtrl > withTwitter()');
    //   }
    // }).catch (function(err){
    //   $log.error('loginCtrl > withTwitter()', err);
    //   $ionicLoading.hide();
    //   $scope.onError = "No es posible conectar con Twitter";
    // });
}; // withTwitter

$scope.try = function(){
    $log.log('LoginCtrl > try()');
    $state.go('tab.dash');
}; // withTwitter

// Facebook Native SDK
    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            $state.go('login');
            $log.error('fbLoginSuccess > Cannot find the authResponse');
            return;
        }
        $log.info('269 pipol > authResponse', response);
        // var authResponse = response.authResponse;
        // getFacebookProfileInfo(authResponse)
        // .then(function(profileInfo) {

        //     $localstorage.set('pooock_uid', profileInfo.id);
        //     $localstorage.set('pooock_name', profileInfo.name);
        //     $localstorage.set('pooock_username', profileInfo.email);
        //     $localstorage.set('pooock_picture', "http://graph.facebook.com/" + profileInfo.id + "/picture?type=large");
        //     $localstorage.setObject('pooock_data', authResponse.authResponse);
        //     $ionicLoading.hide();
        //     //
        //     // var user = $localstorage.getObject('pipolup_info');
        //     // var details = {
        //     //     userID: user.userID,
        //     //     name: user.name,
        //     //     email: user.email,
        //     //     picture: user.picture
        //     // }
        //     // registeredwithsocial(details);
        //     //
        //     $state.go('app.dash');
        // }, function(fail){
        //     $scope.errorMessage='Ha ocurrido un problema, intenta nuevamente. Code E002';
        //     $log.error('fbLoginSuccess > profile info fail', fail);
        // });

    };//fbLoginSuccess
    var fbLoginError = function(error){
        $scope.errorMessage='Ha ocurrido un problema, intenta nuevamente. Code E002';
        $log.error('fbLoginError', error.errorCode, error.errorMessage);
        $ionicLoading.hide();
    };//fbLoginError

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
        var info = $q.defer();
        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
            function (response) {
                info.resolve(response);
            },
            function (response) {
                $log.log(response);
                info.reject(response);
            }
        );
        return info.promise;
      };//getFacebookProfileInfo

      $scope.facebookSignIn = function() {
        facebookConnectPlugin.getLoginStatus(function(success){
            $log.info('302 pipolup > facebookSignIn > getLoginStatus', angular.toJson(success));
            if(success.status === 'connected'){
            //   $log.log('facebookSignIn > getLoginStatus > connected');
            //   // Check if we have our user saved
            //   var user = $localstorage.getObject('pipolup_info');
            //   if(!user.userID){
            //     getFacebookProfileInfo(success.authResponse).then(function(profileInfo) {
            //     $localstorage.set('pooock_uid', profileInfo.id);
            //     $localstorage.set('pooock_name', profileInfo.name);
            //     $localstorage.set('pooock_username', profileInfo.email);
            //     $localstorage.set('pooock_picture', "http://graph.facebook.com/" + profileInfo.id + "/picture?type=large");
            //     $localstorage.setObject('pooock_data', authResponse.authResponse);
            //     $log.info('facebookSignIn > getFacebookProfileInfo > profileInfo',angular.toJson(profileInfo));
            //     //
            //     // var user = $localstorage.getObject('pipolup_info');
            //     // var details = {
            //     //     userID: user.userID,
            //     //     name: user.name,
            //     //     email: user.email,
            //     //     picture: user.picture
            //     // }
            //     // registeredwithsocial(details);
            //     //
            //     $state.go('app.dash');
            //   }, function(fail){
            //     $log.error('facebookSignIn > getFacebookProfileInfo > profile info fail', fail);
            //   });
            // } else {
            //   $state.go('app.dash');
            // }
           } else {
               $ionicLoading.show();
                if (success.status === 'not_authorized' || success.status === 'unknown') { //the user is logged in to Facebook,
                  facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            }
        });
    };//facebookSignIn
    //
  });
