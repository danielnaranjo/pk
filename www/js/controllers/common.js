app.controller('AppCtrl', function($scope, $rootScope, $ionicPopup, $timeout, Exchange, Config, $log, isUserLogged, $localstorage, $state) {

    isUserLogged.check();

    $scope.salir = function(){

        facebookConnectPlugin.logout(function(){
            $log.log('AppCtrl > Salir() > facebookConnectPlugin');
        },function(fail){
            $log.error('facebookConnectPlugin > logout');
        });

        window.plugins.googleplus.logout(function (msg) {
            $log.log('AppCtrl > Salir() > googleplus > logout', msg);
        },function(fail){
            $log.log(fail);
        });

        $localstorage.set('pooock_uid', '');
        $localstorage.set('pooock_name', '');
        $localstorage.set('pooock_username', '');
        $localstorage.set('pooock_picture', '');
        $localstorage.setObject('pooock_data', '');
        $ionicPush.unregister();
        $log.log('AppCtrl > Salir()');
        $state.go('login');
    };//salid

    // $scope.$on('cloud:push:notification', function(event, data) {
    //     $log.log('$ionicPush > notification', data);
    //     var msg = data.message;
    //     //alert(msg.title + ': ' + msg.text);
    //     var alertPopup = $ionicPopup.show({
    //         title: msg.title,
    //         subTitle: 'Beneficios exclusivos de Pooock',
    //         template: msg.text,
    //         buttons: [ { text: 'OK!' }]
    //     });
    //     alertPopup.then(function(res) {
    //       $log.log('App > cloud', res);
    //     });
    //     $log.info('$ionicPush > notification',data);
    // });//ionicPush

});
