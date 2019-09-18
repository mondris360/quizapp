const express =  require("express");
const router = express.Router();
const indexController = require("../controllers/backend/index");
const createQuizController = require("../controllers/backend/createquiz");
const viewquizzesController = require("../controllers/backend/viewquizzes");
const viewquizController = require("../controllers/backend/viewquiz");
const editQuestionController = require("../controllers/backend/editquestion");


router.get("/", (req, res) =>{
    // get the appropriate controller
    indexController.getPage(req, res);
});

router.get("/createquiz", (req, res) =>{
    createQuizController.getPage(req, res);
});

router.post("/createquiz", (req, res) =>{
    createQuizController.postPage(req, res);
});

router.get("/viewquizzes", (req, res) =>{
    viewquizzesController.getPage(req, res);
});

router.post("/viewquizzes", (req, res) =>{
    viewquizzesController.postPage(req, res);
});

router.get("/deletequiz/:id", (req, res) =>{
    viewquizzesController.delete(req, res);
});

// view single quiz
router.get("/viewquiz/:id", (req, res) =>{
    viewquizController.getPage(req, res);
});

// route to edit quiz question
router.get("/editquestion/:id", (req, res) =>{
    editQuestionController.getPage(req, res);
});

router.post("/editquestion/:id", (req, res) =>{
    editQuestionController.postPage(req, res);
});


// export the router object
module.exports = router;