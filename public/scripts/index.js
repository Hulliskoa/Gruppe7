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

function createNewTask(){
let popup = document.getElementById("popup");
popup.style.visibility = 'visible';

}

function exitTask(){
let popup = document.getElementById("popup");
popup.style.visibility = 'visible';
}