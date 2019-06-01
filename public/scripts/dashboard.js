let main = document.getElementsByTagName("main");

function post(formID) {
    // The rest of this code assumes you are not using a library.
      let form = document.getElementById(formID)
    form.submit();
  }


  function createNewRepo()
  {	
  	
    	main[0].style.filter = "blur(10px)";
      let newItem = document.createElement("div");
      newItem.classList.add("popup-container");
      newItem.setAttribute("id", "popup");
      newItem.innerHTML = '<div class="popup-window">'+
            '<div onclick="exitTask()" class="popup-exit-button">X</div>'+
            '<div class="popup-column">'+
            '<h2 id="popup-header">Create new GitHub repository</h2>'+
            '<form action="/newRepo" method="POST">'+
              '<div id="group1" class="input-box">'+ 
                '<input type="text" required>'+
                '<span class="highlight"></span>'+
                '<span class="bar"></span>'+
                '<label>Repository name</label>'+
              '</div>'+
              '<div id="group4" class="input-multiline">'+
                '<textarea name="message" placeholder="Repository description"></textarea>'+
              '</div>'+
              '<button id="newRepoSubmit">Create</button>'
            '</form>'+
            '</div>';
      document.body.appendChild(newItem);
  }
  
function exitTask(){
	
  	main[0].style.filter = "blur(0)";
  	let popup = document.getElementById("popup");
  	popup.remove();
}
  