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
//Function for changing the value of the colorblind-button
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
    newItem.innerHTML = '<div class="popup-window popup-window-access">' +
                        '<div class="popup-head-container">' +
                          '<div class="popup-head-column popup-head-column-1"></div>' +
                          '<h2 class="popup-head-column popup-head-column-2">Accessibility</h2>' + 
                          '<div class="popup-head-column popup-head-column-3">' +
                            '<img onclick="exitTask()" src="img/close.png" class="popup-exit-button">'+
                          '</div>' +
                        '</div>'+
                        '<div class="popup-content">' +
                          '<h3>Font-size</h3>' + 
                          '<p>This page uses your browser settings to set the font-size.<br>If you want a large font size please go to your browser settings, find  font-size and increase it</p>' +
                          '<h3>Colorblind?</h3>' +
                          '<p id="colorblind-text">Colorblind or in need of more contrats?<br>This button will change the color scheme of the website to high contrast. Making it easier to differentiate between different objects on the site</p>' +
                          '<button id="colorblind-button" value='+ colorBlindButtonValue +' onclick="colorBlind(this)">'+ colorBlindButtonText +'</button>' +
                        '</div>';
    document.body.appendChild(newItem);
}
// creates user-guide popup when link in dropdown is clicked
function showGuide(){
    main[0].style.filter = "blur(10px)";

    let newItem = document.createElement("div");
    newItem.classList.add("popup-container");
    newItem.setAttribute("id", "popup");
    newItem.innerHTML = '<div class="popup-window popup-window-guide">' + 
                          '<div class="popup-head-container">' +
                            '<div class="popup-head-column popup-head-column-1"></div>' +
                            '<h2 class="popup-head-column popup-head-column-2">User-Guide</h2>' + 
                            '<div class="popup-head-column popup-head-column-3">' +
                              '<img onclick="exitTask()" src="img/close.png" class="popup-exit-button">'+
                            '</div>' +
                          '</div>'+
                        '<div class="popup-content">' +
                          '<h3>Projects</h3>' + 
                          '<p>The project-page is representing every repository you have on GitHub.<br><br>' +
                            'The plus-sign will add a new repository to GitHub.<br><br>' +
                            'If you want to go to your GitHub profile you can hover over your profile-picture and click on the top link.<br><br>' +
                            'By clicking on one of the repositories you are taken to the Task-page.' + 
                          '</p>' +
                          '<h3>Tasks</h3>' +
                          '<p>The Task-page represents all the tasks in one of your repositories.<br><br>' +
                            'Here you can add, move or delete your tasks as you wish.<br><br>' +
                            'You can also filter out the tasks by name in the controlpanel on the right.<br><br>' +
                            'In the controlpanel you also have the opportunity to see language documentation from MDN,<br><br>' + 
                            'and your repository´s latest commits.' +
                          '</p>' +
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
