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
     let messageColor = ""
     // get user info
     try {
        let query =  await mysql.query(`SELECT firstName, balance, lastdeposit from users WHERE id = ?`, [userID]);
        let userInfo = query[0][0];
        firstName =  userInfo.first;
        balance = userInfo.balance;
        lastDeposit =  userInfo.lastDeposit;
        res.status(200);
        res.render("backend/createquiz", {message,  firstName, messageColor, balance, lastDeposit})
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
    let question = req.body
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
        res.render("backend/createquiz", {total ,message, messageColor, balance, lastDeposit})
    } else {
        // update session with the last filled question
        req.session.questions.push(question);
        // save quiz Details in the databases
        try {
            let quizData = req.session.quiz
            let questions = req.session.questions;
            let miniQuestionsDetails = {
            quizName: "2019 World Cup Questions",
            questionID:question.questionID
            }
            let quizinfo = {...quizData, ...miniQuestionsDetails};
            // store the quiz details in the quiz table
            let query1 =  await mysql.query(`INSERT INTO quiz SET ?`, quizinfo);
            console.log("saving to quiz table ")
            // loop through the questions array and store all questions in the question table
            for (var x = 0; x < questions.length; x++){
                let question = questions[x];
                 // delete the button action property from the object i.e save or submit
                delete question.action;
                console.log("...", question)
                let query2 =  await mysql.query(`INSERT INTO questions SET ?`, question);
            }
            let message = "Your Quiz Has Been Created Successfully";
            let messageColor =  "blue";
            let total =  req.session.questions.length;
            let balance = 1000;
            let lastDeposit = 0;
            res.status(200);
            res.render("backend/createquiz", {total ,message, messageColor, balance, lastDeposit})
        }catch(err){
            let message = "Unable To Process Your Request";
            let messageColor =  "red";
            let total =  req.session.questions.length;
            let balance = 1000;
            let lastDeposit = 0;
            console.log(err);
            res.status(500);
            res.render("backend/createquiz", {total ,message, messageColor, balance, lastDeposit});
        }
    }




}