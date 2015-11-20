
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    navigator.getUserMedia = navigator.getUserMedia
                            || navigator.webkitGetUserMedia
                            || navigator.mozGetUserMedia
                            || navigator.msGetUserMedia;

    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var snapshot = document.querySelector('img');
    var ctx = canvas.getContext('2d');
    var videoStream;

    navigator.getUserMedia({video: true}, function(stream) {
        videoStream = stream;
        video.src = window.URL.createObjectURL(stream);
        console.log(stream);

    }, function(err) {
        console.error(err);
    });

    video.addEventListener('click', function() {
       if (videoStream) {
           canvas.width = video.clientWidth;
           canvas.height = video.clientHeight;
           ctx.drawImage(video, 0, 0);
       }
    });

    var input = document.getElementById('line-color-inp');
    var undoBtn = document.getElementById('undo-btn');
    var mouseDown = false;

    canvas.addEventListener('mousedown', function(evt) {
        ctx.beginPath();
        ctx.lineWidth = 50;
        ctx.moveTo(evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop + window.scrollY);
        mouseDown = true;
    });

    canvas.addEventListener('mousemove', function(evt) {
        if (mouseDown === true) {
            ctx.lineTo(evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop + window.scrollY);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function(evt) {
        ctx.lineTo(evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop + window.scrollY);
        ctx.stroke();
        mouseDown = false;

        saveState();
    });

    var state;
    function saveState() {
        state = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(state);
    }

    input.addEventListener('change', function(evt) {
        ctx.strokeStyle = input.value;
        ctx.save();
    });

    function undo() {
        ctx.drawImage(state, 0, 0);
        console.log('undone');
    }

    undoBtn.addEventListener('click', undo);

    document.querySelector('#btn-snapshot').addEventListener('click', function() {
        snapshot.src = canvas.toDataURL();
    });
});

