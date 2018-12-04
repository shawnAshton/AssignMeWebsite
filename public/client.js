
function ajaxRequest()
{
   var div = document.getElementById("5");
   div.innerHTML = "";
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function()
   {
      if (this.readyState == 4 && this.status == 200) 
      {
         var jsonResults =json.parse(this.responseText);
         div.innerHTML = jsonResults;
         console.log(jsonResults);
      }
   };
   //not sending variables?
   xhttp.open("POST", "/createUser", true);
  // xhttp.responseType = 'json';
   xhttp.send();
}
