//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

const host = 'http://localhost:3000';
let colorBlindStylesheet = document.getElementsByClassName("colorblind");


function showAccess(){
  main[0].style.filter = "blur(10px)";

  let newItem = document.createElement("div");
  newItem.setAttribute("class", "drop-popup");
  newItem.classList.add("drop-popup-container");
  newItem.innerHTML = '<div class="drop-popup-window">' +
                      '<div class="head-task-container">' +
                          '<div id="spacer"></div>' +
                          
                        '</div>'+ 
                        '<h2>Accessibility</h2>' + 
                        '<h3>Font-size</h3>' + 
                        '<p>Her skal det stå hvordan det fungerer med font-size</p>' +
                        '<h3>Colorblind?</h3>' +
                        '<p>Click here for colorblind mode <button id="colorblind-button" value="Off" onclick="colorBlind(this)">OFF</button></p>' +
                      '</div>';
  document.body.appendChild(newItem);
}

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

function showGuide(){
  main[0].style.filter = "blur(10px)";

  let newItem = document.createElement("div");
  newItem.classList.add("drop-popup-container");
  newItem.innerHTML = '<div class="drop-popup-window">' + 
                        '<div class="head-task-container">' +
                          '<div id="spacer"></div>' +
                          '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
                        '</div>'+ 
                        '<h2>User-Guide</h2>' +
                        '<h4>Projects</h4>' +
                        '<p>Her skal det stå hva som skjer på dashbordet</p>' +
                        '<h4>Tasks</h4>' +
                        '<p>Her skal det stå om hva som skjer på mainsiden</p>' +
                      '</div>';
  document.body.appendChild(newItem);
}


function colorBlind(buttonClicked){
  let onOff;
  if(buttonClicked.value == "on"){
      buttonClicked.setAttribute("value", "off");
      colorBlindStylesheet[0].disabled = false;
      onOff = "off";
      document.getElementById("colorblind-button").innerHTML = "ON" 
  }else{
      buttonClicked.setAttribute("value", "on")
      colorBlindStylesheet[0].disabled = true;
      onOff = "on";
      document.getElementById("colorblind-button").innerHTML = "OFF" 
  }
  fetch(host + '/colorblind?colorblind=' + onOff,{  
          method: 'POST'})
}
