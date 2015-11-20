/* script for the notifications demo page */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    function askPermission() {
        Notification.requestPermission(function(result) {
            if ('granted' === result) {
                showNotification('Thanks!', 'You will now see my notifications');
            }
        });
    }

    function showNotification(title, body) {
        var note = new Notification(title, {body: body, icon: 'img/notification.png'});

        function dismissAlert() {
            note.close();
        }

        window.setTimeout(note.close.bind(note), 1000);
    }

    var triggerBtn = document.getElementById('trigger');
    triggerBtn.addEventListener('click', function() {
        switch (Notification.permission) {
            case 'granted':
                showNotification('Hello', 'triggered at ' + new Date().toLocaleDateString());
                break;
            case 'denied':
                alert('Uh oh...');
                break;
            default:
                askPermission();
        }
    });


});
