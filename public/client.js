
function ajaxRequest()
{
   div.innerHTML = "";
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function()
   {
      if (this.readyState == 4 && this.status == 200) 
      {
         var jsonResults =JSON.parse(this.responseText);
         //div.innerHTML = titles.join("<br>");
         console.log(jsonResults);
      }
   };
   xhttp.open("POST", "/createUser", true);
   xhttp.send();
}
