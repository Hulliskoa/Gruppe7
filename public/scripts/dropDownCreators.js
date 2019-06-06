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