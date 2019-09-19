// this module contains  the paystack controllers
//DEPENDENCIES
const request = require("request");
const mysql = require("../../models/database");


exports.initPayment = async(req, res) =>{
    let amount = parseInt(req.body.amount);
    let userID = req.session.user.userID;
    console.log(userID);
    if(amount < 1000) {
        let message = "Min Amount is 1000 Naira";
        let messageColor = "red"
        res.status(401);
        res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
    } else {
        // get userinfo from the database
        console.log("inside else");
        try {
            let query = await mysql.query(`SELECT email, firstName, lastName from users WHERE id=?`,[userID]);
            let userInfo = query[0][0];
            let email = userInfo.email;
            let firstName = userInfo.firstName;
            let lastName = user.Info.lastName;
            // convert the amount to kobo
            let amount = amount * 100;
            let userInfo = {
                email,
                firstName,
                lastName,
                amount
            }
        }catch(err){
            console.log(err);
        }
    } 
}