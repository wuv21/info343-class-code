/*
    script for the index.html page
    dependencies: jquery

    open weather API: 
    http://api.openweathermap.org/data/2.5/weather?zip=98195,us&units=imperial&appid=bd82977b86bf27fb59a04b61b657fb6f
*/

$(function() {
    'use strict';

    $('a').attr('target', '_blank');
    $('article').hide().fadeIn(500);

    $('#toggle-article').click(function() {
       $('article').fadeToggle();
    });

    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?zip=98195,us&units=imperial&appid=bd82977b86bf27fb59a04b61b657fb6f";
    $.getJSON(weatherUrl).then(function(data) {
        $('#temp').text(Math.round(data['main']['temp']));
    });
});

