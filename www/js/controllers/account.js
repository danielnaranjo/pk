app.controller('AccountCtrl', function($scope, $ionicDeploy, $ionicPopup, $timeout, Exchange, Config) {

  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  $log.info('Exchange at account', angular.toJson(Exchange.data));

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

  //
})
