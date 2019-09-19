// this module contains the create quiz controllers
//DEPENDENCIES
const helpers = require("../helpers");
const mysql = require("../../models/database");

exports.getPage = async(req, res) => {
     let userID =  req.session.user.userID;
     let firstName;
     let balance;
     let lastDeposit;
     let message = "";
     let messageColor = "";
     let total =  req.session.questions.length;
     // get user info
     try {
        let query =  await mysql.query(`SELECT firstName, balance, lastdeposit from users WHERE id = ?`, [userID]);
        let userInfo = query[0][0];
        firstName =  userInfo.first;
        balance = userInfo.balance;
        lastDeposit =  userInfo.lastDeposit;
        res.status(200);
        res.render("backend/createquiz", { total, message,  firstName, messageColor, balance, lastDeposit})
     } catch (err){
        let message ="An error occured while processing Your Request";
        let messageColor = "red";
        console.log(err);
        res.status(200);
        res.redirect(`/dashboard?message=${message}&messageColor=${messageColor}`);

     }
  
}

exports.postPage = async(req, res) => {
    let quizId = await helpers.generateStr(5);
    let questionID =  await helpers.generateStr(5);
    let userID = req.session.user.userID;
    let question = req.body;
    let firstName =  req.session.user.firstName;
    let date = new Date();
    quizDetails = {
        userID: "e33",
        quizID: quizId,
        quizName: "2019 World Cup",
        date:date.toJSON().slice(0, 10)
    };
    if(Object.keys(req.session.quiz).length === 0){
        console.log("saving quiz session")
        req.session.quiz = quizDetails;
    }
        //add the question id to the object
        question.questionID = questionID;
        // add quizid to the question obj
        question.quizID = req.session.quiz.quizID;

    //check if the user clicked on the save button or submit button
    if(req.body.action === "save"){
        req.session.questions.push(question);
        let message = "Question Saved Successfully";
        let messageColor =  "blue";
        let total =  req.session.questions.length;
        let balance = 1000;
        let lastDeposit = 0;
        res.status(200);
        res.render("backend/createquiz", { firstName, total ,message, messageColor, balance, lastDeposit})
    } else {
            req.session.questions.push(question);
            try {
                let quizData = req.session.quiz
                let questions = req.session.questions;
                let miniQuestionsDetails = {
                quizName: "2019 World Cup Questions",
                questionID:question.questionID
                }
                let quizinfo = {...quizData, ...miniQuestionsDetails};
                let checkBalance = await mysql.query(`SELECT balance from users WHERE id =?`, [userID]);
                let userBalance = checkBalance[0][0].balance;
                if(userBalance <= 1000){ // cost per creating quiz;
                    let message ="Insufficient Funds.Please Deposit Money To Your Account";
                    let messageColor = "red";
                    res.status(302);
                    res.redirect(`/dashboard?message=${message}& messageColor=${messageColor}`);
                } else {
                    let query1 =  await mysql.query(`INSERT INTO quiz SET ?`, quizinfo);
                    for (var x = 0; x < questions.length; x++){
                        let question = questions[x];
                        // delete the button action property from the object i.e save or submit
                        delete question.action;
                        let query2 =  await mysql.query(`INSERT INTO questions SET ?`, question);
                    }
                    // deduct cost from user balance
                    let deductCost =  await mysql.query(`UPDATE users SET balance = balance - 1000 WHERE id = ?`, [userID]);
                    let message = "Your Quiz Was Created Successfully";
                    let messageColor =  "blue";
                    res.status(302);
                    res.redirect(`/dashboard?message=${message}& messageColor=${messageColor}`);
                }
            }catch(err){
                let message = "Unable To Process Your Request";
                let messageColor =  "red";
                let total =  req.session.questions.length;
                let balance = 1000;
                let lastDeposit = 0;
                console.log(err);
                res.status(500);
                res.render("backend/createquiz", {firstName,total ,message, messageColor, balance, lastDeposit});
            }
    }




}