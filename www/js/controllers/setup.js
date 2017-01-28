app.controller('SetupCtrl', function($scope, $rootScope, $stateParams, Exchange, $ionicUser, $ionicAuth, $ionicPopup, $state, $ionicSlideBoxDelegate, $ionicLoading, $log) {
/*
	// Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
        $log.info('**** Ionic Deploy: Checking for updates');
        $ionicDeploy.channel = 'production'; //dev
        $ionicDeploy.check().then(function(hasUpdate) {
            $scope.hasUpdate = hasUpdate;
            if(hasUpdate===false){
                $scope.version=$rootScope.version;
            } else {
                //http://www.theodo.fr/blog/2016/03/its-alive-get-your-ionic-app-to-update-automatically-part-2/
                $ionicPopup.show({
                    title: 'Actualización disponible',
                    //subTitle: 'An update was just downloaded. Would you like to restart your app to use the latest features?',
                    buttons: [
                    { text: 'Cancelar' },
                    { text: 'Instalar',
                        onTap: function(e) {
                            $scope.doUpdate();
                        }
                    }],
                });
            }
            $log.debug('**** Ionic Deploy: Update available is ' + hasUpdate);
        }, function(err) {
            $log.error('**** Ionic Deploy: Unable to check for updates', err);
        });
    };

    // check deploy service
    $scope.doUpdate = function() {
        $ionicLoading.show({
            template: 'Descargando, por favor, espere..',
            duration: 5000
        });
        $log.debug('Actualizando version..');
        $ionicDeploy.download().then(function(d) {
            $ionicLoading.show({
                template: 'Actualizando, por favor, espere..',
                duration: 5000
            });
            //$log.info('Progress... ');
            return $ionicDeploy.extract();
        }).then(function(d) {
            $ionicLoading.show({
                template: 'Versión actualizada! Reiniciando..',
                duration: 5000
            });
            $log.info('**** Update Success!');
            return $ionicDeploy.load();
        });
    };
*/
    $scope.entrar = function(){
        $state.go('audit');
    };

    $scope.slides = [
        {name:"Registrate", text:"Usa tu facebook o Twitter, jamas publicaremos en tu nombre!",  image:"img/PantallasSlider-02.png", button: true },
        {name:"Seleciona", text:"Tus gustos definen tus Pooock, no nosotros!",  image:"img/PantallasSlider-03.png" },
        {name:"Disfruta", text:"Al estar cerca de una ofera, recibirás un Pooock en tu smartphone", image:"img/PantallasSlider-05.png" },
        {name:"Comenzar", text:"Usa tu facebook o Twitter para continuar", image:"img/PantallasSlider-01.png", button: true },
    ];

    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
        //$log.debug('ionicSlideBoxDelegate next', $ionicSlideBoxDelegate);
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
        //$log.debug('slideIndex', index);
        if ($ionicSlideBoxDelegate.currentIndex() === 0 || $ionicSlideBoxDelegate.currentIndex() == $scope.slides.length-1) {
            $ionicSlideBoxDelegate.enableSlide(false);
        } else {
            $ionicSlideBoxDelegate.enableSlide(true);
        }
    };

    $scope.options = {
        loop: false,
        effect: 'fade',
        speed: 1000,
        slidesPerView: 3,
        centeredSlides: true,
        showPager: false
    };
    $scope.main = function(){
        if ($ionicAuth.isAuthenticated()) {
            $state.go('app.tareas');
        }
    };

    $scope.gotologin = function(){
        $state.go('login');
    };

});
