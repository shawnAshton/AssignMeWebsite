const express = require("express");
const app = express();
const { Pool } = require("pg");
const port = process.env.PORT || 5000;
const dbConnectionString = process.env.DATABASE_URL || "something";
const pool = new Pool({connectionString: dbConnectionString});

app.use(express.static(__dirname + '/public'));
app.set('port', port);
app.get("/", function(req,res)
{
   console.log("request was recieved. HOME PAGE");
   res.write("HERRO you are at a nice page... maybe you want a file...");
   res.end();
});

app.get("/project", getProject)
function getProject(req,res)
{
   //get id from the req...
   console.log("getting project...");
   console.log("TRYING TO CONNECT TO DATABASE" + dbConnectionString);
  // res.json({name:"john"});
   var id = req.query.id;
   getProjectFromDB(id, function(error,result)
   {
      if(error || result == null || result.length != 1)
      {
         res.status(500).json({success: false, data: error});
      }
      else
      {
         res.status(200).json(result);  
      }
   });
}

function getProjectFromDB(id, callback)
{
   var sql = "SELECT title, program_user_id project WHERE id = $1::int";
   var params = [id];
   pool.query(sql,params,function(err,result)
   {
      if(err)
      {
         console.log("error in query: ")
         console.log(err);
         callback(err,null);
      }
      console.log("Found result: " + JSON.stringify(result.rows));
      callback(null, result.rows);
   })
}

app.listen(port, function()
{
   console.log("server is listening on port: " + port);
});