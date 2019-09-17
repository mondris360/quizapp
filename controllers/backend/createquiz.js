// this module contains the create quiz controllers
//DEPENDENCIES
const helpers = require("../helpers");
const mysql = require("../../models/database");

exports.getPage = (req, res) => {
    let message = "none";
    let messageColor =  "red";
    let balance = 1000;
    let lastDeposit = 0;
    let total = 0;
    res.status(200);
    res.render("backend/createquiz", {message, messageColor, balance, lastDeposit, total})
}

exports.postPage = async(req, res) => {
    let quizId = await helpers.generateStr(5);
    let questionID =  await helpers.generateStr(5);
    let question = req.body
    //add the question id to the object
    question.questionID = questionID;

    let date = new Date();
    quizDetails = {
        userID: "e33",
        quizID: quizId,
        quizName: "2019 World Cup",
        date:date.toJSON().slice(0, 10)
    };
    req.session.quiz = quizDetails;

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
            for (var x = 0; x < questions.length; x++){
                let question = questions[x];
                // delete the button action property from the object i.e save or submit
                delete question.action;
                let miniQuestionsDetails = {
                quizName: "2019 World Cup Questions",
                questionID:question.questionID
                }
                let quizinfo = {...quizData, ...miniQuestionsDetails};
                let query1 =  mysql.query(`INSERT INTO quiz SET ?`, quizinfo);
                let query2 =  mysql.query(`INSERT INTO questions SET ?`, question);
                let message = "Your Quiz Has Been Created Successfully";
                let messageColor =  "blue";
                let total =  req.session.questions.length;
                let balance = 1000;
                let lastDeposit = 0;
                res.status(500);
                res.render("backend/createquiz", {total ,message, messageColor, balance, lastDeposit})
                
            }
        }catch(err){
            let message = "Unable To Process Your Request";
            let messageColor =  "red";
            let total =  req.session.questions.length;
            let balance = 1000;
            let lastDeposit = 0;
            res.status(500);
            res.render("backend/createquiz", {total ,message, messageColor, balance, lastDeposit});
        }
    }




}