const express = require("express");
const router = express.Router();
const { checkAdmin } = require("../middleware/authMiddlware");
const authController = require("../controllers/authControllers");

router.get("/login", (req, res) => {
    res.render("admin");
});


router.get("/admindashboard",checkAdmin, (req, res) => {
    res.render("admin_dashboard");
});

router.post("/login", authController.admin_login_post);
router.get("/logout", authController.get_admin_logout);
router.get("/approve_scholarship",checkAdmin,authController.get_student_applied_for_scholarship);
router.get("/handle_scholarship/:id",authController.handle_students_scholarship);
router.post("/approvescholarship",authController.approve_scholarship);

module.exports = router;