app.factory('Exchange', function (){
  return {
    data: {}
  };
});


app.factory('geoService', function ($ionicPlatform, $cordovaGeolocation, $log, $http) {
  var positionOptions = {timeout: 10000, enableHighAccuracy: true};
  var locations = [];
  var latlng = "";
  return {
    getPosition: function() {
      return $ionicPlatform.ready()
      .then(function() {
        return $cordovaGeolocation.getCurrentPosition(positionOptions);
      })
    },
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
        //Rollbar.warning("services > geoService > getLocation > Cant connect with Google Maps API");
      });
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

app.factory('isUserLogged', function($rootScope, $log, $state, $ionicPlatform, $localstorage){
    return {
        check: function(){
            //$log.debug('isUserLogged', $ionicUser);
            if ($ionicAuth.isAuthenticated()) {
                // Monitoreo y aplico!
                $log.log('isAuthenticated', $ionicAuth.isAuthenticated() );
                $rootScope.usuario = $localstorage.get('pooock_name');
                $rootScope.fotoPerfil = $localstorage.get('pooock_picture');
                $rootScope.uid = $localstorage.get('pooock_uid');
                $rootScope.full_data = $localstorage.getObject('pooock_data');
                //$rootScope.u = $ionicUser.id;
            }
        }
    };
});

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
              //Rollbar.debug("services > openBrowser");
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
                  'X-Requested-By' : moment().unix()
                },
                cache: true
            }
            return $http.get(Config.Server+'/'+url, conf);
        },
        postData: function(url, values){
            $log.info('remoteServer > postData', url);
            $log.debug('remoteServer > postData', values);
            var conf = {
                headers: {
                  'X-Requested-By' : moment().unix()
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
        },
        getStatic: function(url){
            $log.info('remoteServer > getData', url);
            var conf = {
                cache: true
            }
            return $http.get(Config.API+'/'+url, conf);
        },
    }
});

app.factory('Geofences', function($http, remoteServer, $localstorage, $log) {
    return {
        all: function(latitude, longitude, radius) {
            //return points;
            return remoteServer.getData('points/'+latitude+'/'+longitude+'/'+radius)
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
                              //u: $ionicUser.id
                            }
                        }
                    }
                    points.push(point);
                    $log.log(i, point);
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
                //Rollbar.critical("services > Geofences > all");
            });
        }
    }
});