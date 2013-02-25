(function($){
    $.fn.map.Driver.Google = function(container){
        $.fn.map.Driver.call(this, container);
    };

    $.fn.map.Driver.Google.prototype = $.fn.map.Driver;

    $.fn.map.Driver.Google.prototype.createMap = function(element, options){
        var defaults = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        return new google.maps.Map(element, $.extend(defaults, options));
    };

    $.fn.map.Driver.Google.prototype.createMarker = function(options){
        options.position = new google.maps.LatLng(options.position.lat, options.position.lng);
        return new google.maps.Marker(options);
    };

    $.fn.map.Driver.Google.prototype.deleteMarker = function(marker){
        marker.setMap(null);
    };

    $.fn.map.Driver.Google.prototype.toggleMarker = function(marker, visible){
        if (visible === undefined)
            visible = !marker.getVisible();

        marker.setVisible(visible);
    };

    $.fn.map.Driver.Google.prototype.addEventListener = function(instance, name, handler){
        google.maps.event.addListener(instance, name, handler);
    }

    $.fn.map.Driver.Google.prototype.setMapCenter = function(lat, lng){
        var position = new google.maps.LatLng(lat, lng);
        return this.map_container.map_layer.setCenter(position);
    };

    $.fn.map.Driver.Google.prototype.fitMapToMarkers = function(markers){
        if (markers.length == 0) return false;

        if(markers.length == 1)
            return this.setMapCenter(markers[0].position.lat(), markers[0].position.lng());

        var bounds = new google.maps.LatLngBounds();
        for(var i in markers)
            bounds.extend(markers[i].position);

        return this.map_container.map_layer.fitBounds(bounds);
    };

    // Google MarkerWrapper
    $.fn.map.Driver.Google.prototype.MarkerWrapper = function(marker){
        this.marker = marker;
        var that = this;

        this.getTitle = function(){
            return that.marker.title;
        };
    };
})(jQuery);