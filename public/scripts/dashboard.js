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
            '<form id="new-repo-form1" class="new-repo-forms" action="/newRepo" method="POST">'+
              '<div id="group1" class="input-box group">'+ 
                '<input type="text" name="repoName"  placeholder="Repository name.." required>'+
              '</div>'+
              '<div id="group3" class="group">'+
                '<textarea name="description" placeholder="Description.." form="new-repo-form1"></textarea>'+
                ' <input class="group" id="new-repo-checkbox" type="checkbox" name="privateBool">Private repository</input>' +
              '</div>'+
              '<div id="group4" class="group">'+
                '<button id="new-repo-submit">Create repository</button>' +
              '</div>'+        
            '</form>'+
            '</div>';
      document.body.appendChild(newItem);
  }
  


