// this module contains the users dashboard  index controllers

exports.getPage = async(req, res) => {
    let message = "none";
    let messageColor =  "red";
    let balance = 1000;
    let lastDeposit = 0
    res.render("backend/index", {message, messageColor, balance, lastDeposit})
}