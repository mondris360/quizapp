// this module contains  the paystack controllers
//DEPENDENCIES
const request = require("request");
const mysql = require("../../models/database");
const url =  require("url");

// initialize paystack payment
exports.initPayment = async(req, res) =>{
    let amount = parseInt(req.body.amount);
    let userID = req.session.user.userID;
    if(amount < 1000) {
        let message = "Min Amount is 1000 Naira";
        let messageColor = "red"
        res.status(401);
        res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
    } else {
        // get userinfo from the database
        try {
            let query = await mysql.query(`SELECT email, firstName, lastName from users WHERE id=?`,[userID]);
            let userData = query[0][0];
            let email = userData.email;
            let firstName = userData.firstName;
            let lastName = userData.lastName;
            // convert the amount to kobo
            let amountInKobo = amount * 100;
            let userInfo = {
                email,
                firstName,
                lastName,
                amount: amountInKobo
            }
            let apiOption = {
                url:'https://api.paystack.co/transaction/initialize',
                method:"post",
                body:JSON.stringify(userInfo),
                headers: {
                    authorization: 'Bearer sk_test_bf5e8d244c6ef6da2a8617e1c3f2e752a5fa40df',
                    'content-type' : 'application/json',
                    'cache-control': 'no-cache'
                }
            }

            // initialize the payment
            request(apiOption, (err, apiResponse,body)=>{
                if(err){
                    let message ="An Error Occured While Processing Your Payment";
                    let messageColor = "red";
                    console.log(err);
                    res.status(500);
                    res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
                } else {
                    let parsedBody = JSON.parse(body);
                    let paymenturl =  parsedBody.data.authorization_url;
                    res.status(200)
                    res.redirect(paymenturl);
                }
            })
        }catch(err){
            let message ="Unable To Process Your Payment";
            let messageColor = "red";
            res.status(500);
            console.log(err);
            res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
        }
    } 
}

// verify paystack payment
exports.verifyPayment = async(req, res) => {
 // parse the url to get passed valuees
 let parsedUrl =  url.parse(req.url, true).query;
 // specifying fallback values;
 let message = parsedUrl.message ? parsedUrl.message : '' ;
 let messageColor = parsedUrl.messageColor ? parsedUrl.messageColor : 'red' ;
 let userID = req.session.user.userID;
 let reference = parsedUrl.reference;
 let apiOption = {
    url:`https://api.paystack.co/transaction/verify/${reference}`,
    method: 'get',
    headers: {
        authorization: 'Bearer sk_test_bf5e8d244c6ef6da2a8617e1c3f2e752a5fa40df',
        'content-type' : 'application/JSON',
        'cache-control': 'no-cache'
    },
    }
    // verify the payment
    request(apiOption, async(err, apiRes, body) =>{
        if(err){
            let message ="An Error Occured While Processing Your Payment";
            let messageColor = "red";
            console.log(err);
            res.status(500);
            res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
        } else {
            let parsedBody = JSON.parse(body);
            let refCode = parsedBody.data.reference;
            let amount = parsedBody.data.amount / 100; //convert back to naira;
            // credit the user account
            try {
                let query = await mysql.query(`UPDATE users SET balance = balance + ?, lastDeposit = ?, refCode =? WHERE id =?`, [amount, amount, refCode, userID]);
                let message = "Your Deposit Was Successful";
                let messageColor = "blue";
                res.status(200);
                res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
            } catch(err){
                let message = "An Error Occured While Verifying Your Payment";
                let messageColor = "red";
                res.status(500);
                console.log(err);
                res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);
            }
        }
    })
}
