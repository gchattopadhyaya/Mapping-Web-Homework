
// Define arrays to hold created city and state markers
var cityMarkers = [];
var stateMarkers = [];

// Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Create two separate layer groups: one for cities and one for states
var states = L.layerGroup(stateMarkers);
var cities = L.layerGroup(cityMarkers);

// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
  "State Population": states,
  "City Population": cities
};

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streetmap, states, cities]
 });

 // Adding tile layer
 L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
 }).addTo(myMap);

 //var nyLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
 var nyLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
 var myMapStyle = {
    color: "black",
    fillColor: "yellow",
    fillOpacity: 0.5,
    weight: 1.5
 }

// Creating a geoJSON layer with the retrieved data
// Function that will determine the color of a neighborhood based on the Rating it belongs to

function chooseColor(mag) {
    switch (mag) {
    case 6.6:
        return "yellow";
    case 5.01:
        return "orange";
    case 4.1:
        return "red";
    case 4.2:
        return "green";
    case 5.8:
        return "blue";
    case 6.3:
        return "pink";
    case 6.8:
        return "purple";
    case 6.9:
        return "black";
    case 6.6:
        return "seagreen";
    case 5.9:
        return "maroon";
    default:
      return "red";
    }
  }
d3.json(nyLink, function(myData){
    console.log(myData)
    console.log(chooseColor(myData.features[1].properties.mag));

    L.geoJson(myData, {
        // Style each feature (in this case a neighborhood)
        style: function(feature) {
            console.log(feature)
            var mag = feature.properties.mag;
            console.log(mag)
            console.log(chooseColor(mag))
                return {
                    color: chooseColor(mag)
                };
    
        },
// Change Map Colors Based on Ratings.
    onEachFeature: function (feature, layer) {
     layer.bindPopup("<h1>" + "" + feature.properties.title + "</h1><hr><h2>" + "Earthquake Magnitude: " + feature.properties.mag + "</h2> <hr> <h2>" + "# Earthquake Location: " + feature.properties.place + "</h2>");
     },
     pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: Math.round(10*feature.properties.mag),
            fill: true,
            fillOpacity: 0.5
        }); 
        }
    }).addTo(myMap);

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

    //Adding a Map Legend
    var legend = L.control({position: 'bottomright'});
    legend.addTo(myMap);
  
 });