
//Creating popup for creating a new repo
function createNewRepo(){	 	
    main[0].style.filter = "blur(10px)";
    let newItem = document.createElement("div");
    newItem.classList.add("popup-container");
    newItem.setAttribute("id", "popup");
    newItem.innerHTML = 
                      '<div class="popup-window">'+
                          '<div class="popup-head-container">' +
                              '<div class="popup-head-column popup-head-column-1"></div>' +
                              '<h2 class="popup-head-column popup-head-column-2">Create new GitHub repository</h2>'+
                              '<div class="popup-head-column popup-head-column-3">' +
                              '<img onclick="exitTask()" src="/img/close.png" class="popup-exit-button">'+
                          '</div>' +
                          '</div>'+
                          '<form id="new-repo-form1" class="new-repo-forms" onsubmit="disableButton()" action="/newRepo" method="POST">'+
                              '<div class="popup-input-container">'+ 
                                  '<input class="popup-input" type="text" name="repoName"  placeholder="Repository name (required)" required>'+
                              '</div>'+
                              '<div class="popup-description-container">'+
                                  '<textarea class="popup-description" name="description" placeholder="Description.." form="new-repo-form1"></textarea>'+
                                  '<div class="popup-checkbox-container">' +
                                      '<li>' +
                                         '<input class="popup-checkbox" type="checkbox" name="privateBool">' +
                                         'Private repository'+
                                      '</li>' +
                                      '<li>' +
                                          '<input class="popup-checkbox" type="checkbox" name="readme">' +
                                          'Create readme'+
                                      '</li>' +
                                    '</div>' +
                              '</div>'+
                              '<div class="popup-button-container">'+
                                  '<button id="submit-button" class="popup-button">Create repository</button>' +
                              '</div>'+        
                          '</form>'+
                      '</div>';
    document.body.appendChild(newItem);
}
  


