function post(formID) {
    // The rest of this code assumes you are not using a library.
      let form = document.getElementById(formID)
      document.body.style.cursor='wait'
    form.submit();
  }