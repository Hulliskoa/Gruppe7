

function post(formID) {
    // The rest of this code assumes you are not using a library.
      let form = document.getElementById(formID)
    form.submit();
  }
  
  function createNewTask()
  {
      let newItem = document.createElement("div");
      newItem.classList.add("popup-container");
      newItem.innerHTML = '<div class="popup-window">'+
            '<div class="popup-exit-button">X</div>'+
            '<div class="popup-column">'+
            '<h2 id="popup-header">Ny oppgave</h2>'+
            '<form>'+
              '<div id="group1" class="input-box">'+ 
                '<input type="text" required>'+
                '<span class="highlight"></span>'+
                '<span class="bar"></span>'+
                '<label>Name</label>'+
              '</div>'+
             '<div id="group2" class="input-dropdown">'+
              '<select id="owner" name="owner">'+
                '<option >Owner</option>'+
                '<option >Richard</option>'+
                '<option >Petter</option>'+
                '<option >Anders</option>'+
                '</select>'+
             '</div>'+
             '<div id="group3" class="input-dropdown">'+
                '<select id="category" name="category">'+
                    '<option >Category</option>'+
                    '<option >HTML</option>'+
                    '<option >.js</option>'+
                    '<option >JAVA</option>'+
                    '<option >CSS</option>'+
                    '</select>'+
             '</div>'+
              '<div id="group4" class="input-multiline">'+
                '<textarea name="message" placeholder="Beskrivelse"></textarea>'+
              '</div>'+
            '</form>'+
            '</div>';
      document.body.appendChild(newItem);
  }
  
  function exitTask(){
  let popup = document.getElementById("popup");
  popup.parentNode.removeChild(popup);
  }
  
  
  // Anonymous function. Always provoked 
  /*
  (function (){
    
        createNewTask();    
  })();
  */