

// function for the select all checkbox on mainpage
function filterAll(masterCheckbox){
  let checkboxes  = document.getElementsByClassName("checkbox-filter")

  if(masterCheckbox.checked == true){
    for(let i = 0; i < checkboxes.length; i++){
      checkboxes[i].checked = true;
    }
  }else{
    for(let i = 0; i < checkboxes.length; i++){
      checkboxes[i].checked = false;
    }
  }
  filterCollaborators();
}
//filter for tasks based on collaborators
function filterCollaborators(){
  let numberOfCheckedBoxes = 0;
  let items = document.getElementsByClassName("item");
  let checkboxes  = document.getElementsByClassName("checkbox-filter")
  let masterCheckbox = document.getElementsByClassName("checkbox-filter-master")[0]

  for(let x = 0; x < checkboxes.length; x++){
    if(checkboxes[x].checked == true){
      numberOfCheckedBoxes++
      for(let i = 0; i < items.length; i++){
        if(items[i].getAttribute("value") == checkboxes[x].getAttribute('value')){
          console.log()
            items[i].style.display = "block";
          }else if(items[i].getAttribute("value") == "no-filter"){}
      }
    }else{
      for(let i = 0; i < items.length; i++){
        document.getElementsByClassName("checkbox-filter-master")[0].checked = false;
        if(items[i].getAttribute("value") == checkboxes[x].getAttribute('value')){
            items[i].style.display = "none";
          }else if(items[i].getAttribute("value") == "no-filter"){}
      }
    }
  }
  // check if all checkboxes are checked
    if(numberOfCheckedBoxes == checkboxes.length){
      masterCheckbox.checked = true;
    }
  
}


function post(formID) {
      let form = document.getElementById(formID).submit();
}

function postAndExit(formID) {
    document.getElementById(formID).submit();
    exitTask();
};

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
        newItem.innerHTML = 
            '<div class="popup-window">'+
                
                '<div class="head-task-container">' +
                  '<div id="spacer"></div>' +
                  '<img id="delete-task-button" onclick="confirmDeletion()" class="delete-icon" src="/img/delete.png">' +
                  '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
                '</div>'+
                 
                  '<h2 id="popup-header">Edit task</h2>'+
                    '<form id="edit-task" action="/editTask" onsubmit="submit-button.disabled" method="POST">'+
                      '<div id="group1" class="input-box">'+ 
                        '<input value='+taskID+' name="taskID" hidden>' +
                        '<input type="text" value="'+ title +'" name="taskName" required>'+
                        '<span class="highlight"></span>'+
                        '<span class="bar"></span>' +
                        '<label class="name-label">'+ title +'</label>'+
                      '</div>'+
                      '<div id="group2" class="input-dropdown">'+
                          predefinedDropDown(collaborators, owner, "owner", "Task owner") +
                      '</div>'+
                      '<div id="group3" class="input-dropdown">'+
                          predefinedDropDown(categoryArray, category , "category", "Category") +
                      '</div>'+
                      '<div id="group4" class="input-multiline">'+
                          '<textarea name="description" placeholder="Description">'+ description +'</textarea>'+
                           '<div class="duedate-group">' +
                              '<input placeholder="Due Date" value='+ date +' class="calendar-input" onfocusout="changeInputType(this)" onfocus="changeInputType(this)" name="dueDate" type="text">' +
                          '</div>'+
                      '</div>'+
                      '<div id="group5" class="group">'+
                          '<button onclick="postAndExit(edit-task)" id="new-repo-submit" name="submit-button">Submit changes</button>'+
                      '</div>'+
                    '</form>'+
                
            '</div>';

        document.body.appendChild(newItem);
        document.body.style.cursor="default";
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
      newItem.innerHTML = 
            '<div class="popup-window-task">'+
              '<div class="head-task-container">' +
                '<div id="spacer"></div>' +
                '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
              '</div>'+
              '<h2 id="popup-header">New task</h2>'+
              '<form class="task-form" id="newTask" action="/newTask" method="POST">'+
                '<div id="group1" class="input-box group">'+ 
                  '<input type="text" name="taskName" required>'+
                  '<span class="highlight"></span>'+
                  '<span class="bar"></span>'+
                  '<label class="name-label">Task name (required)</label>' +
                '</div>'+
                '<div id="group2" class="input-dropdown group">'+
                  createDropDown(json) +
                '</div>'+
                '<div id="group3" class="input-dropdown group">'+
                  '<select class="category select-task group" name="category">'+
                      '<option value="" >Category</option>'+
                      '<option value="Front-end">Front-end</option>'+
                      '<option value="Back-end">Back-end</option>'+
                      '<option value="Design">Design</option>'+
                    '</select>'+
                '</div>'+
                '<div id="group4" class="input-multiline group">'+
                  '<textarea name="description" placeholder="Description"></textarea>'+
                  '<div class="duedate-group">' +
                    '<input placeholder="Due Date" class="calendar-input" onfocusout="changeInputType(this)" onfocus="changeInputType(this)" name="dueDate" type="text">' +
                  '</div>'+
                '</div>'+
                '<div id="group5" class="group">'+
                  '<button onclick="postAndExit(newTask)" id="new-repo-submit">Create task</button>'+
                '</div>'+
              '</form>'+
            '</div>';

      document.body.appendChild(newItem);
};

