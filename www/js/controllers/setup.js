app.controller('SetupCtrl', function($scope, $rootScope, $stateParams, Exchange, $ionicUser, $ionicAuth, $ionicPopup, $state, $ionicSlideBoxDelegate, $ionicLoading, $log, $localstorage) {

    $scope.slides = [
        {name:"Registrate", text:"Usa tu facebook o Twitter, jamas publicaremos en tu nombre!",  image:"img/PantallasSlider-02.png", button: true },
        {name:"Seleciona", text:"Tus gustos definen tus Pooock, no nosotros!",  image:"img/PantallasSlider-03.png" },
        {name:"Disfruta", text:"Al estar cerca de una ofera, recibirás un Pooock en tu smartphone", image:"img/PantallasSlider-05.png" },
        {name:"Comenzar", text:"Usa tu facebook o Twitter para continuar", image:"img/PantallasSlider-01.png", button: true },
    ];

    $scope.final=$scope.slides.length-1;

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
            $state.go('tab.dash');
        }
    };
    $scope.gotologin = function(){
        $state.go('login');
    };

});
