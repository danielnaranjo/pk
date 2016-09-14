angular.module('starter.services', [])

.factory('Exchange', function (){
  return {
    data: {}
  };
})

.factory('locationService', function ($http) {
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


.factory('geoService', function ($ionicPlatform, $cordovaGeolocation) {
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

.factory('Chats', function() {
  /*
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];
  return {
    all: function() {
      return timeline;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
  */
})

.factory("Items", function($firebaseArray, $log, $firebaseUtils) {
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
