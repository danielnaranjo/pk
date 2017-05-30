app.controller('AccountCtrl', function($scope, $rootScope, $ionicPopup, $timeout, Exchange, Config, $log, $ionicUser, $ionicPlatform, remoteServer, $localstorage) {

    if($ionicUser){
        $scope.usuario=$ionicUser.social.twitter.data.full_name||$ionicUser.social.facebook.data.full_name;
        $scope.fotoPerfil=$ionicUser.social.twitter.data.profile_picture||$ionicUser.social.facebook.data.profile_picture;
        $scope.full_data=$ionicUser.social.twitter.data.raw_data||$$ionicUser.social.facebook.data.raw_data;
        $log.debug($ionicUser.social);
    }

    remoteServer.getData('category')
    .success(function(data) {
        $scope.categorias = data.result;
        $log.debug('category', data.result);
    })
    .error(function(err){
        $log.error('category',err);
    });

    // $ionicPlatform.ready(function () {
    //   // oculta el teclado
    //   cordova.plugins.Keyboard.close();
    // });
    //

});
