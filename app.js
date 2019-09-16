//DEPENDENCIES

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const app = express();
const path =  require("path")
const usersBackendRouters =  require("./routes/usersbackend");
const frontendRouters =  require("./routes/frontend");


// view engine setup
app.set("view engine", "ejs");
// set up views config
app.set("views",path.join(__dirname,"views"))
//static files config
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:true}));

// routes config
app.use("/dashboard",usersBackendRouters);
app.use("/", frontendRouters);




// listen on a specific port
app.listen(3000, ()=>{
    console.log("App is running on port 3000")
})