const express = require("express");
const { userRegister, userLogin, getUserImagePath, userVoteDetails, getUserVoteDetails, getUserMlaVoteDetails, getUserMpVoteDetails } = require("../Controllers/userController");
const Email = require("../Controllers/emailController")


const router = express.Router();

router.route("/register").post(userRegister); // Use multer to handle file upload
router.route("/login").post(userLogin);

router.route('/email').post(Email);

router.route('/get-image/:id').get(getUserImagePath);

router.route('/vote').post(userVoteDetails);

router.route('/vote/mla/:id').get(getUserMlaVoteDetails);
router.route('/vote/mp/:id').get(getUserMpVoteDetails);

module.exports = router;
