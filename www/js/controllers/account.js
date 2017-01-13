app.controller('AccountCtrl', function($scope, $ionicPopup, $timeout, Exchange) {

  // Exchange's services
  $scope.lat = Exchange.data.lat;
  $scope.long = Exchange.data.long;
  console.info('Exchange at account', angular.toJson(Exchange.data));

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
      //console.log('Extra Pooock');
    });
    $timeout(function() {
      //close the popup after 5 seconds for some reason
      alertPopup.close();
    }, 5000);
    console.log('fire!');
  };

  $scope.categorias = [
    { text: "Compras", checked: true },
    { text: "Deportes", checked: true },
    { text: "Eventos", checked: true },
    { text: "Gastronomia", checked: true },
    { text: "Hombre", checked: true },
    { text: "Mujer", checked: true },
  ];

  //
})