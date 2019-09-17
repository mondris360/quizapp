// this module contains the create quiz controllers

exports.getPage = (req, res) => {
    
    let message = "none";
    let messageColor =  "red";
    let balance = 1000;
    let lastDeposit = 0;
    res.status(200);
    res.render("backend/createquiz", {message, messageColor, balance, lastDeposit})
}