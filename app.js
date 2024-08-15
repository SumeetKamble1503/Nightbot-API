const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
// import MongoManager from "./utils/mongoManager";
const MongoManager = require("./utils/mongoManager");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const commonApiEndpoint = "/api/v1";

// user routers
const quotesRouter = require("./routers/quotes");
const goalsRouter = require("./routers/goals");
app.use(`${commonApiEndpoint}/quotes`, quotesRouter);
app.use(`${commonApiEndpoint}/goals`, goalsRouter);

const port = 5000;
app.get("/health-check", async (req, res) => {
  // send status 200 and ok
  res.status(200).send("ok");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
