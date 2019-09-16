// this module contains all the frontend routes

//DEPENDENCIES
const express =  require("express");
const router = express.Router();
const indexController = require("../controllers/frontend/index");
const signupController = require("../controllers/frontend/signup");
const loginController = require("../controllers/frontend/login");

// home  page routes
router.get("/", (req, res) =>{
    indexController.getPage(req, res);
});
// sign up routes
router.get("/signup", (req, res) =>{
    signupController.getPage(req, res);
});

router.post("/signup", (req, res) =>{
    signupController.postPage(req, res);
});

// login routes
router.get("/login", (req, res) =>{
    loginController.getPage(req, res);
})






// export the router
module.exports = router;