// this module contains the view score controllers
//DEPENDENCIES
const mysql =  require("../../models/database");

exports.getPage = async(req, res) => {
    let quizID = req.params.quizID;
    let firstName = req.session.user.firstName;
    try {
        let sql = `SELECT quizscores.playerID, quizscores.quizID, quizscores.playerscore, 
        quizscores.quizScore, quizscores.date, players.firstName, players.lastName
        FROM players
        INNER JOIN
        quizscores ON quizscores.playerID =  players.playerID`
        let query =  await mysql.query(sql);
        let result = query[0];
        res.render("backend/viewscores", {result, firstName});

    }catch(err){
        // will handle this properly
        console.log(err);
        res.status(500)
        res.send("an error occured. Please try again again")
    }
}