Driver.Google = function(container){
    Driver.call(this, container);
};

Driver.Google.prototype = Driver;

Driver.Google.prototype.createMap = function(element, options){
    var defaults = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    return new google.maps.Map(element, $.extend(defaults, options));
};

Driver.Google.prototype.createMarker = function(options){
    options.position = new google.maps.LatLng(options.position.lat, options.position.lng);
    return new google.maps.Marker(options);
};

Driver.Google.prototype.deleteMarker = function(marker){
    marker.setMap(null);
};

Driver.Google.prototype.toggleMarker = function(marker, visible){
    if (visible === undefined)
        visible = !marker.getVisible();

    marker.setVisible(visible);
};

Driver.Google.prototype.addEventListener = function(instance, name, handler){
    google.maps.event.addListener(instance, name, handler);
}

Driver.Google.prototype.setMapCenter = function(lat, lng){
    var position = new google.maps.LatLng(lat, lng);
    return this.map_container.map_layer.setCenter(position);
};

Driver.Google.prototype.fitMapToMarkers = function(markers){
    if (markers.length == 0) return false;

    if(markers.length == 1)
        return driver.setMapCenter(markers[0].position.lat(), markers[0].position.lng());

    var bounds = new google.maps.LatLngBounds();
    for(var i in markers)
        bounds.extend(markers[i].position);

    return this.map_container.map_layer.fitBounds(bounds);
};