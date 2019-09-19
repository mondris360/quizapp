// this module contains the login controller
// DEPENDENCIES
const mysql = require("../../models/database");
const url =  require("url");

exports.getPage = (req, res) =>{
    // passed the url to get the passed valuees
    let parsedUrl =  url.parse(req.url, true).query;
    let message = parsedUrl.message ? parsedUrl.message : '' ;
    let messageColor = parsedUrl.messageColor ? parsedUrl.messageColor : 'red' ;

    res.render("frontend/login", {message, messageColor});
}

// handles the  login route post

exports.postPage = async(req, res) => {

    let email = req.body.email;
    let password =  req.body.password;
    // valid user login details
    try {   
        let query = await mysql.query(`SELECT id, password firstName, lastName, password FROM users WHERE email = ?`, [email]);
        let result =  query[0];
        // check if a match was found;
        if (result.length === 0){
            let message = "Invalid email address";
            let messageColor = "red";
            res.status(401);
            res.redirect(`/login?message=${message}&messageColor=${messageColor}`);
        } else {
            let userInfo = query[0][0];
            console.log(userInfo)
            let storedPass = userInfo.password;
            let firstName = userInfo.firstName;
            let userId = userInfo.id;
            // check  is password is valid
            if(password === storedPass){
                // save the user detail in the session
                req.session.user = {
                    userID: userId,
                    firstName: firstName
                }
                console.log(req.session.user)
                res.status(200);
                res.redirect("/dashboard")            
            } else {
                let message = "Invalid password";
                let messageColor = "red";
                res.status(302);
                res.redirect(`/login?message=${message}&messageColor=${messageColor}`);
            }
        }

    } catch(err){
        let message = "Unable to Process Your Request.";
        let messageColor = "red";
        res.status(302);
        res.redirect(`/login?message=${message}&messageColor=${messageColor}`);
        console.log(err);
    }   
}