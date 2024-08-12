const MongoManager = require("../utils/mongoManager");

const randomFunction = (length) => {
  return Math.floor(Math.random() * length);
};
exports.getRandomQuote = async (req, res) => {
  try {
    const mongo_core_workspace_db = new MongoManager("cyano");
    await mongo_core_workspace_db.init();
    let x = await mongo_core_workspace_db.find_many(
      "quotes",
      { last_used: false },
      {}
    );
    console.log("first find query", x);
    if (x.length === 0) {
      console.log("updating all quotes");
      await mongo_core_workspace_db.update_many(
        "quotes",
        {},
        { last_used: false }
      );
      x = await mongo_core_workspace_db.find_many(
        "quotes",
        { last_used: false },
        {}
      );
      console.log("second find query", x);
    }
    console.log(x);
    // get a random quote from this array
    let randomQuote = x[Math.floor(Math.random() * x.length)];
    await mongo_core_workspace_db.update_one(
      "quotes",
      { id: randomQuote.id },
      { last_used: true }
    );
    res.status(200).send(`${randomQuote.quote} - Cyano ${randomQuote.date}`);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error ~ Sasta server Quote");
  }
};

// long short mapping
const mapping = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "July",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

const getDateString = async () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day} ${mapping[month]} ${year}`;
};

exports.addQuote = async (req, res) => {
  try {
    let x = await getDateString();
    console.log(x);
    console.log(req.query);
    const crypto = require("crypto");
    const id = crypto.randomBytes(16).toString("hex");
    const quote = req.query.quote;
    let quoteObj = {
      id: `random_${id}`,
      quote: quote,
      date: x,
      last_used: false,
    };
    const mongo_core_workspace_db = new MongoManager("cyano");
    await mongo_core_workspace_db.init();
    await mongo_core_workspace_db.insert_one("quotes", quoteObj);
    res.status(200).send("Quote added successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error ~ Sasta server Quote");
  }
};
