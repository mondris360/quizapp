
// this module contains the login controller


exports.getPage = (req, res) =>{
    res.render("frontend/signup")
}


exports.postPage = (req, res) =>{
    console.log("hi")
    console.log(req.body)
}