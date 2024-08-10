const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;
app.get("/", (req, res) => {
  // conect to mongo
  // use MONGOURI form .env

  const mongoURI = process.env.MONGOURI;
  console.log(mongoURI);
  mongoose.connect(mongoURI);

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
    res.send("Connected");
  });
  res.send("Not connected");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
