const MongoManager = require("../utils/mongoManager");

exports.getRandomQuote = async (req, res) => {
  const mongo_core_workspace_db = new MongoManager("cyano");
  await mongo_core_workspace_db.init();
  let x = await mongo_core_workspace_db.find_many(
    "quotes",
    { last_quote: false },
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
    { _id: randomQuote._id },
    { last_used: true }
  );
  res.status(200).json(randomQuote);
};

exports.addQuote = async (req, res) => {
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
};
