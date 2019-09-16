const express =  require("express");
const router = express.Router();
const indexController = require("../controllers/backend/index");



router.get("/", (req, res) =>{
    // get the appropriate controller
    indexController.getPage(req, res);
})



// export the router object
module.exports = router;