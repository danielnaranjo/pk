app.controller('AppCtrl', function($scope, $ionicPopup, $timeout, Exchange, Config, $log, $ionicPush, ConnectivityMonitor, BatteryMonitor, isUserLogged, $ionicAuth, $ionicUser) {

    ConnectivityMonitor.startWatching();
    BatteryMonitor.startWatching();
    isUserLogged.check();

    $scope.salir = function(){
        $ionicAuth.logout();
        Exchange.data = '';
        $ionicPush.unregister();
        $log.log('AppCtrl > Salir() > ionicAuth', $ionicUser);
        $state.go('login');
    };//salid

    $scope.$on('cloud:push:notification', function(event, data) {
        $log.log('$ionicPush > notification', data);
        var msg = data.message;
        alert(msg.title + ': ' + msg.text);
        $localstorage.insertar('$ionicPush > notification',data);
    });//ionicPush

});
