
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