//this module contains the view quizzes controllers
// DEPENDENCIES
const mysql =  require("../../models/database");

exports.getPage = async(req, res) =>{
    console.log("Welcome To View Quizzes");
    let total = 0;
    let lastDeposit = 1000;
    let firstName = "Mondris";
     try {
        let query = await mysql.query(`SELECT * FROM quiz WHERE userID = ?`, ["e33"]);
        let quizzes = query[0];
        res.status(200);
        res.render("backend/viewquizzes", {quizzes});
     }catch(err){
        console.log(err);
        res.status(500);
        
     }

}