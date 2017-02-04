app.controller('AccountCtrl', function($scope, $ionicPopup, $timeout, Exchange, Config, $log, $ionicUser,$ionicPlatform) {

  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  //$log.info('Exchange at account', angular.toJson(Exchange.data));

  $scope.mostrar = function(){
    var alertPopup = $ionicPopup.alert({
      title: '<i class="icon ion-ios-pricetag-outline"> Muy Pronto!',
      template: 'Personalizar lo que recibes en la palma de tu mano..',
      buttons: [{
        text:'OK',
        type: 'button-energized'
      }]
    });
    alertPopup.then(function(res) {
      //$log.log('Extra Pooock');
    });
    $timeout(function() {
      //close the popup after 5 seconds for some reason
      alertPopup.close();
    }, 5000);
    $log.log('fire!');
  };

  $scope.usuario=$ionicUser.social.twitter.data.full_name||$ionicUser.social.facebook.data.full_name;
  $scope.fotoPerfil=$ionicUser.social.twitter.data.profile_picture||$ionicUser.social.facebook.data.profile_picture;
  $scope.full_data=$ionicUser.social.twitter.data.raw_data||$$ionicUser.social.facebook.data.raw_data;
  $log.debug($ionicUser.social);

  $scope.categorias = [
    { text: "gastronomia" },
    { text: "eventos" },
    { text: "vestimenta" },
    { text: "mascotas" },
    { text: "novedades" },
    { text: "shopping" },
    { text: "deportes" },
    { text: "otras" },
  ];

  $ionicPlatform.ready(function () {
    // oculta el teclado
    cordova.plugins.Keyboard.close();
  });
  //
})