function changeStatus(task){
    let taskID = document.getElementById(task).id;
  
};

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
      newItem.innerHTML = '<div class="popup-window">'+
            '<div class="popup-column">'+
              '<div class="head-task-container">' +
                '<div id="spacer"></div>' +
                '<img onclick="closeConfirmation()" src="/img/close.png" class="popup-exit-button">'+
              '</div>'+
              '<h2 id="popup-header">Delete task</h2>'+
                '<div id="group5" class="group">'+
                  '<button onclick="deleteTask()" id="new-repo-submit">Confirm deletion</button>'+
                '</div>'+
              '</form>'+
            '</div>';
      document.body.appendChild(newItem);
};

function closeConfirmation(){
  let confirmation = document.getElementById("popup-confirmation")
  confirmation.remove()
};

// function for creating a dropdown with the specific tasks information already selected
function predefinedDropDown(optionsArray, selectedValue, optionName, textContent){
    let element = document.createElement("div")
    let select = document.createElement("select")
    let option = document.createElement("option")
    
    
    select.setAttribute('class','select-task')
    element.appendChild(select);
    select.name = optionName;
    option.textContent = textContent;
    option.value = ""
    select.appendChild(option)
  

    for(let i = 0; i < optionsArray.length; i++){
        if(optionsArray[i] == selectedValue){
          option = document.createElement("option")
          option.textContent = optionsArray[i];
          option.value = optionsArray[i]
          option.setAttribute("selected", "true");
          select.appendChild(option)
        
        }else{
          option = document.createElement("option")
          option.textContent = optionsArray[i];
          option.value = optionsArray[i]
          select.appendChild(option)
        
        };
    }
    return element.innerHTML;
};

//function for creating a dropdown based on specified array
function createDropDown(optionsArray){
    let element = document.createElement("div")
    let select = document.createElement("select")
    let option = document.createElement("option")


    element.appendChild(select);
    select.setAttribute('class','select-task')
    select.name = "owner"
    option.setAttribute("disabled","true");
    option.setAttribute("selected", "true");
    option.textContent = "Task owner";
    option.value = ""
    select.appendChild(option)
 
    for(let i = 0; i < optionsArray.length; i++){
      option = document.createElement("option")
      option.textContent = optionsArray[i];
      option.value = optionsArray[i]
      select.appendChild(option)
    };

    return element.innerHTML;

};





// Drag and drop

let _doc = window.document;
let selectedElement,
  selectedTarget;


function dragStart(event)
{
    //event.preventDefault();
    selectedElement = event.currentTarget;
    
}

function dragEnd() {

  }

function dragOver()
{
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function dragEnter()
{
    event.preventDefault();
    event.currentTarget.appendChild(selectedElement);
}

function dragLeave()
{
}

function dragDrop()
{
    selectedTarget = event.currentTarget;
    selectedTarget.appendChild(selectedElement);
    let status = selectedTarget.id;
''    let taskID = selectedElement.id
    fetch(host + '/changeTaskStatus?taskID=' + taskID +'&status=' + status ,{method:"POST"})

    /*  Hvis vi vil styre hvor elementene havner
        
    if(selectedTarget == column1)
    {
        // Høyere [x] på childNotes = undefined
    selectedTarget.insertBefore(selectedElement, column1.childNodes[4]);
    }
    else if(selectedTarget == column2)
    {
        selectedTarget.insertBefore(selectedElement, column2.childNodes[4]);
    }
    else
    {
        selectedTarget.insertBefore(selectedElement, column3.childNodes[4]);
        console.log(column3.childNodes.length);
    }
    */

}
