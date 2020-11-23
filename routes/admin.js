const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/login", (req, res) => {
    res.json({
        "Posted ": "true"
    });

});
router.get("/login", (req, res) => {
    res.render("admin");
});

module.exports = router;