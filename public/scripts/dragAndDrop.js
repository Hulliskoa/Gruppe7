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
    let taskID = selectedElement.id
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
