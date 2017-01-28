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
        url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&sensor=true",
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

app.factory('$localstorage', function($window, $cordovaSQLite, $log) {
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
        },
        insertar: function(action){
            $cordovaSQLite.execute(db, "INSERT INTO logs (action, date) VALUES (?,?)", [action, new Date()]).then(function(res) {
                $log.log("INSERT ID -> " + res.insertId);
                //return res.insertId;
            }, function (err) {
                $log.error('$localstorage > insertar', err);
            });
        },
        seleccionar: function(){
            $cordovaSQLite.execute(db, "SELECT * FROM logs").then(function(res) {
                if(res.rows.length > 0) {
                    for(var i = 0; i < res.rows.length; i++){
                        $log.info(i+ ".- " + res.rows.item(i).action + " " + res.rows.item(i).date);
                    }
                    $log.debug("results -> " + res.rows.length);
                    return res;
                } else {
                    $log.info("No results found");
                }
            }, function (err) {
                $log.error('$localstorage > seleccionar', err);
            });
        }
    };
});

app.factory("logFirebase", function($firebaseArray) {
    var ref = firebase.database().ref();
    return $firebaseArray(ref);
});

app.factory('Geofences', function($http, Config, $localstorage, $log, $window, $state, $rootScope, $ionicLoading, $ionicAuth) {
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
                                    $state.go('app.tomar', { branch_id: geo.notification.data.branch_id, task_id: geo.notification.data.task_id });
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
                    var alertPopup = $ionicPopup.alert({
                        title: 'PipolUp!',
                        template: 'Comprueba tu conexión a Internet'
                    });
                    alertPopup.then(function(res) {
                        $log.log('Comprueba tu conexión a Internet', res);
                    });
                    $log.log("went offline");
                });
            } else {
                window.addEventListener("online", function(e) {
                    //$log.log("went online");
                }, false);
                window.addEventListener("offline", function(e) {
                    $log.log("went offline");
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
                            title: 'PipolUp!',
                            template: 'Tienes '+ batteryLevel +'% de bateria',
                            buttons: [{
                                text: 'Ok',
                                type: 'button-balanced pipol_verde',
                                onTap: function(e) {
                                    $log.info('Poca bateria! ' + batteryLevel +'%');
                                }//onTap
                            }]
                        });
                        // pendiente las notificaciones
                        $localstorage.insertar('AppCtrl batteryLevel()', angular.toJson(args));
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

app.factory('updateApp', function($scope, $rootScope,Exchange, $ionicUser, $ionicAuth, $ionicPopup, $ionicLoading, $log){
  return {
    checkForUpdates: function(){
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
