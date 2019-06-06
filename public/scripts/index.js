//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
let main = document.getElementsByTagName("main");
const host = 'http://localhost:3000';
let colorBlindStylesheet = document.getElementsByClassName("colorblind");
let exitButtonSrc;
let deleteButtonSrc;
let colorBlindButtonValue;
let colorBlindButtonText;

function linkGitHub(url){
  window.open(url, "_blank");
}

function signOut(){
	window.location.href = '/';
}

function post(formID) {
    // The rest of this code assumes you are not using a library.
      let form = document.getElementById(formID)
    form.submit();
}
function colorOfButtons(){
  if(colorBlindStylesheet[0].disabled == true){
  
     exitButtonSrc = "/img/close.png"
    deleteButtonSrc = "/img/delete.png"
    colorBlindButtonValue = "on"
    colorBlindButtonText = "Turn high contrast on";

  }else{
    console.log(colorBlindStylesheet[0].disabled)
     exitButtonSrc = "/img/close-colorblind.png";
    deleteButtonSrc = "/img/delete-colorblind.png";
    colorBlindButtonValue = "on";
    colorBlindButtonText = "Turn high contrast off"; 
}
}

function showAccess(){
  main[0].style.filter = "blur(10px)";
  let newItem = document.createElement("div");
  newItem.classList.add("popup-container");
  newItem.setAttribute("id", "popup");
  newItem.innerHTML = '<div class="popup-window">' +
                      '<div class="popup-head-container">' +
                        '<div class="popup-head-column popup-head-column-1"></div>' +
                        '<h2 class="popup-head-column popup-head-column-2">Accessibility</h2>' + 
                        '<div class="popup-head-column popup-head-column-3">' +
                          '<img onclick="exitTask()" src='+exitButtonSrc+' class="popup-exit-button">'+
                        '</div>' +
                      '</div>'+
                      '<div class="popup-content">' +
                        '<h3>Font-size</h3>' + 
                        '<p>The font size of this page adjusts based on the font size set in your browser settings.</p>' +
                        '<h3>Colorblind?</h3>' +
                        '<p>Click here for colorblind mode <button id="colorblind-button" value='+ colorBlindButtonValue +' onclick="colorBlind(this)">'+ colorBlindButtonText +'</button></p>' +
                      '</div>';
  document.body.appendChild(newItem);
}

function showGuide(){
  main[0].style.filter = "blur(10px)";

  let newItem = document.createElement("div");
  newItem.classList.add("popup-container");
  newItem.setAttribute("id", "popup");
  newItem.innerHTML = '<div class="popup-window">' + 
                        '<div class="popup-head-container">' +
                          '<div class="popup-head-column popup-head-column-1"></div>' +
                          '<h2 class="popup-head-column popup-head-column-2">User-Guide</h2>' + 
                          '<div class="popup-head-column popup-head-column-3">' +
                            '<img onclick="exitTask()" src='+exitButtonSrc+' class="popup-exit-button">'+
                          '</div>' +
                        '</div>'+
                      '<div class="popup-content">' +
                        '<h3>Projects</h3>' + 
                        '<p>The project site is representing every repository you hav eon GitHub</p>' +
                        '<h3>Tasks</h3>' +
                        '<p>The Task site represents all the tasks in your repository. Its represented in a KanBan style with three columns</p>' +
                      '</div>';
  document.body.appendChild(newItem);
}


//Enables and disables the colorblind stylesheet
function colorBlind(buttonClicked){
  let onOff;
  if(buttonClicked.value == "on"){
      document.getElementById("colorblind-button").setAttribute("value", "off")
      colorBlindStylesheet[0].disabled = true;
      document.getElementById("colorblind-button").innerHTML = "Turn high contrast on" 
     colorblindPost("disabled")
  }else{
    document.getElementById("colorblind-button").setAttribute("value", "on")
      colorBlindStylesheet[0].disabled = false;
      document.getElementById("colorblind-button").innerHTML = "Turn high contrast off" 
      colorblindPost("")
 }
}

async function colorblindPost(query){
  await fetch(host + "/colorblind?colorblind=" + query, {
        method: "POST"})
};

//function for exiting popups
function exitTask(){
    main[0].style.filter = "blur(0)";
    let popup = document.getElementById("popup");
    popup.remove();
}
