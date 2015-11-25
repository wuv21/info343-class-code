/*
    app.js
    main script file for this mapping application
    source data URL: https://data.seattle.gov/resource/65fc-btcc.json
*/

define(['jquery', 'leaflet'], function($, L) {
    $(function() {
        'use strict';

        var map;

        // Creates map with given location and zoom over Seattle. Uses Mapbox tiles.
        function createMap(loc, zoom) {
            map = L.map('map').setView(loc, zoom);

            var mapboxAPIKey = "pk.eyJ1Ijoid3V2MjEiLCJhIjoiY2lmdWdqcnUwMXltd3V3a3JnZHR4MDBtOSJ9.P0ar76FThsSxChzIa3xdQQ";
            var mapboxAttribution = "&copy; <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>" +
                                    '<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></div>' +
                                    "<div>Additional icons provided by <a href='http://glyphicons.com/'>Glyphicons</a>";

            var mapTileURL = "https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=" + mapboxAPIKey;

            L.tileLayer(mapTileURL, {
                attribution: mapboxAttribution
            }).addTo(map);
        }

        // gets JSON file and loads camera markers on the map. Dynamically adjusts map bounds to fit all camera markers.
        // Cameras from SDOT are blue circles while cameras from WSDOT are red circles. Camera counts are also started.
        var allCameras = [];
        function getTrafficJSON() {
            $.getJSON("https://data.seattle.gov/resource/65fc-btcc.json", function(file) {
                var SDOTcount = 0;
                var WSDOTcount = 0;
                var allLocations = []
                file.forEach(function(cam) {
                    var cameraLocation = [cam.ypos, cam.xpos];
                    var marker = L.circleMarker(cameraLocation);
                    allLocations.push(cameraLocation);
                    marker.setRadius(7);

                    if (cam.ownershipcd === "SDOT") {
                        marker.setStyle({color: '#00F'});
                        SDOTcount++;
                    } else {
                        marker.setStyle({color: '#F00'});
                        WSDOTcount++;
                    }

                    marker.bindPopup(popupContent(cam),{"className": "popup-img"});
                    marker.addTo(map);
                    allCameras.push(marker);
                });
                updateCamCount({SDOTcount:SDOTcount, WSDOTcount:WSDOTcount});
                map.fitBounds(allLocations);
            });
        }

        // Returns the content HTML for a marker popup to display the given camera location and image.
        function popupContent(cam) {
            var contentHTML = "<h2>" + cam.cameralabel + "</h2> " + "<img src='" + cam.imageurl.url + "'>";

            return contentHTML;
        }

        // Can be used to manually give SDOT and WSDOT camera counts or can calculate the camera counts from an array of
        // marker points. Updates the console on index.html.
        function updateCamCount(args) {
            var SDOTcount = args.SDOTcount || 0;
            var WSDOTcount = args.WSDOTcount || 0;
            var cameras = args.cameras || null;

            if (cameras) {
                cameras.forEach(function(cam) {
                    if (cam.options.color === "#00F") {
                        SDOTcount++;
                    } else {
                        WSDOTcount++;
                    }
                })
            }
            $('#SDOT-cams').text(SDOTcount);
            $('#WSDOT-cams').text(WSDOTcount);
        }

        // Toggle console hiding on index.html
        $('#hideConsole').click(function() {
            $('#console-content').toggle();
            $(this).toggleClass("glyphicon glyphicon-menu-up glyphicon glyphicon-menu-down");
        });

        // Triggered by user typing in filter box which filters any cameras that contain the inputted text.
        // Camera counts will also be updated on index.html.
        $('#loc-filter').keyup(function() {
            var filter = $('#loc-filter').val().toLowerCase();
            var filteredCameras = allCameras.filter(function(cam) {
                var pattern = /\<h2\>(.*)\<\/h2\>/;
                return cam._popup._content.toLowerCase().match(pattern)[1].indexOf(filter) >= 0;
            });

            allCameras.forEach(function(cam) {
                map.removeLayer(cam);
            });

            filteredCameras.forEach(function(cam) {
                map.addLayer(cam);
            });

            updateCamCount({cameras: filteredCameras});
        });

        createMap([47.6097, -122.3331], 11);
        getTrafficJSON();
    });
});