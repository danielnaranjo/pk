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

app.factory('Geofences', function($http, Config, $ionicPlatform, $localstorage, $log, $window, $state, $rootScope, $ionicLoading, $ionicAuth, remoteServer, geoService) {
    return {
        check: function(){
          return $ionicPlatform.ready( function(){
            var points = $localstorage.getObject('points');
            //$log.log('Line 64: app > geofences > points', points, angular.toJson(points));
            // run when is already done!
            if(points.length>0){
              $log.log('Line 67: app > geofences > points loaded', points.length);
              $window.geofence.addOrUpdate(points);
              $window.geofence.onTransitionReceived = function (geofences) {
                  //$log.log(geofences);
                  if (geofences) {
                    $rootScope.$apply(function () {
                      geofences.forEach(function (geo) {
                        geo.notification = geo.notification || {
                          title: "Geofence transition",
                          text: "Without notification",
                          vibration: [0]// desactivado
                        };
                        $ionicLoading.show({
                          template: geo.notification.title + ": " + geo.notification.text,
                          noBackdrop: true,
                          duration: 2000
                        });
                        if ($ionicAuth.isAuthenticated()) {
                          //$state.go('app.timeline', { geofence_id: geo.notification.data.geofence_id, notification_id: geo.notification.data.notification_id, behavior_id: geo.notification.data.behavior_id });
                          $log.debug('geofences > $rootScope > $apply', angular.toJson(geo));
                        } else {
                          $log.error('geofences required your logged');
                          $state.go('login');
                        }
                      });
                    });
                  }
                  $window.geofence.onNotificationClicked = function (notificationData) {
                    //$log.log('notificationData',notificationData);
                    $log.info('notificationData',notificationData);
                    if (notificationData) {
                      $log.warn('onNotificationClicked', notificationData);
                    }
                  };
              };
              $window.geofence.initialize(function () {
                $log.info("geofence > Successful initialization");
              });
            }
          });
        },
        getting:function(){
          return $ionicPlatform.ready( function(){
            //$log.info('Cargando nuevos points..');
            remoteServer.getData('points')
            .success(function(response) {
              $log.debug('Line 142: How many Pooock are available?', response.length); 
              var points = [];
              for(var i=0; i<response.length; i++){
                //$log.debug('Line 116: ',angular.toJson(response[i]));
                var point = {
                  id:             UUIDjs.create().toString(),//response[i].geofence_id,
                  latitude:       response[i].latitude,
                  longitude:      response[i].longitude,
                  radius:         response[i].radius||100,
                  transitionType: response[i].transitionType||1,
                  notification: {
                    id:             response[i].notification_id,
                    title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
                    text:           response[i].message||'Tenemos un algo para ti!',
                    vibration:      [response[i].vibration||0], // si paga mas, tiene vibracion personalizado!
                    smallIcon:      'res://icon', // transparente
                    icon:           'file://img/pooock.png',
                    openAppOnClick: response[i].openAppOnClick||true,
                    data: {
                      geofence_id: response[i].geofence_id,
                      notification_id: response[i].notification_id,
                      behavior_id: response[i].behavior_id
                    }
                  }
                };
                //$log.debug('Line 138: ',response[i].geofence_id, angular.toJson(point) );
                points.push(point);
              }
              $localstorage.setObject('points', points);
              $log.debug('Line 142: $localstorage.getObject', angular.toJson($localstorage.getObject('points')));
            })
            .error(function(err){
              $log.error('remoteServer > new', err);
            });
        });
      },//new
      remove: function(){
        $window.geofence.removeAll().then(function () {
          $log.debug('All geofences successfully removed.');
        }, function (reason) {
          $log.error('Removing geofences failed', reason);
        });
      }//remove
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

// app.factory('updateApp', function($rootScope, $ionicDeploy, $ionicPopup, $ionicLoading, $log){
//   return {
//     checkForUpdates: function(){
//       $log.info('**** Ionic Deploy: Checking for updates');
//       $ionicDeploy.channel = 'production'; //dev
//       $ionicDeploy.check().then(function(hasUpdate) {
//           if(hasUpdate===false){
//               //$scope.version=$rootScope.version;
//           } else {
//               //http://www.theodo.fr/blog/2016/03/its-alive-get-your-ionic-app-to-update-automatically-part-2/
//               $ionicPopup.show({
//                   title: 'Actualización disponible',
//                   subTitle: 'Nuevas caracteristicas y funciones extras, quieres descargarla y probarla?',
//                   buttons: [
//                   { text: 'Cancelar' },
//                   { text: 'Descargar Ahora',
//                       onTap: function(e) {
//                         $ionicLoading.show({
//                             template: 'Descargando, por favor, espere..',
//                             duration: 5000
//                         });
//                         $log.debug('Actualizando version..');
//                         $ionicDeploy.download().then(function(d) {
//                             $ionicLoading.show({
//                                 template: 'Actualizando, por favor, espere..',
//                                 duration: 5000
//                             });
//                             //$log.info('Progress... ');
//                             return $ionicDeploy.extract();
//                         }).then(function(d) {
//                             $ionicLoading.show({
//                                 template: 'Versión actualizada! Reiniciando..',
//                                 duration: 5000
//                             });
//                             $log.info('**** Update Success!');
//                             return $ionicDeploy.load();
//                         });
//                       }
//                   }],
//               });
//           }
//           $log.debug('**** Ionic Deploy: Update available is ' + hasUpdate);
//       }, function(err) {
//           $log.error('**** Ionic Deploy: Unable to check for updates', err);
//       });
//     }
//   }
// });

// app.factory('appVersion', function($rootScope, $cordovaAppVersion, $log, $localstorage, $ionicPlatform){
//   return {
//     check: function(){
//       //console.debug('$cordovaAppVersion', angular.toJson($cordovaAppVersion)) ;
//       return $ionicPlatform.ready( function(){
//           $rootScope.device = ionic.Platform.device();
//           $rootScope.isWebView = ionic.Platform.isWebView();
//           cordova.getAppVersion.getVersionNumber().then(function (version){ // <-- No disponible en Local
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

app.factory('remoteServer', function($http, Config, $log){
    return {
        getData: function(url){
            $log.info('remoteServer > getData', url);
            var conf = {
                headers: {
                    //'Host':'http://pipolup.com',
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
                    //'Host':'http://pipolup.com',
                    //'Origin':'*'
                }
            }
            return $http.post(Config.Server+'/'+url, values, conf);
        }
    }
});
