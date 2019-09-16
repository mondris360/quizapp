// this module contains the login controller
//DEPENDENCIES
const mysql = require("../../models/database");


exports.getPage = (req, res) =>{
    res.render("frontend/signup")
}


exports.postPage = async(req, res) =>{
    let userDetails = {
        id:85475,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }

    try {
        const query = await mysql.query(`INSERT INTO users SET?`, userDetails);
    } catch(err){
        console.log(err);
    }
}