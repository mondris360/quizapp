// this module contains the create quiz controllers
//DEPENDENCIES
const helpers = require("../helpers");

exports.getPage = (req, res) => {
    
    let message = "none";
    let messageColor =  "red";
    let balance = 1000;
    let lastDeposit = 0;
    res.status(200);
    res.render("backend/createquiz", {message, messageColor, balance, lastDeposit})
}

exports.postPage = async(req, res) => {
    let quizId = await helpers.generateStr(5)
    quizDetails = {
        id: quizId,
        quizName: "2019 World Cup"
    } ;
    req.session.quiz = quizDetails;
    req.session.questions.push(req.body);
    console.log(req.session)

    let message = "none";
    let messageColor =  "red";
    let balance = 1000;
    let lastDeposit = 0;
    res.status(200);
    res.render("backend/createquiz", {message, messageColor, balance, lastDeposit})
}