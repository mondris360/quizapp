// this module contains the create quiz controllers
//DEPENDENCIES
const helpers = require("../helpers");
const mysql = require("../../models/database");

exports.getPage = async(req, res) => {
     let firstName =  req.session.user.firstName;
     let total =  req.session.questions.length;
     let message = "";
     let messageColor = "";
     res.status(200);
     res.render("backend/createquiz2", { total, message,  firstName, messageColor});
}

exports.postPage = async(req, res) => {
    let quizID = await helpers.generateStr(5);
    let questionID =  await helpers.generateStr(5);
    let userID = req.session.user.userID;
    let quizName =  req.session.quizName;
    let question = req.body;
    let date = new Date().toJSON().slice(0, 10)
    let firstName =  req.session.user.firstName;
    let  quizDetails = {
        userID,
        quizID,
        quizName,
        date
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
        res.status(200);
        res.render("backend/createquiz2", { firstName, total ,message, messageColor})
    } else {
            req.session.questions.push(question);
            try {
                let quizData = req.session.quiz
                let questions = req.session.questions;
                let miniQuestionsDetails = {
                quizName,
                questionID:question.questionID
                }
                let quizinfo = {...quizData, ...miniQuestionsDetails};
                let checkBalance = await mysql.query(`SELECT balance from users WHERE id =?`, [userID]);
                let userBalance = checkBalance[0][0].balance;
                if(userBalance < 1000){ // cost per creating quiz;
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
                res.render("backend/createquiz2", {firstName,total ,message, messageColor, balance, lastDeposit});
            }
    }
}