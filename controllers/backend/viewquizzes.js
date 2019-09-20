//this module contains the view quizzes controllers
// DEPENDENCIES
const mysql =  require("../../models/database");
const url =  require('url');
exports.getPage = async(req, res) =>{
    // parse the URL
    let parsedUrl =  url.parse(req.url, true).query;
    let message = parsedUrl.message ? parsedUrl.message : '' ;
    let messageColor = parsedUrl.messageColor ? parsedUrl.messageColor : 'blue' ;
    let firstName = req.session.user.firstName;
    let userID =  req.session.user.userID;
    console.log(userID);
     try {
        
        let query = await mysql.query(`SELECT * FROM quiz WHERE userID = ? AND status = ? ORDER BY date  DESC`, [userID, "active"]);
        let quizzes = query[0];
        res.status(200);
        res.render("backend/viewquizzes", {firstName, quizzes, message, messageColor});
     }catch(err){
        let message ="Unable To Process Your Request";
        let messageColor = "red";
        console.log(err);
        res.status(302);
        res.redirect(`/dashboard?message=${message}& messageColor=${messageColor}`);

     }

}

// HANDLE THE POST REQUEST
exports.postPage = async(req, res)=>{
    let firstName = req.session.user.firstName;
    let userID = req.session.user.userID;
    let searchInput =  `%${req.body.search}%`;
    try{
        let query = await mysql.query(`SELECT * FROM quiz WHERE userID = ? AND status = ? AND quizName LIKE ? OR quizID LIKE ? ORDER BY date DESC` , [userID, "active", searchInput, searchInput]);
        let quizzes = query[0];
        let message = "";
        let messageColor = "";
        res.status(200);
        res.render("backend/viewquizzes", {firstName, quizzes, message, messageColor});
    }catch(err){
        console.log(err)
        let message = "Unable To Process Your Request";
         let messageColor = "red";
         let quizzes = [];
         res.status(500);
         res.redirect(`/dashboard?message=${message}& messageColor=${messageColor}`);
        }
}

//handles delete request

exports.delete = async(req, res) => {
    let quizID =  req.params.id;
    console.log(req.params.id)
   try{
        let query1 = await mysql.query(`UPDATE quiz SET status = ? WHERE quizID = ?`, ["deleted", quizID]);
        let query2 = await  mysql.query(`SELECT * FROM quiz WHERE status = ?`, ["active"]);
        let quizzes = query2[0];
        let message = "Quiz Was Deleted Successfully";
        let messageColor = "blue";
        res.status(301);
        res.redirect(`/dashboard/viewquizzes?message=${message}&messageColor=${messageColor}`);
   }catch(err) {
       let message = "Unable To Delete Quizz. Please Try Again Latter";
        let messageColor = "red";
        console.log(err)
        res.status(500);
        res.redirect(`/dashboard?message=${message}& messageColor=${messageColor}`);
   }

}