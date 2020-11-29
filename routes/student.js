const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const { checkUser, authRequire } = require("../middleware/authMiddlware");

router.get("/register", authController.register_get);

router.post("/register", authController.register_post);


router.get("/login", authController.login_get);

router.post("/login", authController.login_post);

router.get("/logout", authController.get_student_logout);



router.get('*', checkUser);
router.post('*', checkUser);


router.get("/studentdashboard", authRequire, authController.get_student_dashboard);
router.get("/payment", authController.get_student_fee_payment);
router.get("/basicinfo", authController.get_student_basic_details);
router.post("/basicinfo", authController.post_student_basic_details);
router.post("/pay_fee", authController.fee_pay_details);
router.get("/download_fee_receipt", authController.download_fee_receipts);


module.exports = router;