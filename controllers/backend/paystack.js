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
            let userData = query[0][0];
            let email = userData.email;
            let firstName = userData.firstName;
            let lastName = userData.lastName;
            // convert the amount to kobo
            let amountInKobo = amount * 100;
            console.log(amountInKobo)
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