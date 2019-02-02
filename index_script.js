//initMap() is for displaying google map
var geocoder;
var markerArray = []; // array to save markers
var latitude;
var longitude;
var city;

function initMap() {	//initialize map position 
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8
        , center: {
            lat: 33.006842999999996
            , lng: -96.70195539999999
        }
    });
    geocoder = new google.maps.Geocoder(); //geocoder object is created from class google.maps.Geocoder
    document.getElementById('submit').addEventListener('click', function () { //anonymous function listening to the click event
        if (markerArray.length != 0) {
            markerArray[0].setMap(null); //setting the marker position of the first marker to null
        }
        geocodeAddress(geocoder, map); //function geocodeAddress() is called.
    });
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (results[0]) {
            console.log(status);
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap, // parameters of marker object
                    position: results[0].geometry.location // setting the marker position parameter in the map defined by resultsMap
                });
                markerArray[0] = marker; //pushing above marker to the first position of the markerArray
               // console.log("Location...", marker.position.lat());
               // console.log("Location...", marker.position.lng());
               // console.log("Location...", marker);
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                getTemperature(myUrl, latitude, longitude);
                getNewsFeed(address);
            }
        }
        else {
            alert('Please enter correct values');
        }
    });
}
//weather info
var myUrl = "http://api.openweathermap.org/data/2.5/weather"; //i have hardcoded lat and lon values since its not identifying  var 
function getTemperature(myUrl, latitude, longitude) {
    $.getJSON(myUrl, {
        lat: latitude,
        lon: longitude,
        appid: '041a0dbddf11ca6093e2375f2bbd541e'	//generated from openweathermap.org
    }, function (wd) {
        console.log("weather data...", wd);
        var currentLocation = wd.name;
        var currentWeather = wd.weather[0].description;
        var currentTemp = wd.main.temp;
        //console.log("Temp....", currentTemp);
        var currentTemp = Math.ceil(currentTemp * 9 / 5 - 459.67)+' °F';	//temperature
        var currentHumidity = wd.main.humidity+' %';	//humidity
        var currentTempmax = wd.main.temp_max;
        var currentTempmax = Math.ceil(currentTempmax * 9 / 5 - 459.67)+' °F';
        var currentTempmin = wd.main.temp_min;
        var currentTempmin = Math.ceil(currentTempmin * 9 / 5 - 459.67)+' °F';
        var currentPressure = wd.main.pressure;	
        var currentPressure = Math.ceil(currentPressure * 0.02953)+' Pi';	//pressure
        $('#temp').html(currentTemp);
        $('#maxtemp').html(currentTempmax);
        $('#mintemp').html(currentTempmin);
        $('#humidity').html(currentHumidity);
        $('#pressure').html(currentPressure);
    })
}

//News info-uses webhose.io API
function getNewsFeed(cityName){
   
	 var feed ="http://webhose.io/search?token=54eb6a67-5e9a-46ca-8b0a-c13832be7b6c&format=json&q=language%3A(english)";
    $.post( feed, {
        q: cityName,	//location is passed to webhose.io
        
        },function( data ) {
    console.log("News data.....",data.posts)	//api returned 
    var items = [];
  $.each( data.posts, function( key, val ) {
    items.push( "<li class='title-text' id='" + key + "'>" + val.title + "</li>" + "<p>"+val.text+"</p>" );
  });
 
 $("#news").empty(); //clearing div content 
  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "#news" ); //appending list items to div news
  
})
}
