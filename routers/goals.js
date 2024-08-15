const express = require("express");
const router = express.Router();

// Import the controller
const goalsController = require("../controllers/goalsController");

router.get("/get-specific-goal", goalsController.getSpecficGoal);

router.get("/get-all-goals", goalsController.getAllGoals);

router.get("/add-goal", goalsController.addGoal);

router.get("/update-goal", goalsController.updateGoal);

module.exports = router;
