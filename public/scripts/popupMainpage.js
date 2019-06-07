

// function for editing an existing task. async function so that response from server is resolved before the rest of the function continues
async function editTask(task){
    document.body.style.cursor="progress";
    const response = await fetch(host + '/collaborators'); // fetch api https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    let collaborators = await response.json();
    document.getElementById(task).setAttribute("class", "item popup-item")
    let title = document.getElementById(task).getElementsByTagName('h4')[0].innerHTML
    let owner = document.getElementById(task).getElementsByTagName('h5')[0].innerHTML
    let category = document.getElementById(task).getElementsByTagName('h5')[1].innerHTML
    let description = document.getElementById(task).getElementsByTagName('p')[0].innerHTML
    let date = document.getElementById(task).getElementsByTagName('p')[1].value
    let taskID = document.getElementById(task).id;
    let clickedElement = document.getElementById(task)
    let categoryArray = ["Front-end", "Back-end", "Design", "Other"];
    main[0].style.filter = "blur(10px)";

      //create new element within html document
        let newItem = document.createElement("div");
        newItem.setAttribute("id", "popup");
        newItem.setAttribute("value", taskID);
        newItem.classList.add("popup-container");
        newItem.innerHTML = '<div class="popup-window">'+
                              '<div class="popup-head-container">' +
                                '<div class="popup-head-column popup-head-column-1"></div>' +
                                '<h2 class="popup-head-column popup-head-column-2">Edit task</h2>' + 
                                '<div class="popup-head-column popup-head-column-3">' +
                                  '<img onclick="confirmDeletion()" src="/img/delete.png" class="popup-delete-button">'+
                                  '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
                                '</div>' +
                              '</div>' +
                              '<form id="edit-task" action="/editTask" onsubmit="submit-button.disabled" method="POST">'+
                                '<div class="popup-input-container">'+ 
                                  '<input value='+taskID+' name="taskID" hidden>' +
                                  '<input class="popup-input" type="text" value="'+ title +'" name="taskName" required>'+
                                '</div>'+
                                '<div class="popup-dropdown">'+
                                  predefinedDropDown(collaborators, owner, "owner", "Task owner") +
                                '</div>'+
                                '<div class="popup-dropdown">'+
                                  predefinedDropDown(categoryArray, category , "category", "Category") +
                                '</div>'+
                                '<div class="popup-description-container">'+
                                  '<textarea class="popup-description" name="description" placeholder="Description">'+ description +'</textarea>'+
                                  '<div class="popup-calendar-container">' +
                                    '<input class="popup-calendar" placeholder="Due Date" value='+ date +' onfocusout="changeInputType(this)" onfocus="changeInputType(this)" name="dueDate" type="text">' +
                                  '</div>'+
                                '</div>'+
                                '<div class="popup-button-container">'+
                                    '<button class="popup-button" onsubmit="myButton.disabled = true" onclick="postAndExit(edit-task)" name="submit-button">Submit changes</button>'+
                                '</div>'+
                              '</form>'+
                            '</div>';
        document.body.appendChild(newItem);
        document.body.style.cursor="default";
        colorOfButtons()
};

// function for creating a new task in the kanban board
async function createNewTask(task){
    //get request to server to get collaborators in repo within dropdown
    const response = await fetch(host + '/collaborators'); // fetch api https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const json = await response.json();

      main[0].style.filter = "blur(10px)";
      
      let newItem = document.createElement("div");
      newItem.setAttribute("id", "popup");
      newItem.classList.add("popup-container");
      newItem.innerHTML = '<div class="popup-window">'+
                            '<div class="popup-head-container">' +
                              '<div class="popup-head-column popup-head-column-1"></div>' +
                              '<h2 class="popup-head-column popup-head-column-2">New task</h2>' + 
                              '<div class="popup-head-column popup-head-column-3">' +
                                '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
                              '</div>' +
                            '</div>' +
                            '<form class="task-form" id="newTask" action="/newTask" onsubmit="disableButton()" method="POST">'+
                              '<div class="popup-input-container">'+ 
                                '<input class="popup-input" type="text" name="taskName" placeholder="Title (required)" required>'+
                              '</div>'+
                              '<div class="popup-dropdown">'+
                                createDropDown(json) +
                              '</div>'+
                              '<div class="popup-dropdown">'+
                                '<select class="category select-task" name="category">'+
                                    '<option value="" >Category</option>'+
                                    '<option value="Front-end">Front-end</option>'+
                                    '<option value="Back-end">Back-end</option>'+
                                    '<option value="Design">Design</option>'+
                                  '</select>'+
                              '</div>'+
                              '<div class="popup-description-container">'+
                                '<textarea class="popup-description" name="description" placeholder="Description"></textarea>'+
                                '<div class="popup-calendar-container">' +
                                  '<input class="popup-calendar" placeholder="Due Date" onfocusout="changeInputType(this)" onfocus="changeInputType(this)" name="dueDate" type="text">' +
                                '</div>'+
                              '</div>'+
                              '<div class="popup-button-container">'+
                                '<button id="submit-button" class="popup-button" onclick="postAndExit(newTask)">Create task</button>'+
                              '</div>'+
                            '</form>'+
                          '</div>';

      document.body.appendChild(newItem);
};

function disableButton(){
  let button = document.getElementById("submit-button")
  button.disabled = true;

}
//function for making the calendar inputbox better looking when not in focus
function changeInputType(element){
  if(element.type == 'date'){
    element.type = 'text'
  }else{
    element.type='date'
  } 
}

//function for sending a post request to server and delete specified task with taskID sendt as a parameter in the url
function deleteTask(){
  let selectedTask = document.getElementsByClassName("popup-item");
  let taskID = selectedTask[0].getAttribute('value');
  fetch(host + '/deleteTask?taskID=' + taskID, {  
          method: 'POST'});
    main[0].style.filter = "blur(0)";
    let popup = document.getElementById("popup");
    popup.remove();
    let item = document.getElementsByClassName("popup-item")
    let confirmation = document.getElementById("popup-confirmation")
    item[0].remove();
    confirmation.remove()
};

function confirmDeletion(){
      let newItem = document.createElement("div");
      let selectedTask = document.getElementsByClassName("popup-item");
      newItem.setAttribute("id", "popup-confirmation");
      newItem.classList.add("popup-container");
      newItem.innerHTML = '<div class="popup-window popup-window-delete">'+
                            '<div class="popup-head-container">' +
                              '<div class="popup-head-column popup-head-column-1"></div>' +
                              '<h2 class="popup-head-column popup-head-column-2">Delete task</h2>' + 
                              '<div class="popup-head-column popup-head-column-3"></div>' +
                            '</div>' +
                            '<div class="popup-button-delete-container">'+
                              '<button class="popup-button popup-button-delete yes" onclick="deleteTask()">Delete</button>'+
                              '<button class="popup-button popup-button-delete no" onclick="closeConfirmation()">Keep</button>'+
                            '</div>'+
                          '</div>';
      document.body.appendChild(newItem);
};

function closeConfirmation(){
  let confirmation = document.getElementById("popup-confirmation")
  confirmation.remove()
};

function postAndExit(formID) {
   
    document.getElementById(formID).submit();
    exitTask();
};