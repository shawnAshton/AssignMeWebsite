const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = process.env.PORT || 5000;
const dbConnectionString = process.env.DATABASE_URL || "something";
const pool = new Pool({connectionString: dbConnectionString});

app.use(express.static(__dirname + '/public'));
app.get("/", function(req,res)
{
   console.log("request was recieved. HOME PAGE");
   res.write("HERRO you are at a nice page... maybe you want a file...");
   res.end();
});

app.get("/person", getPerson)
function getPerson(req,res)
{
   //get id from the req...
   console.log("getting person...");
   console.log("TRYING TO CONNECT TO DATABASE" + dbConnectionString);
   res.json({name:"john"});
}

app.listen(port, function()
{
   console.log("server is listening on port: " + port);
});