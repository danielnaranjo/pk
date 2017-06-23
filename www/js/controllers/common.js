app.controller('AppCtrl', function($scope, $rootScope, $ionicPopup, $timeout, Exchange, Config, $log, $ionicPush, isUserLogged, $ionicAuth, $ionicUser, updateApp, $localstorage, $state) {

    isUserLogged.check();

    $scope.salir = function(){
        $localstorage.set('pooock_uid', '');
        $localstorage.set('pooock_name', '');
        $localstorage.set('pooock_username', '');
        $localstorage.set('pooock_picture', '');
        $localstorage.setObject('pooock_data', '');
        $ionicAuth.logout();
        $ionicPush.unregister();
        $log.log('AppCtrl > Salir() > ionicAuth', $ionicUser);
        $state.go('login');
    };//salid

    $scope.$on('cloud:push:notification', function(event, data) {
        $log.log('$ionicPush > notification', data);
        var msg = data.message;
        //alert(msg.title + ': ' + msg.text);
        var alertPopup = $ionicPopup.show({
            title: msg.title,
            subTitle: 'Beneficios exclusivos de Pooock',
            template: msg.text,
            buttons: [ { text: 'OK!' }]
        });
        alertPopup.then(function(res) {
          $log.log('App > cloud', res);
        });
        $log.info('$ionicPush > notification',data);
    });//ionicPush

});
