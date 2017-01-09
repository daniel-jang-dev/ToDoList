 $(document).ready(function() {

// initialize Firebase
var config = {
  apiKey: "AIzaSyDNhz0HlHiQcYqLcGPMr-AVUcI4WfudFnY",
  authDomain: "todolist-danieljang.firebaseapp.com",
  databaseURL: "https://todolist-danieljang.firebaseio.com",
  storageBucket: "todolist-danieljang.appspot.com",
  messagingSenderId: "516378866767"
};
firebase.initializeApp(config);
var database = firebase.database();


// #1 Buttons

// 1.1 add a task

function addTask() {
	var newTask = $("#txtNewTask").val();
  newTask = $.trim(newTask);

  if (newTask != null && newTask != '') {
    var taskId = database.ref('tasks').push().key;
    writeTaskToDB(taskId, newTask);
    $("#txtNewTask").val('');
    $("#txtNewTask").focus();
  }
}

// 1.1a add a task my clicking button

$(".btn-add").on('click', function() {
  addTask();
});

// 1.1b add a task by enter key press

$("#txtNewTask").on('keyup', function (e) {
  if (e.keyCode == 13) {
    addTask();
  }
});

// 1.2 delete a task

$('body').on('click', '.btn-delete', function() {
  var taskId = $(this).parent().attr('class');
  deleteTaskInDB(taskId);
});

// 1.3 check a task to be "completed"

$('body').on('click', '.btn-complete', function() {
  var taskId = $(this).parent().attr('class');
  updateCompletedToDB(taskId);

  $("#currentTasks ." + taskId).remove();
  $('#allTasks .'+taskId).wrap("<s></s>");
});



// #2 DB CRUD

// 2.1 write a new task to DB

function writeTaskToDB(taskId, taskDesc) {
  database.ref('tasks/' + taskId).set({
    id: taskId,
    task: taskDesc,
    isCompleted: false
  });
}

// 2.2 update a task as 'completed' to DB

function updateCompletedToDB(taskId) {
	database.ref('tasks/' + taskId).update({"isCompleted": true});
}

// 2.3 delete a task in DB

function deleteTaskInDB(taskId) {
	database.ref('tasks/' + taskId).remove();
}

// #3. Event Listeners

// 3.1 child-added listener

database.ref('tasks').on('child_added', function(snapshot) {
	var id = snapshot.val().id;
	var task = snapshot.val().task;
	if(!(snapshot.val().isCompleted)) {
		$('#allTasks').append("<li class=" + id + "><button class='btn btn-delete'>"+
			"<img src='img/trash.png'></button> " + task + "</li>");
  	$('#currentTasks').append("<li class=" + id + "><button class='btn btn-complete'>"+
  		"<img src='img/checked.png'></button> <button class='btn btn-delete'>"+
  		"<img src='img/trash.png'></button> " + task + "</li>");
  } else {
  	$('#allTasks').append("<li class=" + id + "><button class='btn btn-delete'>"+
  		"<img src='img/trash.png'></button> <s>" + task + "</s></li>");
  }
});

// 3.2 child-removed listener

database.ref('tasks').on('child_removed', function(snapshot) {
	var id = snapshot.val().id;
  $("#currentTasks ." + id).remove();
  $("#allTasks ." + id).remove();
});

});