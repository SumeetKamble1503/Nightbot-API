const express = require("express");
const router = express.Router();

// Import the controller
const quotesController = require("../controllers/quotesController");

// Example route for getting a list of users
router.get("/get-random-quote", quotesController.getRandomQuote);

// Example route for getting a single user by ID
router.get("/add-quote", quotesController.addQuote);

module.exports = router;
