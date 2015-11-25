requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../lib",
      "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "leaflet": "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet"
    }
});


requirejs(["app/main", 'jquery', 'leaflet'],
	function(app, $, L) {});
