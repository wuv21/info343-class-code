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

    // reference to the task list element
    var tasksList = $('#tasks-list');

    // references to the error message alert
    var errorMessage = $('#error-message');

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
           $(document.createElement('li')).text(task.get('title')).appendTo(tasksList);
        });
    };

    // when the user submits the new task frm
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault();

        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
        });

        return false;
    });

    fetchTasks();
});