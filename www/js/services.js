app.factory('Exchange', function (){
  return {
    data: {}
  };
});

app.factory('locationService', function ($http, $log) {
   var locations = [];
   var latlng = "";
   return {
     getLocation: function(latlng){
     return $http({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&sensor=true",
        method: "GET",
        })
     .then(function(response){
        locations = response.data;
        return locations;
      }, function(error){
        $log.error('Error: Cant connect with Google Maps API');
      });
    }
  };
});


app.factory('geoService', function ($ionicPlatform, $cordovaGeolocation, $log) {
  var positionOptions = {timeout: 10000, enableHighAccuracy: true};
  return {
    getPosition: function() {
      return $ionicPlatform.ready()
      .then(function() {
        return $cordovaGeolocation.getCurrentPosition(positionOptions);
      })
    }
  };
});

app.factory('$localstorage', function($window, $log) {
    return {
        set: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) { //$log.debug('key', key);
          return JSON.parse($window.localStorage[key] || '{}');
        },
        clear: function(key){
          $window.localStorage.removeItem(key);
        }
    };
});

app.factory('isUserLogged', function($rootScope, $ionicAuth, $ionicUser, $log, $state, $ionicPlatform){
    return {
        check: function(){
            //$log.debug('isUserLogged', $ionicUser);
            if ($ionicAuth.isAuthenticated()) {
                // Monitoreo y aplico!
                $log.log('isAuthenticated', $ionicAuth.isAuthenticated() );
                // social login
                if($ionicUser.details.facebook_id){
                    $rootScope.nombrePerfil = $ionicUser.social.facebook.data.full_name;
                    $rootScope.fotoPerfil = $ionicUser.social.facebook.data.profile_picture;
                    $rootScope.emailPerfil = $ionicUser.social.facebook.data.email;
                    //$log.info('isUserLogged > check > facebook:',  $rootScope.nombrePerfil, $ionicUser.social.facebook);
                } else { // email
                    $rootScope.nombrePerfil = $ionicUser.details.name;
                    $rootScope.fotoPerfil = $ionicUser.details.image||'img/avatar.png';
                    //$log.info('isUserLogged > check > details:', $rootScope.nombrePerfil, $ionicUser.details );
                }
                //$rootScope.nombrePerfil = $ionicUser.details.name||$ionicUser.social.facebook.data.full_name;
                //$rootScope.fotoPerfil = $ionicUser.details.image||$ionicUser.social.facebook.data.profile_picture;
                //$rootScope.emailPerfil = $ionicUser.details.image||$ionicUser.social.facebook.data.email;
            }
        }
    };
});

app.factory('updateApp', function($rootScope, $ionicDeploy, $ionicPopup, $ionicLoading, $log){
  return {
    checkForUpdates: function(){
      $log.info('Ionic Deploy: Checking for updates');
      $ionicDeploy.channel = 'production'; //dev
      $ionicDeploy.check().then(function(hasUpdate) {
          if(hasUpdate===false){
              //$scope.version=$rootScope.version;
          } else {
              //http://www.theodo.fr/blog/2016/03/its-alive-get-your-ionic-app-to-update-automatically-part-2/
              $ionicPopup.show({
                  title: 'Actualización disponible',
                  subTitle: 'Nuevas caracteristicas y funciones extras, quieres descargarla y probarla?',
                  buttons: [
                  { text: 'Cancelar' },
                  { text: 'Descargar Ahora',
                      onTap: function(e) {
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
                            $log.info('Update Success!');
                            return $ionicDeploy.load();
                        });
                      }
                  }],
              });
          }
          $log.debug('Ionic Deploy: Update available is ' + hasUpdate);
      }, function(err) {
          $log.error('Ionic Deploy: Unable to check for updates', err);
      });
    }
  }
});

// app.factory('appVersion', function($rootScope, $cordovaAppVersion, $log, $localstorage, $ionicPlatform){
//   return {
//     check: function(){
//       //console.debug('$cordovaAppVersion', angular.toJson($cordovaAppVersion)) ;
//       return $ionicPlatform.ready( function(){
//           $rootScope.device = ionic.Platform.device();
//           $rootScope.isWebView = ionic.Platform.isWebView();
//           $cordovaAppVersion.getVersionNumber().then(function (version){ // <-- No disponible en Local
//             $rootScope.version = version;
//             $log.info('device@info', $rootScope.version, $rootScope.device.platform);
//         }, function(error){
//             $log.error('getVersionNumber failed', angular.toJson(error));
//         });
//         var userDevice = {
//           os: $rootScope.device.platform,
//           version: $rootScope.device.version,
//           webView: $rootScope.isWebView,
//           app_version: $rootScope.version,
//           cordova_version: $rootScope.device.cordova
//         }
//         $localstorage.setObject('userDevice', userDevice );
//         $log.debug('userDevice', angular.toJson(userDevice));
//       })
//     },
//     getPlatform: function() {
//       return $localstorage.getObject('userDevice');
//     }
//   }
// });

