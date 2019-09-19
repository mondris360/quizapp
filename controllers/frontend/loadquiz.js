// this module contains  the loadquiz controllers

// DEPENDENCIES
const mysql =  require("../../models/database");
const url =  require('url');
const helpers = require("../helpers")
exports.getPage = async(req, res) =>{
    // parse the URL
    let quizID =  req.params.quizID;
    let parsedUrl =  url.parse(req.url, true).query;
    let message = parsedUrl.message ? parsedUrl.message : '' ;
    let messageColor = parsedUrl.messageColor ? parsedUrl.messageColor : 'red' ;
    let total = 0;
    let lastDeposit = 1000;
    let firstName = "Mondris";
     try {
        let sql = `SELECT quizID, questions.question, questions.questionID,
        questions.option1, questions.option2, questions.option3, questions.option4,
        questions.correctAnswer FROM questions WHERE quizID = ?`
        let query = await mysql.query(sql, [quizID]);
        let getQuizName = await mysql.query(`SELECT quizName, quizID From quiz WHERE quizID = ?`,[quizID]);
        let question = getQuizName[0][0];
        let quizzes = query[0];

        // console.log("===", question)
        // store all the quiz question in a session
        // console.log(req.session.quiz);
        req.session.questions  = quizzes;
        let totalQuestions = req.session.questions.length;
        res.status(200);
        res.render("frontend/loadquiz", {quizzes, totalQuestions,question, message, messageColor});
     }catch(err){
        console.log(err);
        res.status(200);

     }

}

exports.postPage = async(req, res) => {
    let answerID = await helpers.generateStr(7);
    let playerDetails = req.session.user;
    let scoreCounter = req.session.score;
    let playerAnsDetails = {
        answerID:answerID,
        quizID: req.params.quizID,
        playerID:req.session.user.playerID,
        questionID: req.body.questionID,
        playerAnswer: req.body[req.body.questionID],
        correctAnswer: req.body.correctAnswer
    }
    let correctAnswer = playerAnsDetails.correctAnswer;
    let questionID = playerAnsDetails.questionID;
    let userAnswer = playerAnsDetails.playerAnswer;
    // check if the user answer is correct;
    if (userAnswer === correctAnswer){
        req.session.correctAnswer.push(playerAnsDetails);
    } else {
        req.session.wrongAnswer.push(playerAnsDetails);
    }
    res.redirect(`/loadquiz/${playerAnsDetails.quizID}`);

//     let quizScore ={
//         scoreID : helpers.generateStr(6),
//         quizID: req.params.quizID,
//         userID :req.session.user.userID,
// playerscore INT(10) DEFAULT 0,
// quizScore INT(10) DEFAULT 0,
//     }
    // try {

    //     // get the correct question answer and verify it
    //     let query2 = await mysql.query(`SELECT correctAnswer FROM questions WHERE quizID = ? AND questionID = ?`,
    //     [playerAnsDetails.quizID, playerAnsDetails.questionID]);
    //     let correctAns = query2[0][0].correctAnswer;
    //     // add the correct ans to the obj
    //     playerAnsDetails.correctAnswer = correctAns;
    //     // store the player selected answer details to the playersTables
    //     let query3 =  await mysql.query(`INSERT INTO playersanswers SET?`, playerAnsDetails);
    //     console.log(query3);
    //     // check if the user answer is correct
    //     if (playerAnsDetails.playerAnswer === correctAns){
    //         // update user quiz  score
    // //         let quizScore ={
    // //             scoreID : helpers.generateStr(6),
    // //             quizID,
    // // userID varChar(30),
    // // playerscore INT(10) DEFAULT 0,
    // // quizScore INT(10) DEFAULT 0,
    // //         }
    //     } else {
    //         console.log("wrong answer");
    //     }
        

    // }catch(err){
    //     console.log(err);
    // }

    // req.session.playerAnswers.push(playerAnswer);
    // console.log(req.session.playerAnswers)
}

exports.showresult = async(req, res) =>{
    let playerDetails = req.session.user;
    let quizID = req.params.quizID;
    let totalQuestions = req.session.questions.length;
    let totalpassed =  req.session.correctAnswer.length;
    let allAnswers = [...req.session.wrongAnswer, req.session.correctAnswer];

    // save the player score
    let scoreID = await helpers.generateStr(6)
    let scoreDetails = {
        scoreID,
        quizID,
        playerID:req.session.user.playerID,
        playerscore: totalpassed,
        quizScore:totalQuestions
        
    }
    // store player answers details
    try {
        //check if player details already exists
        let query1 = await mysql.query(`SELECT email from players WHERE email = ?`, [playerDetails.email]);
        if(query1[0].length === 0){
            let query2 = await mysql.query(`INSERT INTO players SET?`, playerDetails);
        }
        //  save the player answer choices
        for (var x=0; x <allAnswers.length; x++){
            let query =  await mysql.query(`INSERT INTO playersanswers SET ?`, allAnswers[x])
        }
        // save player score;
        let query = await mysql.query(`INSERT INTO quizscores SET?`, scoreDetails);
    }catch(err){
        // i will handle this error properly latter
        console.log(err);
        res.send("Unable To Process Your Request.Please click back and try again")

    }


    res.status(200);
    res.render("frontend/answer", {totalQuestions, totalpassed})
}