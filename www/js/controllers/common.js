app.controller('AppCtrl', function($scope, $ionicDeploy, $ionicPopup, $timeout, Exchange, $ionicPush, $ionicPopup) {

    $scope.checkForPush = function(){
      // register to received pushes :)
      $ionicPush.register().then(function(t) {
          return $ionicPush.saveToken(t);
      }).then(function(t) {
          console.log('Token saved:', t.token);
      });

      // push received :p
      $scope.$on('cloud:push:notification', function(event, data) {
          var msg = data.message;
          alert(msg.title + ': ' + msg.text);
          console.info('push received:', msg.title, msg.text);
      });
    }

    $scope.checkForUpdates = function() {
      console.info('Ionic Deploy: Checking for updates');
      $ionicDeploy.channel = 'production'; //dev
      $ionicDeploy.check().then(function(hasUpdate) {
          $scope.hasUpdate = hasUpdate;
          if(hasUpdate==false){
              $scope.version=$rootScope.version;
          } else {
              //http://www.theodo.fr/blog/2016/03/its-alive-get-your-ionic-app-to-update-automatically-part-2/
              $ionicPopup.show({
                  title: 'Actualización disponible',
                  subTitle: 'Una actualizacion esta a punto de ser descarga. Desea reiniciar la App luego de descargarla?',
                  buttons: [
                  { text: 'Cancelar' },
                  { text: 'Instalar',
                      onTap: function(e) { 
                          $scope.doUpdate();
                          //deploy.load();
                      }
                  }],
              });
          }
          console.debug('Ionic Deploy: Update available is ' + hasUpdate);
      }, function(err) {
          console.error('Ionic Deploy: Unable to check for updates', err);
      });
    };
    
    // check deploy service
    $scope.doUpdate = function() {
      console.debug('Actualizando version..');
      $ionicDeploy.download().then(function(d) {
          console.info('Progress... ', angular.toJson(d));
          return $ionicDeploy.extract();
      }).then(function(d) {
          console.error('Update Success! ', angular.toJson(d));
          return $ionicDeploy.load();
      });
    };


});
