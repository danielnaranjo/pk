app.controller('AppCtrl', function($scope, $ionicDeploy, $ionicPopup, $timeout, Exchange, $ionicPush) {

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

// Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
        //console.info('Ionic Deploy: Checking for updates');
        $scope.version="";
        $ionicDeploy.channel = 'production'; //dev

        $ionicDeploy.check().then(function(hasUpdate) {
            $scope.hasUpdate = hasUpdate;
            if(hasUpdate==false){
                $scope.version=$rootScope.version;
            } else {
                $scope.doUpdate();
            }
            console.info('Ionic Deploy: Update available is ' + hasUpdate);
        }, function(err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        });
    }

    // check deploy service
    $scope.doUpdate = function() {
        $ionicDeploy.update().then(function(res) {
            $scope.version='Completada';
            // force to apply
            $ionicDeploy.load();
            console.error('Update Success! ', angular.toJson(res));
        }, function(err) {
            $scope.version='Error en descarga';
            console.error('Update error! ', angular.toJson(error));
        }, function(prog) {
            $scope.version='Descargando..';
            console.error('Progress... ', angular.toJson(prog));
        });
    };


});
