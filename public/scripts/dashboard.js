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
      newItem.innerHTML = 
      '<div class="popup-window-repo">'+
               '<div class="head-task-container">' +
                  '<div id="spacer"></div>' +
                  '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
                '</div>'+
            '<h2 id="popup-header">Create new GitHub repository</h2>'+
            '<form id="new-repo-form1" class="new-repo-forms" onsubmit="submit-button.disabled" action="/newRepo" method="POST">'+
              '<div id="group1" class="input-box group">'+ 
                '<input type="text" name="repoName"  placeholder="Repository name.. (required)" required>'+
              '</div>'+
              '<div id="description-area" class="group">'+
                '<textarea name="description" placeholder="Description.." form="new-repo-form1"></textarea>'+
                '<div class="checkboxes-new-repo">' +
                  '<li>' +
                  '<input class="group" id="new-repo-checkbox" type="checkbox" name="privateBool">' +
                  'Private repository'+
                  '</li>' +
                  '<li>' +
                  '<input class="group" id="new-repo-checkbox" type="checkbox" name="readme">' +
                  'Create readme'+
                  '</li>' +
                '</div>' +
              '</div>'+
              '<div id="group4" class="group">'+
                '<button id="new-repo-submit" name="submit-button">Create repository</button>' +
              '</div>'+        
            '</form>'+
          '</div>';
      document.body.appendChild(newItem);
  }
  


