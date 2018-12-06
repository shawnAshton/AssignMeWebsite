const express = require("express");
const app = express();
const { Pool } = require("pg");
const port = process.env.PORT || 5000;
const dbConnectionString = process.env.DATABASE_URL || "something";
const pool = new Pool({connectionString: dbConnectionString});

var session = require('express-session');
app.use(session({secret: 'none', cookie:{maxAge:60000}, resave:false, saveUninitialized:false}))

app.use(logRequest);
function logRequest(req,res,next)
{
   console.log("recieved request for: " + req.url);
   next();
}

app.use('/getServerTime', verifyLogin);
function verifyLogin(req,res,next)
{
   if(req.session.username)
   {  
     next(); 
   }
   else
   {
      res.status(401);

      res.json({success:false});
   }
}

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
   res.write("HERRO you are at a right page...");
   res.end();
});


app.post('/login', function(req,res)
{

   var name = req.body.username; 
   var pass = req.body.password;
   // console.log(name);
   // console.log(pass);
   checkUserFromDB(name, pass, function(error,result)
   {
      if (error || result == null || result.length < 1)
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
         req.session.username = name;
         console.log(result);
         res.status(200).json({success:true});
      }
   })


   // if(theyExist) //THIS WILL CHANGE
   // {
   //    //put something on session...
   //    req.session.username = name;
   //    res.json({success:true});
   // }
   // else
   // {
   //    res.json({success:false});
   // }

});

function checkUserFromDB(name, password, callback)
{
   var sql = "SELECT * FROM program_user pu WHERE pu.username = $1 and pu.password = $2";
   var params = [name,password];
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
















app.post('/logout', function(req,res)
{
   // console.log(req.session.username);
  
   if(req.session.username)//username isnt null)
   {
      req.session.destroy(function(err)
      {
         if (err)
         {
            console.log(err);
            res.json({success:false});
         }
         else
         {
            res.json({success:true});
         }
      });
   }
   else
   {
      //display you are  NOT logged in
      res.json({success:false});
   }
});

app.get('/getServerTime', function(req,res)
{

   var time = new Date();
   res.json({success:true, time:time});
// res.json({success:false});
});

app.listen(port, function()
{
   console.log("server is listening on port: " + port);
});

