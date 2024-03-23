const router = require('express').Router();
const { adminregistration,loginAdmin,createNewMatch,createNewContest,getAllMatchUpcomming} = require('../controllers/adminController')


router.post("/adminregistration", adminregistration);
router.post("/loginAdmin", loginAdmin);
router.post("/createNewMatch", createNewMatch);
router.post("/createNewContest/:id", createNewContest);
router.get("/getAllMatchUpcomming", getAllMatchUpcomming);


module.exports = router;