app.factory('Utils', function($http, $localstorage, $rootScope, $log, $cordovaInAppBrowser, $ionicPlatform, ConnectivityMonitor, remoteServer){
  return {
    openBrowser : function(Url){
      var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'no'
          };
      $ionicPlatform.ready(function(){
          $cordovaInAppBrowser.open(Url+'/?utm_source=inappbrowser', '_system', options)
          .then(function(event) {
              //$log.debug('cordovaInAppBrowser',event);
          })
          .catch(function(event) {
              $log.error('cordovaInAppBrowser',event);
          });
      });
    },
    firstUsage : function(Boolean){
        var userDevice = {
            firstUsage: true,
            slider:true,
        }
        $localstorage.setObject('userDevice', userDevice );
    }
  }
});

app.factory('remoteServer', function($http, Config, $log, $firebaseArray){
    return {
        getData: function(url){
            $log.info('remoteServer > getData', url);
            var conf = {
                headers: {
                    //'Host':'http://pooock.com',
                    //'Origin':'*'
                }
            }
            return $http.get(Config.Server+'/'+url, conf);
        },
        postData: function(url, values){
            $log.info('remoteServer > postData', url);
            $log.debug('remoteServer > postData', values);
            var conf = {
                headers: {
                    //'Host':'http://pooock.com',
                    //'Origin':'*'
                }
            }
            return $http.post(Config.Server+'/'+url, values, conf);
        },
        pushFirebase: function(g,n,u,m){
            $log.debug('remoteServer > pushFirebase', g, n, u, m);
            var ref = firebase.database().ref().child(m);
            var saving = $firebaseArray(ref);
            saving.$add({
              geofence: g,
              notification: n,
              user: u,
              timestamp: moment().unix()
            });
        }
    }
});

app.factory('Geofences', function($http, remoteServer, $localstorage, $ionicUser) {
    /*
    {
        id:             String, //A unique identifier of geofence
        latitude:       Number, //Geo latitude of geofence
        longitude:      Number, //Geo longitude of geofence
        radius:         Number, //Radius of geofence in meters
        transitionType: Number, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
        notification: {         //Notification object
            id:             Number, //optional should be integer, id of notification
            title:          String, //Title of notification
            text:           String, //Text of notification
            smallIcon:      String, //Small icon showed in notification area, only res URI
            icon:           String, //icon showed in notification drawer
            openAppOnClick: Boolean,//is main app activity should be opened after clicking on notification
            vibration:      [Integer], //Optional vibration pattern - see description
            data:           Object  //Custom object associated with notification
        }
    }
    */
    return {
        all: function() {
            //return points;
            return remoteServer.getData('points.json')        
            .success(function(response) {
                var data = response;
                var points = [];
                for(var i = 0; i < data.length; i++){
                    var point = {
                        id:             data[i].id,
                        latitude:       data[i].latitude,
                        longitude:      data[i].longitude,
                        radius:         data[i].radius,
                        transitionType: data[i].transitionType,
                        notification: {
                            id:             data[i].notification_id,
                            title:          data[i].title,
                            text:           data[i].text,
                            vibration:      [0], // Sin vibracion!
                            smallIcon:      'res://icon',
                            icon:           'file://img/icono.png',
                            openAppOnClick: data[i].openAppOnClick,
                            data : {
                              g: data[i].id,
                              n: data[i].notification_id,
                              u: $ionicUser.id
                            }
                        }
                    }
                    points.push(point);
                    //$log.log(i, point);
                }
                // localStorage 
                $localstorage.clear('points');
                $localstorage.setObject('points', points );
                var points = $localstorage.getObject('points');
                //$log.log('points', angular.toJson(points));
                return points;
            })
            .error(function(err){
                $log.error('No se pudo recuperar la data', err);
            });
        }
    }
});