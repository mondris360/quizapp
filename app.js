//DEPENDENCIES

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const app = express();
const path =  require("path");
const session =  require("express-session");
const initDbSetup =  require("./models/initDBSetup");
const usersBackendRouters =  require("./routes/usersbackend");
const frontendRouters =  require("./routes/frontend");

// session
let sessOptions =  {
    secret:"smaiht@&#^#*#(#_#(*&#&@*()@snas8745",
    cookies: {},
    saveuninitialized: false,
    resave: false,
}
// tell app to use the session 
app.use(session(sessOptions));
// middleware to create session
let createSession = (req, res, next) =>{
    if(!req.session.quiz){
        req.session.quiz = {};
        req.session.quizName = "";
        req.session.user = {};
        req.session.questions = [];
        req.session.correctAnswer = [];
        req.session.wrongAnswer = [];



        req.session.user = {}
        req.session.player = {
            playerID: "8554",
            firstName:"Mondris",
            lastName:"Miheal" ,
            email:"callme@gmail.com",
            date: "2019-09-17"
        }
  
    } 
    next();
}
app.use(createSession);
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