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

app.factory("Items", function($firebaseArray, $log, $firebaseUtils, $log) {
  // See https://firebase.google.com/docs/web/setup#project_setup for how to
  // auto-generate this config
  var config = {
    apiKey: "AIzaSyCA2P4MnVACn6_jvbj8aupCmDSlOHfY8JY",
    authDomain: "pooock.firebaseapp.com", //260441399546
    databaseURL: "https://pooock-1150.firebaseio.com"
  };
  firebase.initializeApp(config);
  var rootRef = firebase.database().ref();
  return rootRef;
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
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        clear: function(key){
            $window.localStorage.removeItem(key);
        }
    };
});

app.factory("logFirebase", function($firebaseArray) {
    var ref = firebase.database().ref();
    return $firebaseArray(ref);
});

app.factory('Geofences', function($http, Config, $localstorage, $log, $window, $state, $rootScope, $ionicLoading, $ionicAuth, remoteServer, geoService) {
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
        check: function(){
            var points = $localstorage.getObject('points');
            //console.log('app > geofences > points', points, angular.toJson(points));
            // run when is already done!
            if(points.length>0){
              $log.log('app > geofences > points loaded', points.length);
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
                                //$state.go('app.tomar', { branch_id: geo.notification.data.branch_id, task_id: geo.notification.data.task_id });
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
        },
        remove: function(){
          $window.geofence.removeAll().then(function () {
            $log.debug('All geofences successfully removed.');
          }, function (reason) {
            $log.error('Removing geofences failed', reason);
          });
        },
        new:function(){
          $log.info('Cargando nuevos points..');
          remoteServer.getData('points')
            .success(function(data) {
              //
              var points = [];
              for(var i=0; i<data.results.length+1; i++){
                $log.debug(angular.toJson(data.results[i]));
                var point = {
                    id:             UUIDjs.create().toString(),//data.results[i].geofence_id,
                    latitude:       data.results[i].latitude,
                    longitude:      data.results[i].longitude,
                    radius:         data.results[i].radius,
                    transitionType: data.results[i].notification.transitionType,
                    notification: {
                      id:             data.results[i].notification.notification_id,
                      title:          'Pooock!',// si paga mas, tiene mensaje personalizado!
                      text:           data.results[i].notification.message||'Tenemos una promo para ti!',
                      vibration:      [0], // si paga mas, tiene vibracion personalizado! -> data.results[i].notification.vibration||
                      smallIcon:      'res://icon', // transparente
                      icon:           'file://img/icono.png',
                      openAppOnClick: data.results[i].notification.openAppOnClick||true,
                      data: {
                        raw: data.results[i].notification.data
                      }
                    }
                };
                //$log.debug(angular.toJson(point));
                points.push(point);
              }
              //$localstorage.setObject('points');
              $log.debug('Total', data.records);
              $log.debug(points);
              //
            })
            .error(function(err){
              $log.error('remoteServer > new', err);
            });
          //
        }
    };
});



app.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork, $ionicPopup, $log){
    //http://www.joshmorony.com/part-3-advanced-google-maps-integration-with-ionic-and-remote-data/
    return {
        isOnline: function(){
            if(ionic.Platform.isWebView()){
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function(){
            if(ionic.Platform.isWebView()){
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        },
        startWatching: function(){
            if(ionic.Platform.isWebView()){
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                  //$log.log("went online");
                });
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                  //$log.log("went offline");
                });
            } else {
                window.addEventListener("online", function(e) {
                  //$log.log("went online");
                }, false);
                window.addEventListener("offline", function(e) {
                  //$log.log("went offline");
                }, false);
            }
        }
    };
});

app.factory('BatteryMonitor', function($rootScope, $cordovaBatteryStatus, $ionicPopup, $ionicPlatform, $localstorage, $log){
    return {
        startWatching: function(){
            $ionicPlatform.ready(function() {
                $rootScope.$on('$cordovaBatteryStatus:status', function(event, args){
                    var batteryLevel = args.level;
                    if(batteryLevel < 20){
                        var confirmPopup = $ionicPopup.show({
                            title: 'Pooock!',
                            template: 'Tienes '+ batteryLevel +'% de bateria',
                            buttons: [{
                                text: 'Ok',
                                type: 'button-balanced pipol_verde',
                                onTap: function(e) {
                                  //$log.info('Poca bateria! ' + batteryLevel +'%');
                                }//onTap
                            }]
                        });
                    }
                    //$log.debug('cordovaBatteryStatus', angular.toJson(args));
                });
            });
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
      $log.info('**** Ionic Deploy: Checking for updates');
      $ionicDeploy.channel = 'production'; //dev
      $ionicDeploy.check().then(function(hasUpdate) {
          if(hasUpdate===false){
              //$scope.version=$rootScope.version;
          } else {
              //http://www.theodo.fr/blog/2016/03/its-alive-get-your-ionic-app-to-update-automatically-part-2/
              $ionicPopup.show({
                  title: 'Actualización disponible',
                  subTitle: 'Tenemos una nueva version con nuevas caracteriticas y funciones, quieres descargarla y probarla?',
                  buttons: [
                  { text: 'Cancelar' },
                  { text: 'Descargar Ahora',
                      onTap: function(e) {
                        updateApp.doUpdate();
                      }
                  }],
              });
          }
          $log.debug('**** Ionic Deploy: Update available is ' + hasUpdate);
      }, function(err) {
          $log.error('**** Ionic Deploy: Unable to check for updates', err);
      });
    },
    doUpdate: function(){
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
    }
  }
});

app.factory('appVersion', function($rootScope, $cordovaAppVersion, $log, $localstorage){
  return {
    check:function(){
      //console.debug('$cordovaAppVersion', angular.toJson($cordovaAppVersion)) ;
        $rootScope.device = ionic.Platform.device();
        $rootScope.isWebView = ionic.Platform.isWebView();
        cordova.getAppVersion.getVersionNumber().then(function (version){ // <-- No disponible en Local
          $rootScope.version = version;
          $log.info('device@info', $rootScope.version, $rootScope.device.platform);
      }, function(error){
          $log.error('getVersionNumber failed', angular.toJson(error));
      });
      var userDevice = {
        os: $rootScope.device.platform,
        version: $rootScope.device.version,
        webView: $rootScope.isWebView,
        app_version: $rootScope.version,
        cordova_version: $rootScope.device.cordova
      }
      $localstorage.setObject('userDevice', userDevice );
      $log.debug('userDevice', angular.toJson(userDevice));
    },
    getPlatform: function() {
      return $localstorage.getObject('userDevice');
    }
  }
});

app.factory('Utils', function($http, $localstorage, $rootScope, $log, $cordovaInAppBrowser, $ionicPlatform, ConnectivityMonitor, remoteServer){
  return {
    /*sync: function(){
      if(ConnectivityMonitor.isOnline()){
        $localstorage.remove('points');
        remoteServer.getData('points')
          .success(function(data) {
            $scope.timeline=data.result;
          })
          .error(function(err){
            $log.error(err);
          });
        $localstorage.setObject('points', points );
        $log.debug('sync');
      }
    },*/
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
