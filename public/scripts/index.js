//This file is used on all sites

let main = document.getElementsByTagName("main");
const host = 'http://localhost:3000';
let colorBlindStylesheet = document.getElementsByClassName("colorblind");
let exitButtonSrc;
let deleteButtonSrc;
let colorBlindButtonValue;
let colorBlindButtonText;

//function for opening users github profile in a new tab when clicking on the link in the dropdown menu
function linkGitHub(url){
  window.open(url, "_blank");
}
//prototype signout
function signOut(){
	window.location.href = '/';
}
//function for posting form to server
function post(formID) {
      let form = document.getElementById(formID)
      form.submit();
}
function colorOfButtons(){
    if(colorBlindStylesheet[0].disabled == true){
     
        colorBlindButtonValue = "off"
        colorBlindButtonText = "Turn high contrast on";

    }else{

        colorBlindButtonValue = "on";
        colorBlindButtonText = "Turn high contrast off"; 
    }
}
// creates user-guide popup when link in dropdown is clicked
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
                            '<img onclick="exitTask()" src="img/close.png" class="popup-exit-button">'+
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
// creates user-guide popup when link in dropdown is clicked
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


//Enables and disables the colorblind stylesheets
function colorBlind(buttonClicked){
      let colorButton = document.getElementById("colorblind-button")
      let exitButton = document.getElementsByClassName("popup-exit-button")
  if(buttonClicked.value == "on"){
      colorButton.setAttribute("value", "off")
      colorBlindStylesheet[0].disabled = true;
      document.getElementById("colorblind-button").innerHTML = "Turn high contrast on" 
      saveColorblindState("disabled")
  }else{
      colorButton.setAttribute("value", "on")
      colorBlindStylesheet[0].disabled = false;
      document.getElementById("colorblind-button").innerHTML = "Turn high contrast off" 
      saveColorblindState("")
 }
}
//saves the state of colorblind mode on/off to server
async function saveColorblindState(query){
    await fetch(host + "/colorblind?colorblind=" + query)
};

//function for exiting popups
function exitTask(){
    main[0].style.filter = "blur(0)";
    let popup = document.getElementById("popup");
    popup.remove();
}
