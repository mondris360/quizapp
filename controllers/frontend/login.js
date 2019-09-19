// this module contains the login controller


exports.getPage = (req, res) =>{
    let message = "";
    let messageColor = "red"
    res.render("frontend/login", {message, messageColor});
}

// handles the  login route post

exports.postPage = (req, res) => {
    console.log(req.body)
}