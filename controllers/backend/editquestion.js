// this module contains the create quiz controllers
//DEPENDENCIES
const helpers = require("../helpers");
const mysql = require("../../models/database");

exports.getPage = async(req, res) => {
    let questionID = req.params.id;
    let message = "";
    let messageColor =  "red";
    let balance = 1000;
    let lastDeposit = 0;
    let total = 0;
    try{
        let query = await mysql.query(`SELECT * FROM questions WHERE questionID  = ?`, [questionID]);
        let query2 = await mysql.query(`SELECT quizName FROM quiz  WHERE questionID  = ?`, [questionID]);
        let result = {...query[0][0], ...query2[0][0]};
        res.status(200);
        res.render("backend/editquestion", {result, message, messageColor, balance, lastDeposit, total})
    } catch (err){
        console.log(err)
        res.status(200);
    }

}

exports.postPage = async(req, res) => {
    let questionID = req.params.id;
    let updatedDetails =  req.body;

        // save quiz Details in the databases
    try {
        let updateQuestion = mysql.query(`UPDATE questions SET question =?, option1 =?, option2 =?, option3 =?, option4 = ?, correctAnswer = ? WHERE questionID = ?`,
         [updatedDetails.question, updatedDetails.option1, updatedDetails.option2, updatedDetails.option3, updatedDetails.option4,
        updatedDetails.correctAnswer, questionID]);
        let result = [];
        let message = "Your Question Was Successfully Updated";
        let messageColor =  "blue";
        let balance = 1000;
        let lastDeposit = 0;
        res.status(200);
        res.render("backend/editquestion", {result,message, messageColor, balance, lastDeposit})
    }catch(err){
        let message = "Unable To Update Your Question";
        let messageColor =  "red";
        let balance = 1000;
        let lastDeposit = 0;
        console.log(err);
        res.status(500);
        res.render("backend/editquestion", {result, message, messageColor, balance, lastDeposit});
    }
}