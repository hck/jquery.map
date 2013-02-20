function Driver(map_container){
    this.map_container = map_container;
};

Driver.prototype = {
    map_container: null,

    createMap: function(){
        throw new Error("should be implemented in map provider driver");
    },
    createMarker: function(options){
        throw new Error("should be implemented in map provider driver");
    },
    deleteMarker: function(marker){
        throw new Error("should be implemented in map provider driver");
    },
    toggleMarker: function(marker, visible){
        throw new Error("should be implemented in map provider driver");
    },
    addEventListener: function(instance, eventName, handler) {
        throw new Error("should be implemented in map provider driver");
    },
    setMapCenter: function(position){
        throw new Error("should be implemented in map provider driver");
    },
    fitMapToMarkers: function(markers){
        throw new Error("should be implemented in map provider driver");
    }
};

Driver.Google = function(map_container){
    this.map_container = map_container;
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

Driver.Google.prototype.setMapCenter = function(position){
    return this.map_container.map_layer.setCenter(position);
};

Driver.Google.prototype.fitMapToMarkers = function(markers){
    if (markers.length == 0) return false;

    if(markers.length == 1)
        return driver.setMapCenter(markers[0].position);

    var bounds = new google.maps.LatLngBounds();
    for(var i in markers)
        bounds.extend(markers[i].position);

    return this.map_container.map_layer.fitBounds(bounds);
};

// leaflet maps driver
//Driver.Leaflet = function(){
//
//}
//Driver.Leaflet.prototype = Driver;