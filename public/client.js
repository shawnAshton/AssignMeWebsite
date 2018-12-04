
function ajaxRequest()
{
   var div = document.getElementbyId
   div.innerHTML = "";
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function()
   {
      if (this.readyState == 4 && this.status == 200) 
      {
         var jsonResults =JSON.parse(this.responseText);
         div.innerHTML = jsonResults;
         console.log(jsonResults);
      }
   };
   xhttp.open("POST", "/createUser", true);
   xhttp.send();
}
