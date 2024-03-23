const router = require('express').Router();
const { registration,optSendtoNumber,otpVerify,joinContest,getMyContest,createTeam,
    getTeam} = require('../controllers/userController')


router.post("/registration", registration);
router.post("/optSendtoNumber", optSendtoNumber);
router.post("/otpVerify", otpVerify);
router.post("/joinContest/:id", joinContest);
router.post("/getMyContest/:id", getMyContest);
router.post("/createTeam/:id/:contest_id", createTeam);
router.post("/getTeam/:id/:contest_id", getTeam);


module.exports = router;