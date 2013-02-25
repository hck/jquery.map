(function($){
    $.fn.map.Driver.Leaflet = function(container){
        $.fn.map.Driver.call(this, container);
    }

    $.fn.map.Driver.Leaflet.prototype = $.fn.map.Driver;

    $.fn.map.Driver.Leaflet.prototype.mapDefaults = {
        zoom: 15
    };

    $.fn.map.Driver.Leaflet.prototype.createMap = function(element, options){
        //var tile_layer = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        var tile_layer = L.tileLayer(options['url'] || 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            key: options['api_key'],
            styleId: 997
        });

        var defaults = this.mapDefaults;
        defaults.layers = [tile_layer];

        return L.map(element, $.extend(defaults, options));
    };

    $.fn.map.Driver.Leaflet.prototype.createMarker = function(options){
        var position = new L.LatLng(options.position.lat, options.position.lng);
        return L.marker(position, options).addTo(this.map_container.map_layer);
    };

    $.fn.map.Driver.Leaflet.prototype.deleteMarker = function(marker){
        marker.remove();
    };

    $.fn.map.Driver.Leaflet.prototype.toggleMarker = function(marker, visible){
        if (visible === undefined)
            visible = marker.opacity == 1;

        marker.opacity = visible ? 1.0 : 0.0;
    };

    $.fn.map.Driver.Leaflet.prototype.addEventListener = function(instance, name, handler){
        instance.on(name, handler);
    }

    $.fn.map.Driver.Leaflet.prototype.setMapCenter = function(lat, lng){
        var position = new L.LatLng(lat, lng);
        var map = this.map_container.map_layer;

        map.setView(position, map.getZoom() || this.mapDefaults.zoom);
    };

    $.fn.map.Driver.Leaflet.prototype.fitMapToMarkers = function(markers){
        if (markers.length == 0) return false;

        if(markers.length == 1){
            var pos = markers[0].getLatLng();
            return this.setMapCenter(pos.lat, pos.lng);
        }

        var bounds = new L.LatLngBounds();
        for(var i in markers)
            bounds.extend(markers[i].getLatLng());

        return this.map_container.map_layer.fitBounds(bounds);
    };



    // Leaflet MarkerWrapper
    $.fn.map.Driver.Leaflet.prototype.MarkerWrapper = function(marker){
        this.marker = marker;
        var that = this;

        this.getTitle = function(){
            return that.marker.options.title;
        };
    };
})(jQuery);