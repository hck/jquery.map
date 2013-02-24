Driver.Leaflet = function(container){
    Driver.call(this, container);
}

Driver.Leaflet.prototype = Driver;

Driver.Leaflet.prototype.mapDefaults = {
    zoom: 15
};

Driver.Leaflet.prototype.createMap = function(element, options){
    var tile_layer = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        key: options['api_key'],
        styleId: 997,
        maxZoom: 18
    });

    var defaults = this.mapDefaults;
    defaults.layers = [tile_layer];

    return L.map(element, $.extend(defaults, options));
};

Driver.Leaflet.prototype.createMarker = function(options){
    var position = new L.LatLng(options.position.lat, options.position.lng);
    return L.marker(position).addTo(this.map_container.map_layer);
};

Driver.Leaflet.prototype.deleteMarker = function(marker){
    marker.remove();
};

Driver.Leaflet.prototype.toggleMarker = function(marker, visible){
    if (visible === undefined)
        visible = marker.opacity == 1;

    marker.opacity = visible ? 1.0 : 0.0;
};

Driver.Leaflet.prototype.addEventListener = function(instance, name, handler){
    //L.DomEvent.addListener(instance, name, handler);
    this.map_container.map_layer.on(name, handler);
}

Driver.Leaflet.prototype.setMapCenter = function(lat, lng){
    var position = new L.LatLng(lat, lng);
    //this.map_container.map_layer.center = position;
    var map = this.map_container.map_layer;

    console.log('set map center with ', position, map.getZoom());

    map.setView(position, map.getZoom() || this.mapDefaults.zoom);
};

Driver.Leaflet.prototype.fitMapToMarkers = function(markers){
    if (markers.length == 0) return false;

    if(markers.length == 1){
        var pos = markers[0].getLatLng();
        return driver.setMapCenter(pos.lat, pos.lng);
    }

    var bounds = new L.LatLngBounds();
    for(var i in markers)
        bounds.extend(markers[i].getLatLng());

    return this.map_container.map_layer.fitBounds(bounds);
};