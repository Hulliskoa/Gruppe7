
let main = document.getElementsByTagName("main");
//let colabDropDownArray = await httpGetAsync('http://localhost:3000/collaborators', dataCallback)


function post(formID) {
      let form = document.getElementById(formID)
    form.submit();
  }
  
  function createNewTask()
  {
     
      



      main[0].style.filter = "blur(10px)";
      
      let newItem = document.createElement("div");
      newItem.setAttribute("id", "popup");
      newItem.classList.add("popup-container");
      newItem.innerHTML = '<div class="popup-window">'+
            '<div onclick="exitTask()" class="popup-exit-button">X</div>'+
            '<div class="popup-column">'+
            '<h2 id="popup-header">Ny oppgave</h2>'+
            '<form>'+
              '<div id="group1" class="input-box">'+ 
                '<input type="text" required>'+
                '<span class="highlight"></span>'+
                '<span class="bar"></span>'+
                '<label>Name</label>'+
              '</div>'+
             '<div id="group2" class="input-dropdown">'+
              /* createDropDown(colabDropDownArray) +*/
             '</div>'+
             '<div id="group3" class="input-dropdown">'+
                '<select id="category" name="category">'+
                    '<option >Category</option>'+
                    '<option >HTML</option>'+
                    '<option >.js</option>'+
                    '<option >JAVA</option>'+
                    '<option >CSS</option>'+
                    '</select>'+
             '</div>'+
              '<div id="group4" class="input-multiline">'+
                '<textarea name="message" placeholder="Beskrivelse"></textarea>'+
              '</div>'+
            '</form>'+
            '</div>';
      document.body.appendChild(newItem);
  }


  function exitTask(){
    main[0].style.filter = "blur(0)";
    let popup = document.getElementById("popup");
    popup.remove();
}
/*

function createDropDown(optionsArray){
  let select = document.createElement("select")
    for(let i = 0; i < optionsArray.length; i++){
      let option = document.createElement("option")
      option.textContent = optionsArray[i];
      option.value = optionsArray[i]
      select.appendChild(option)
    };

};
//ajax request to nodejs server to get collaborators refrence https://medium.com/front-end-weekly/ajax-async-callback-promise-e98f8074ebd7
async function httpGetAsync(theUrl, callback)
{
  return new Promise(() => (
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}))

function dataCallback(data){
  return data;
}
*/