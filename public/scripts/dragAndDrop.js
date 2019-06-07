// Drag and drop

let _doc = window.document;
let selectedElement,
  selectedTarget;

function dragStart(event){
    //event.preventDefault();
    selectedElement = event.currentTarget;  
}

function dragEnd(){

}

function dragOver(){
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function dragEnter(){
    event.preventDefault();
    event.currentTarget.appendChild(selectedElement);
}

function dragLeave(){
}

function dragDrop(){
    selectedTarget = event.currentTarget;
    selectedTarget.appendChild(selectedElement);
    let status = selectedTarget.id;
    let taskID = selectedElement.id
    fetch(host + '/changeTaskStatus?taskID=' + taskID +'&status=' + status ,{method:"POST"})

}
