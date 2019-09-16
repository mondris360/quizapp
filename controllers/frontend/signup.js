// this module contains the login controller
//DEPENDENCIES
const mysql = require("../../models/database");
const helpers = require("../helpers");


exports.getPage = (req, res) =>{
    res.render("frontend/signup")
}


exports.postPage = async(req, res) =>{
    let userID = await helpers.generateStr(3);
    let userDetails = {
        id:userID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }
    console.log(userDetails)
    try {
        const emailExists =  await mysql.query(`SELECT email From users WHERE email= ?`,[userDetails.email]);
        if(emailExists[0].length > 0){
            let message ='Email Address Already Exist';
            let messageColor = 'red';
            res.status(401);
            res.render("frontend/signup", {message, messageColor});
        } else {
            const query = await mysql.query(`INSERT INTO users SET?`, userDetails);
            let message ='Your Account Was Created Sucessfully';
            let messageColor = 'blue';
            res.status(200);
            res.render("frontend/signup", {message, messageColor});
        }
    } catch(err){
        let message ='An Error Occured.Please Try Again'
        let messageColor = 'red';
        res.status(500);
        res.render("frontend/signup", {message, messageColor});
        console.log(err);
    }
}