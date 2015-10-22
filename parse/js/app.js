/*
    script for the index.html file
*/
Parse.initialize("cKWO0k4diyiFfz4Y2dXLzrYwj71RXTjMdfG4xkKX", "m1d1fK0LPw8I3zP1WBoeUVWY61i6U0AEoKk2emd0");

$(function() {
    'use strict';

    // new Task class
    var Task = Parse.Object.extend('Task');

    // new query that will return all tasks ordered by createAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');
    tasksQuery.notEqualTo('done', true);

    // reference to the task list element
    var tasksList = $('#tasks-list');

    // references to the error message alert
    var errorMessage = $('#error-message');

    // references to the rating
    var ratingElem = $('#rating');

    // current set of tasks
    var tasks = [];

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function showSpinner() {
        $('.fa-spin').show();
    }

    function hideSpinner() {
        $('.fa-spin').hide();
    }

    function clearError() {
        errorMessage.hide();
    }

    function fetchTasks() {
        showSpinner();
        tasksQuery.find().then(onData, displayError).always(hideSpinner);
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
           var li = $(document
               .createElement('li'))
               .text(task.get('title'))
               .addClass(task.get('done') ? 'completed-task' : '')
               .appendTo(tasksList)
               .click(function() {
                   task.set('done', !task.get('done'));
                   task.save().then(renderTasks, displayError)
               });

           $(document.createElement('span'))
               .raty({readOnly: true,
                   score: (task.get('rating') || 0),
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']})
               .appendTo(li);
        });
    };

    // when the user submits the new task frm
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault();

        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.set('rating', ratingElem.raty('score'));

        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
            ratingElem.raty('set', {});
        });

        return false;
    });

    ratingElem.raty();

    fetchTasks();

    window.setInterval(fetchTasks, 10000);
});