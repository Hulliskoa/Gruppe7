//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

const host = 'http://localhost:3000';
let colorBlindStylesheet = document.getElementsByClassName("colorblind");


function showAccess(){
  main[0].style.filter = "blur(10px)";

  let newItem = document.createElement("div");
  newItem.classList.add("popup-container");
  newItem.setAttribute("id", "popup");
  newItem.innerHTML = '<div class="popup-window">' +
                      '<div class="head-task-container">' +
                          '<div id="spacer"></div>' +
                          '<img onclick="exitTask()" src="img/close.png" class="popup-exit-button">'+
                        '</div>'+
                        '<div>'+
                        '<h2 class="dropdown-popup-title">Accessibility</h2>' + 
                        '</div>' +
                          '<div class="block-1">' +
                            '<h3>Font-size</h3>' + 
                            '<p>The font size of this page adjusts based on the font size set in your browser settings.</p>' +
                          '</div>' +
                          '<div class="block-2">' +
                            '<h3>Colorblind?</h3>' +
                            '<p>Click here for colorblind mode <button id="colorblind-button" value="Off" onclick="colorBlind(this)">OFF</button></p>' +
                          '</div>' +
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
  newItem.classList.add("popup-container");
  newItem.setAttribute("id", "popup");
  newItem.innerHTML = '<div class="popup-window">' + 
                        '<div class="head-task-container">' +
                          '<div id="spacer"></div>' +
                          '<img onclick="exitTask()" src="img/close.png" class="popup-exit-button">'+
                        '</div>'+ 
                        '<h2 class="dropdown-popup-title">User-Guide</h2>' +
                        '<div class="block-1">' +
                          '<h4>Projects</h4>' +
                          '<p>Her skal det stå hva som skjer på dashbordet</p>' +
                        '</div>' +
                        '<div class="block-2">' +
                          '<h4>Tasks</h4>' +
                          '<p>Her skal det stå om hva som skjer på mainsiden</p>' +
                        '</div>' +
                      '</div>';
  document.body.appendChild(newItem);
}


function colorBlind(buttonClicked){
  let onOff;
  if(buttonClicked.value == "on"){
      buttonClicked.setAttribute("value", "off");
      colorBlindStylesheet[0].disabled = false;
      document.getElementById("colorblind-button").innerHTML = "ON" 
  }else{
      buttonClicked.setAttribute("value", "on")
      colorBlindStylesheet[0].disabled = true;
      document.getElementById("colorblind-button").innerHTML = "OFF" 
  }

}

function exitTask(){
  
    main[0].style.filter = "blur(0)";
    let popup = document.getElementById("popup");
    popup.remove();
}
