
app.filter('distance', function () {
    return function (lat1,lon1,lat2,lon2) {
        //http://stackoverflow.com/a/13841047
        function deg2rad(deg) {
            return deg * (Math.PI/180);
        }
        var R = 6371; // Radius of the earth in km (6371) or mt (6378137)
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = Math.ceil(R * c); // Distance in km
        return d;
    };
});

app.filter('converter', function () {
    var conversionKey = {
        m: {
            km: 0.001,
            m:1
        },
        km: {
            km:1,
            m: 1000
        }
    };
    return function (distance, from, to) {
        return distance * conversionKey[from][to] + to;
    };
});