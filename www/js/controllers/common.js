app.controller('AppCtrl', function($scope, $rootScope, $ionicPopup, $timeout, Exchange, Config, $log, $ionicPush, isUserLogged, $ionicAuth, $ionicUser, updateApp, appVersion, $localstorage) {

    isUserLogged.check();

    $scope.salir = function(){
        $ionicAuth.logout();
        $ionicPush.unregister();
        $log.log('AppCtrl > Salir() > ionicAuth', $ionicUser);
        $state.go('login');
    };//salid

    $scope.$on('cloud:push:notification', function(event, data) {
        $log.log('$ionicPush > notification', data);
        var msg = data.message;
        alert(msg.title + ': ' + msg.text);
        $log.info('$ionicPush > notification',data);
    });//ionicPush

});
