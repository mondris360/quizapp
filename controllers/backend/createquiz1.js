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
     res.render("backend/quizname", { total, message,  firstName, messageColor});
}

exports.postPage = async(req, res) => {
    console.log("sddddddddddddddddddd");
    let quizName =  req.body.quizname;
     // save quiz name in the session
     req.session.quizName = quizName;
     res.status(302);
     res.redirect(`/dashboard/createquiz2`);
}