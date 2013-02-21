Overview
========

jquery.map allows you to add map layers from different providers to your app.

How to use
==========

Include jQuery (not bundled within this repo):

    <script type="text/javascript" src="jquery.js"></script>

Include map provider scripts (Google maps for example):

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=SET_TO_TRUE_OR_FALSE"></script>

Include necessary scripts:

    <script type="text/javascript" src="jquery.map.js"></script>
    <script type="text/javascript" src="jquery.map.driver.js"></script>

Init a map object:

    var map = $('#map_canvas').map('<map provider name>');

Add markers to map:

    var marker_info = {
        options: {
            position: {lat: 50.30, lng: 30.62},
            title: 'test marker',
            ...
        },
        events: {
            click: function(){
                // your event handler here
            },
            ...
        }
    }

    map.addMarker(marker_info);

Find already added marker by key:

    map.findMarker(<marker key here, index of markers array by default>);

Toggle visibility of your markers:

    map.toggleMarkers();      // toggles markers' visibility
    map.toggleMarkers(true);  // shows markers
    map.toggleMarkers(false); // hides markers

Clear markers from map:

    map.clearMarkers();

Fit map to existing map markers:

    map.fitToMarkers();

Add event listeners to map layer:

    map.addEventListener('click', function(event){
        // your event handler here
    });

Get current position of user on map (geolocation):

    map.geolocation(<success handler>, <failure handler>);

Available map drivers/providers
===============================

- Google

