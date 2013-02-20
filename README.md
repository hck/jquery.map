Overview
========

jquery.map allows you to add map layers from different providers to your app.

How to use
==========

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

