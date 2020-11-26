const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const { checkUser, authRequire } = require("../middleware/authMiddlware");

router.get("/register", authController.register_get);

router.post("/register", authController.register_post);


router.get("/login", authController.login_get);

router.post("/login", authController.login_post);

router.get('*', checkUser);


router.get("/studentdashboard", authRequire, authController.get_student_dashboard);
router.get("/logout", authController.get_student_logout);
router.get("/payment", authController.get_student_fee_payment);
router.get("/basicinfo", authController.get_student_basic_details);
router.post("/basicinfo", checkUser, authController.post_student_basic_details);


module.exports = router;