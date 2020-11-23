const express = require("express");
const router = express.Router();
const mysqlConnection = require("../connection");
const bcrypt = require("bcrypt");
const authController = require("../controllers/authControllers");

router.get("/register", authController.register_get);

router.post("/register", authController.register_post);


router.get("/login", authController.login_get);

router.post("/login", authController.login_post);

router.get("/logout", (req, res) => {

    res.json({ "loggedout": true });

})

router.get("/studentdashboard", authController.get_student_dashboard);


module.exports = router;