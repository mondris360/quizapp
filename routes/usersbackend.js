const express =  require("express");
const router = express.Router();
const indexController = require("../controllers/backend/index");
const createQuizController = require("../controllers/backend/createquiz");


router.get("/", (req, res) =>{
    // get the appropriate controller
    indexController.getPage(req, res);
});

router.get("/createquiz", (req, res) =>{
    createQuizController.getPage(req, res);
})



// export the router object
module.exports = router;