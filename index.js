const express = require("express");
const app = express();
const { Pool } = require("pg");
const port = process.env.PORT || 5000;
const dbConnectionString = process.env.DATABASE_URL || "something";
const pool = new Pool({connectionString: dbConnectionString});

app.use(express.static(__dirname + '/public'));
//this is to help with post
app.use(express.json()) // supports json encoded bodies
app.use(express.urlencoded({extended:true}))//supports url encoded bodies
//this helps display
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('port', port);
app.get("/", function(req,res)
{
   console.log("request was recieved. HOME PAGE");
   res.write("HERRO you are at a nice page... maybe you want a file...");
   res.end();
});

app.get("/projectList", getProjectList)
function getProjectList(req,res)
{
   //get user_id from the req...
   console.log("getting project list...");
   console.log("TRYING TO CONNECT TO DATABASE" + dbConnectionString);
  // res.json({name:"john"});
   var user_id = req.query.id;
   getProjectListFromDB(user_id, function(error,result)
   {
      if(error || result == null || result.length < 1)
      {
         console.log("length is: ");
         console.log(result.length);
         if (result == null)
         {
            console.log("result is null");
         }
         console.log("error is: " + error);
         res.status(500).json({success: false, data: error});
      }
      else
      {
         res.status(200).json(result);  
      }
   });
}
function getProjectListFromDB(user_id, callback)
{
   var sql = "SELECT p.title, p.id FROM project p JOIN program_user pu ON p.program_user_id = pu.id WHERE pu.id = $1::int";
   var params = [user_id];
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
      if(error || result == null || result.length < 1)
      {
         console.log("length is: ");
         console.log(result.length);
         if (result == null)
         {
            console.log("result is null");
         }
         console.log("error is: " + error);
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
   var sql = "SELECT w.name, j.job_title, jw.instance_of_meeting, p.title, p.id,p.program_user_id,pu.id, pu.username," +
                         "j.project_id, j.id, jw.job_id, w.id, jw.worker_id FROM worker w" +
      " JOIN job_worker jw ON w.id = jw.worker_id" +
      " JOIN job j ON jw.job_id = j.id" +
      " JOIN project p ON j.project_id = p.id" +
      " JOIN program_user pu ON p.program_user_id = pu.id" +
      " WHERE p.id = $1::int" +
      " ORDER BY jw.instance_of_meeting, w.name";
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

app.post("/authenticate", authenticate) // how do I make secure password? it gets into database, but it times out here...
function authenticate(req,res)
{
   var checkUsername = req.body.username;
   var checkPassword = req.body.password;
   console.log("CHECK USERNAME FROM POST IS " + checkUsername);
   console.log("TRYING TO authenticate username");


   getUserFromDB(checkUsername, function(error,result)
   {
      if(error || result == null || result.length < 1)
      {
         console.log("length is: ");
         console.log(result.length);
         if (result == null)
         {
            console.log("result is null");
         }
         console.log("error is: " + error);
         res.status(500).json({success: false, data: error}); 
      }
      else
      {
         // res.status(200).json(result);
         console.log("ok...im almost there...\nindex 0 is this!!!!!!!!!!!!!!!!!!!!");
         // I NEED TO FIGURE OUT HOW TO USE RESULTS
         var params = {username: result[0].username, password: result[0].password, id:result[0].id};
         console.log("****result", result);
         console.log("****USERNAME", result[0].username);
         console.log("****PASSWORD", result[0].password);
         console.log("****id", result[0].id);
         res.render('pages/login', params);
      }
   });
   // res.end();
}

app.post("/login", login) // how do I make secure password? it gets into database, but it times out here...
function login(req,res)
{
   var checkUsername = req.body.username;
   var checkPassword = req.body.password;
   console.log("CHECK USERNAME FROM POST IS " + checkUsername);
   console.log("TRYING TO login username");


   getUserFromDB(checkUsername, function(error,result)
   {
      if(error || result == null || result.length < 1)
      {
         console.log("length is: ");
         console.log(result.length);
         if (result == null)
         {
            console.log("result is null");
         }
         console.log("error is: " + error);
         res.status(500).json({success: false, data: error}); 
      }
      else
      {
         // res.status(200).json(result);
         console.log("ok...im almost there...\nindex 0 is this!!!!!!!!!!!!!!!!!!!!");
         // I NEED TO FIGURE OUT HOW TO USE RESULTS
         var params = {username: result[0].username, password: result[0].password, id:result[0].id};
         console.log("****result", result);
         console.log("****USERNAME", result[0].username);
         console.log("****PASSWORD", result[0].password);
         console.log("****id", result[0].id);
         res.render('pages/login', params);
      }
   });
   // res.end();
}

app.get("/user", getUser)
function getUser(req,res)
{
   //get id from the req...
   console.log("getting username...");
   console.log("TRYING TO CONNECT TO DATABASE" + dbConnectionString);
  // res.json({name:"john"});
   var name = req.query.name;
   getUserFromDB(name, function(error,result)
   {
      if(error || result == null || result.length < 1)
      {
         console.log("length is: ");
         console.log(result.length);
         if (result == null)
         {
            console.log("result is null");
         }
         console.log("error is: " + error);
         res.status(500).json({success: false, data: error});
      }
      else
      {
         res.status(200).json(result);  
      }
   });
}
function getUserFromDB(name, callback)
{
   var sql = "SELECT * FROM program_user pu WHERE pu.username = $1";
   var params = [name];
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

app.post("/createUser", createUser) // how do I make secure password? it gets into database, but it times out here...
function createUser(req,res)
{
   var newUsername = req.body.username;
   var newPassword = req.body.password;
   console.log("USERNAME FROM POST IS " + newUsername);
   console.log("TRYING TO CREATE username");


   var sql = "INSERT INTO program_user(username,password) VALUES ($1, $2)";
   var params = [newUsername,newPassword];
   pool.query(sql,params,function(err)
   {
      if (err)
      {
         console.log("error in createUser");
         res.status(500).json({success: false, data: error});
      }
      else
      {
         res.status(200).json({success: true, data: "success"});
      }
   })
   res.end();
}

app.post("/createProject", createProject) //WORK ON INPUTTING INTO DATABASE AND WHAT TO HAVE IT RETURN..?!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function createProject(req,res)
{
   var title = req.body.projectTitle;
   var numRotations = req.body.totalMeetings; 
   var workers = req.body.names;
   var jobs = req.body.jobs;
   console.log("mytitle: " + title);
   console.log("numRotations: " + numRotations);
   console.log("NAMES");
   console.log("worker count: " + workers.length);
   for(var i = 0; i < workers.length; i++)
    {
      console.log("worker #: " + i + workers[i]);
    }
   for(var i = 0; i < jobs.length; i++)
    {
      console.log("job #: " + i + jobs[i]);
    }
   console.log("TRYING TO CREATE PROJECT");
}

app.listen(port, function()
{
   console.log("server is listening on port: " + port);
});