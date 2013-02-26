(function($){
    $.fn.map = function(driver_class, options) {
        var that = this;

        this.addMarker = function(options) {
            if (!that.map_layer) return false;

            var default_options = {
                options: {
                    map: that.map_layer
                }
            };
            var marker_options = $.extend(default_options, options.options);

            var marker = null;
            if (marker_options.hasOwnProperty('class_name')) {
                var class_name = marker_options['class_name'];
                marker = new window[class_name](marker_options);
            } else
                marker = this.driver.createMarker(marker_options);

            that.markers.push(marker);

            for (key in options.events)
                if (typeof(options.events[key]) == 'function')
                    this.driver.addEventListener(marker, key, options.events[key]);

            return marker;
        }

        this.findMarker = function(key) {
            if (!that.markers) return null;

            for (i in that.markers)
                if (that.markers[i].key == key)
                    return that.markers[i];

            return null;
        }

        this.clearMarkers = function() {
            if (!that.markers) return false;

            for (i in that.markers) {
                var marker = that.markers[i];
                this.driver.deleteMarker(marker);
            }

            that.markers = [];

            return true;
        }

        this.toggleMarkers = function(visible) {
            for (var i in that.markers)
                this.driver.toggleMarker(that.markers[i], visible);
        }

        this.fitToMarkers = function() {
            this.driver.fitMapToMarkers(that.markers);
        }

        this.addEventListener = function(event, handler) {
            if (that.eventListeners[event] == undefined)
                that.eventListeners[event] = []

            var handler = this.driver.addEventListener(that.map_layer, event, handler);
            that.event_listeners[event].push(handler);
        }

        this.geolocation = function(success, fail) {
            if (navigator.geolocation) {
                var options = {timeout: 10000, 'maximumAge': 60*5*1000, 'enableHighAccuracy': true};
                navigator.geolocation.getCurrentPosition(success, fail, options);
            } else
                fail();
        }

        // init map
        if (!this.map_layer) {
            obj = $(this).eq(0);

            options = options ? options : {}

            this.location = null;
            this.markers = [];
            this.eventListeners = {};

            that.driver = new $.fn.map.Driver[driver_class](that);
            that.map_layer = that.driver.createMap(obj.get(0), options.map);

            that.geolocation(function(position){
                that.driver.setMapCenter(position.coords.latitude, position.coords.longitude);
            });

            if (options.markers) {
                for(var key in options.markers)
                    that.addMarker(options.markers[key]);
            }

            that.fitToMarkers();

            // add map events
            for(var key in options.events) {
                if (typeof(options.events[key]) != 'function') continue;
                that.addEventListener(key, options.events[key]);
            }

            $(window).resize(function(){
                that.fitToMarkers();
            });
        }

        return this;
    };

    $.fn.map.Driver = function(container){
        this.map_container = container;
    };

    $.fn.map.Driver.prototype = {
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

    $.fn.map.Driver.Google = function(container){
        $.fn.map.Driver.call(this, container);

        try{
            google && google.maps
        }catch(e){
            throw "Load Google Maps API first"
        }

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
    };

    $.fn.map.Driver.Google.prototype = $.fn.map.Driver;

    // Google MarkerWrapper
    $.fn.map.Driver.Google.prototype.MarkerWrapper = function(marker){
        this.marker = marker;
        var that = this;

        this.getTitle = function(){
            return that.marker.title;
        };
    };

    $.fn.map.Driver.Leaflet = function(container){
        $.fn.map.Driver.call(this, container);

        try {
            L && L.map
        } catch(e) {
            throw new Error('Load Leaflet API first');
        }

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
    }

    $.fn.map.Driver.Leaflet.prototype = $.fn.map.Driver;

    // Leaflet MarkerWrapper
    $.fn.map.Driver.Leaflet.prototype.MarkerWrapper = function(marker){
        this.marker = marker;
        var that = this;

        this.getTitle = function(){
            return that.marker.options.title;
        };
    };
})(jQuery);