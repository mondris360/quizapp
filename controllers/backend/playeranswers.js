//this module contains the view quizzes controllers
// DEPENDENCIES
const mysql =  require("../../models/database");
const url =  require('url');
exports.getPage = async(req, res) =>{
    // parse the URL
    let quizID =  req.params.quizID;
    let playerID =  req.params.playerID;
    let firstName =  req.session.user.firstName;
    // get all the player selected answers
    try {

        let testing = ``; 
        let result = []
            let query = await mysql.query(`SELECT questionID, playerID, correctAnswer,playerAnswer, date
                from playersanswers WHERE playerID = ? and quizID = ? `, [playerID, quizID]);
            let queryData = query[0];
    
            for (var x=0; x <queryData.length; x++){
                let questionID = queryData[x].questionID;
                let questionName =  await mysql.query(`SELECT question from questions WHERE questionID = ?`,[questionID]);
                let question = questionName[0][0].question;
                // add the question to the new obj
                queryData[x].question = question;
                result.push(queryData[x]);
            }
            console.log(result);
            let message = "";
            let messageColor = "red";
            res.status(200);
            res.render("backend/viewanswers", {result, firstName, message, messageColor})
    } catch(err){
        console.log(err);
        res.status(500);
        res.send("An error occured");
    }

    // let parsedUrl =  url.parse(req.url, true).query;
    // let message = parsedUrl.message ? parsedUrl.message : '' ;
    // let messageColor = parsedUrl.messageColor ? parsedUrl.messageColor : 'red' ;
    // let total = 0;
    // let lastDeposit = 1000;
    // let firstName = "Mondris";
    //  try {
    //     let sql = `SELECT questions.question, questions.questionID,
    //     questions.option1, questions.option2, questions.option3, questions.option4,
    //     questions.correctAnswer FROM questions WHERE quizID = ?`
    //     let query = await mysql.query(sql, [quizID]);
    //     let getQuizName = await mysql.query(`SELECT quizName From quiz WHERE quizID = ?`,[quizID]);
    //     let question = getQuizName[0][0];
    //     let quizzes = query[0];
    //     res.status(200);
    //     res.render("backend/viewquiz", {quizzes,question, message, messageColor});
    //  }catch(err){
    //     console.log(err);
    //     res.status(200);

    //  }

}

// HANDLE THE POST REQUEST
exports.postPage = async(req, res)=>{
    let searchInput =  `%${req.body.search}%`;
    try{
        let query = await mysql.query(`SELECT * FROM quiz WHERE userID = ? AND status = ?`, ["e33", "active"]);
        let quizzes = query[0];
        let message = "";
        let messageColor = "";
        res.status(200);
        res.render("backend/viewquizzes", {quizzes, message, messageColor});
    }catch(err){
        console.log(err)
        let message = "Unable To Process Your Request";
         let messageColor = "red";
         let quizzes = [];
         res.status(500);
         res.render("backend/viewquizzes", {quizzes, message, messageColor});
        }
}

//handles delete request

exports.delete = async(req, res) => {
    let quizID =  req.params.id;
   try{
        let query1 = await mysql.query(`UPDATE quiz SET status = ? WHERE quizID = ?`, ["deleted", quizID]);
        let query2 = await  mysql.query(`SELECT * FROM quiz WHERE status = ?`, ["active"]);
        let quizzes = query2[0];
        let message = "Quiz Was Deleted Successfully";
        let messageColor = "blue";
        res.status(301);
        res.redirect(`/dashboard/viewquizzes?message=${message}&messageColor=${messageColor}`);
   }catch(err) {
       console.log(err)
       let message = "Unable To Delete Quizz. Please Try Again Latter";
        let messageColor = "red";
        let quizzes = [];
        res.status(500);
        res.redirect(`/dashboard/viewquizzes?message=${message}&messageColor=${messageColor}`);
   }

}