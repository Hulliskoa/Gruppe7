//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB


const dbTest = document.getElementById("dbTest");


dbTest.addEventListener("click", checkDB);


function checkDB(){
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}else{

var request = window.indexedDB.open("UserInfo", 3);

request.onerror = function(event) {
  // Do something with request.errorCode!
  alert(error)
};
request.onsuccess = function(event) {
  // Do something with request.result!
   alert(request.result)
};


}
}