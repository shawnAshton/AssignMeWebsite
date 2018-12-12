app.post("/createUser", createUser) // how do I make secure password? it gets into database, but it times out here...
function createUser(req,res)
{
   var newUsername = req.body.username;
   var newPassword = req.body.password;
   console.log("USERNAME FROM POST IS " + newUsername);
   console.log("TRYING TO CREATE username");

   // make sure it doesnt exist already...
   var exists = true;
   var sql = "SELECT * FROM program_user pu WHERE pu.username = $1 and pu.password = $2";
   var params = [newUsername, newPassword];
   pool.query(sql,params,function(err,result)
   {
      if(err)
      {
         console.log("error in query: ")
         console.log(err);
      }
      console.log("Found result: " + JSON.stringify(result.rows));
      if(err || result.rows == null || result.rows.length < 1)
      {
         exists = false;
      }
      
   })
   console.log("exists is", exists);
   // create it if it doesnt exist
   if (!exists)
   {
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
            res.status(200).json({success: true, data: "success in creation"});
         }
      })
   }
   else
   {
      res.status(500).json({success: false, data: "it already exists"});
   }

}