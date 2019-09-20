// this module contains the users dashboard  index controllers
//DEPENDENCIES
const mysql = require("../../models/database");
const url = require("url");

exports.getPage = async(req, res) => {
    // parse the url to get passed valuees
    let parsedUrl =  url.parse(req.url, true).query;
    let message = parsedUrl.message ? parsedUrl.message : '' ;
    let messageColor = parsedUrl.messageColor ? parsedUrl.messageColor : 'red' ;
    let userID = req.session.user.userID;
 
    // get user info from the database
    try{
        let query =  await mysql.query(`SELECT firstName, balance, lastdeposit FROM users WHERE id =?`, [userID]);
        let userInfo = query[0][0];
        let balance = userInfo.balance;
        let lastDeposit = userInfo.lastdeposit;
        let firstName = userInfo.firstName;
        res.status(200);
        res.render("backend/index", {firstName, balance, lastDeposit, message, messageColor, balance, lastDeposit})
    } catch(err){
        let message = "Unable To Process Your Request";
        let messageColor = "red";
        res.status(301);
        res.redirect(`/login?message=${message}&messageColor=${messageColor}`);
        console.log(err);
    }
}