function Driver(container){
    this.map_container = container;
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