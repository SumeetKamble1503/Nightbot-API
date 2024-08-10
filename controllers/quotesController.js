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

exports.addQuote = async (req, res) => {};
