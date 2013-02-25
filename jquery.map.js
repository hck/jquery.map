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

            //this.driver = new $.fn.map.Driver[driver_class](this);
            //this.map_layer = this.driver.createMap(obj.get(0), options.map);

            $.getScript((options['drivers_url'] || 'drivers') + '/' + driver_class.toLowerCase() + '.js', function(){
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
})(jQuery);