
// fetch api https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
let main = document.getElementsByTagName("main");




function post(formID) {
      let form = document.getElementById(formID)
    form.submit();
}


async function editTask(task){
    //const colab = await fetch('http://localhost:3000/collaborators');
    //const selectedTask = await fetch('http://localhost:3000/getTask');
    //const colabResponsJSON = await response.json();
    //const selectedTaskJSON =  await response.json();

    const response = await fetch('http://localhost:3000/collaborators');
    const json = await response.json();
    let title = document.getElementById(task).getElementsByTagName('h4')[0].innerHTML
    let owner = document.getElementById(task).getElementsByTagName('h5')[0].innerHTML
    let category = document.getElementById(task).getElementsByTagName('h5')[1].innerHTML
    let description = document.getElementById(task).getElementsByTagName('p')[0].innerHTML
    let taskID = document.getElementById(task).id;
    
      main[0].style.filter = "blur(10px)";
      
      let newItem = document.createElement("div");
      newItem.setAttribute("id", "popup");
      newItem.classList.add("popup-container");
      newItem.innerHTML = '<div class="popup-window">'+
            '<div onclick="exitTask()" class="popup-exit-button">X</div>'+
            '<div class="popup-column">'+
            '<h2 id="popup-header">New task</h2>'+
            '<form id="editTask" action="/editTask" method="POST">'+

              '<div id="group1" class="input-box">'+ 
              '<input value='+taskID+' name="taskID" hidden>' +
                '<input type="text" name="taskName" required>'+
                '<span class="highlight"></span>'+
                '<span class="bar"></span>'+
                '<label>'+ title +'</label>'+
              '</div>'+
             '<div id="group2" class="input-dropdown">'+
               predefinedDropDown(json, owner) +
             '</div>'+
             '<div id="group3" class="input-dropdown">'+
                '<select id="category" name="category">'+
                    '<option value="" >Category</option>'+
                    '<option value="Front-end">Front-end</option>'+
                    '<option value="Back-end" =>Back-end</option>'+
                    '<option value="Design">Design</option>'+
                    '</select>'+
             '</div>'+
              '<div id="group4" class="input-multiline">'+
                '<textarea name="description" placeholder="Description">'+ description +'</textarea>'+
              '</div>'+
                '<div id="group5" class="group">'+
                '<button onclick="postAndExit(newTask)" id="new-repo-submit">Create task</button>'+
              '</div>'+
            '</form>'+
            '</div>';
      document.body.appendChild(newItem);
}



function changeStatus(task){
    let taskID = document.getElementById(task).id;
    //const response = await fetch('http://localhost:3000/changeStatus?taskID=' + taskID);    
}

async function createNewTask(task){
    
    const response = await fetch('http://localhost:3000/collaborators');
    const json = await response.json();
    let taskID = document.getElementById(task).id;

      main[0].style.filter = "blur(10px)";
      
      let newItem = document.createElement("div");
      newItem.setAttribute("id", "popup");
      newItem.classList.add("popup-container");
      newItem.innerHTML = '<div class="popup-window">'+
            '<div onclick="exitTask()" class="popup-exit-button">X</div>'+
            '<div class="popup-column">'+
            '<h2 id="popup-header">New task</h2>'+
            '<form id="newTask" action="/newTask" method="POST">'+
              '<div id="group1" class="input-box">'+ 
                '<input type="text" name="taskName" required>'+
                '<span class="highlight"></span>'+
                '<span class="bar"></span>'+
                '<label>Name</label>'+
              '</div>'+
             '<div id="group2" class="input-dropdown">'+
               createDropDown(json) +
             '</div>'+
             '<div id="group3" class="input-dropdown">'+
                '<select id="category" name="category">'+
                    '<option value="" >Category</option>'+
                    '<option value="Front-end">Front-end</option>'+
                    '<option value="Back-end" =>Back-end</option>'+
                    '<option value="Design">Design</option>'+
                    '</select>'+
             '</div>'+
              '<div id="group4" class="input-multiline">'+
                '<textarea name="description" placeholder="Description"></textarea>'+
              '</div>'+
                '<div id="group5" class="group">'+
                '<button onclick="postAndExit(newTask)" id="new-repo-submit">Create task</button>'+
              '</div>'+
            '</form>'+
            '</div>';
      document.body.appendChild(newItem);
};

function exitTask(){
    main[0].style.filter = "blur(0)";
    let popup = document.getElementById("popup");
    popup.remove();
};


function postAndExit(formID) {
      let form = document.getElementById(formID)
    form.submit();
    exitTask();
};

function predefinedDropDown(optionsArray, owner){
    let element = document.createElement("div")
    let select = document.createElement("select")
    let option = document.createElement("option")

    element.appendChild(select);
    select.name = "owner"
    option.textContent = "Task owner";
    option.value = ""
    select.appendChild(option)
    console.log(owner)

    for(let i = 0; i < optionsArray.length; i++){
      if(optionsArray[i] == owner ){
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



function createDropDown(optionsArray){
    let element = document.createElement("div")
    let select = document.createElement("select")
    let option = document.createElement("option")

    element.appendChild(select);
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




