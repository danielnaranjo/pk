app.factory('Exchange', function (){
  return {
    data: {}
  };
})

app.factory('locationService', function ($http) {
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
        console.log('Error: Cant connect with Google Maps API');
      });
    }
  };
})


app.factory('geoService', function ($ionicPlatform, $cordovaGeolocation) {
  var positionOptions = {timeout: 10000, enableHighAccuracy: true}; 
  return {
    getPosition: function() {
      return $ionicPlatform.ready()
      .then(function() {
        return $cordovaGeolocation.getCurrentPosition(positionOptions);
      })
    }
  };
})

app.factory("Items", function($firebaseArray, $log, $firebaseUtils) {
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
})
