//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

const animateOctocat = function (){
	let octocat = document.getElementById("octocat");
	octocat.addClass = "octoAnimation"
}


function post(formID) {
  // The rest of this code assumes you are not using a library.
	let form = document.getElementById(formID)
  form.submit();
}

function createNewTask()
{
	let newItem = document.createElement("div");
	newItem.classList.add("popup-container");
	newItem.setAttribute("id", "popup");
	newItem.innerHTML = '<div class="popup-window"><div class="form-container">'+
	'<h2>Ny oppgave</h2>'+
	'<form><div id="group1" class="input-box"><input type="text" required>'+
	'<span class="highlight"></span><span class="bar"></span>'+
	'<label>Name</label></div><div id="group2" class="input-box">'+
	'<input type="text" required><span class="highlight"></span>'+
	'<span class="bar"></span>'+
	'<label>Email</label>'+
	'</div></form></div>'+
	'<div onclick="exitTask()">Exit new task</div>';
	document.body.appendChild(newItem);
}

function exitTask(){
let popup = document.getElementById("popup");
	popup.parentNode.removeChild(popup);
}