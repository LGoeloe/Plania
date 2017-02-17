// Creating a Data Object so it can be save in localStorage.
// Then when application is loaded, it will check if localStorage contains data object, otherwise create a new data object.
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')): {
  todo: [],
  completed: []
};
//function renderTodoList, runs at startup, to render a lists if localStorage contains data.
renderTodoList();

// focus on the input field
var focusOnInput = document.getElementById('item');
focusOnInput.focus();
// Adding a new Todo Item, by just pressing the Enter/Return key
focusOnInput.onkeyup = function (event){
  var value = document.getElementById('item').value;
  if (event.which == 13){
    addItemTodo(value); //Double function, global addItemTodo function would be better
    document.getElementById('item').value = "";

    data.todo.push(value);
    updateDataObject();
  }
};

//User clicked on the Add Button, is there an item on the Item Field? add Item to the  todo list
document.getElementById("addItem").addEventListener('click', function(){
  var value = document.getElementById('item').value;
  if (value){
    addItemTodo(value);
    document.getElementById('item').value = "";

    data.todo.push(value);
    updateDataObject();
  }
});

function renderTodoList(){
  // Check if data object contains data, otherwise close function and proceeds.
  if (!data.todo.length && !data.completed.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addItemTodo(value);
  }

  for (var j = 0; j < data.completed.length; j++) {
    var value = data.completed[j];
    addItemTodo(value, true);
  }

}


function updateDataObject(){
  localStorage.setItem('todoList', JSON.stringify(data));
}

function addItemTodo(text, completed){
  var list = (completed) ? document.getElementById('listDoneItems'):document.getElementById('listTodoItems');

  var item = document.createElement('li');
  item.innerText = text;

  // Create the remove and complete buttons
  var listButtons = document.createElement('div');
  listButtons.setAttribute("class","itemButtons");
  var deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fa fa-trash-o remove"></i>';
  deleteButton.onclick = deleteTodoItem;
  var completeButton = document.createElement('button');
  completeButton.innerHTML = '<i class="fa fa-circle-thin complete"></i>';
  completeButton.onclick = completeTodoItem;

  listButtons.appendChild(deleteButton);
  listButtons.appendChild(completeButton);
  item.appendChild(listButtons);
  list.insertBefore(item, list.childNodes[0]);

  updateStatus();
}

// Click event for removing list items
function deleteTodoItem(){
  var item = this.parentNode.parentNode;
  var list = item.parentNode;
  var id = item.id;
  var value = item.innerText;

  if (id ==='listTodoItems') {
    data.todo.splice(data.todo.indexOf(value),1);
  } else {
    data.completed.splice(data.completed.indexOf(value),1);
  }
  list.removeChild(item);
  updateStatus();
  updateDataObject();
}

// Click event for completing list items
function completeTodoItem(){
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;
  var doneList = document.getElementById('listDoneItems');
  var todoList = document.getElementById('listTodoItems');


  if (id ==='listTodoItems') {
    doneList.insertBefore(item, doneList.childNodes[0]);

    data.todo.splice(data.todo.indexOf(value),1);
    data.completed.push(value);
  } else {
    todoList.insertBefore(item, todoList.childNodes[0]);

    data.completed.splice(data.completed.indexOf(value),1);
    data.todo.push(value);
  }
  
  updateStatus();
  updateDataObject();
}

//Keeping track of how many Items are still unclompleted
function updateStatus() {
var todoStatus = document.getElementById('listDoneItems_counter');
var completedItems = document.getElementById('listDoneItems').childNodes.length;
var unCompletedItems = document.getElementById('listTodoItems').childNodes.length;
var totalItems = completedItems + unCompletedItems;

todoStatus.innerText = 'You completed ' + completedItems + ' out of ' + totalItems + ' tasks.';
}
