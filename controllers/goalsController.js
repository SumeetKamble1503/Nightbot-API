const MongoManager = require("../utils/mongoManager");

exports.getAllGoals = async (req, res) => {
  try {
    let returnstring = "Goals: \n";
    const mongo_core_workspace_db = new MongoManager("cyano");
    await mongo_core_workspace_db.init();
    let x = await mongo_core_workspace_db.find_many("goals", {}, {});

    if (x.length === 0) {
      return res.status(200).send(`No goals found`);
    } else {
      for (let i = 0; i < x.length; i++) {
        returnstring += `${x[i].goal_description} : ${x[i].current_donation} / ${x[i].donation_goal} \n Product: ${x[i].product} \n\n`;
      }
    }
    return res.status(200).send(returnstring);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server Error ~ Sasta server Quote");
  }
};

exports.getSpecficGoal = async (req, res) => {
  try {
    const mongo_core_workspace_db = new MongoManager("cyano");
    await mongo_core_workspace_db.init();
    let query = req.query.query;
    let returnstring = `Goals: ${query}\n`;
    let x = await mongo_core_workspace_db.find_many(
      "goals",
      {
        $or: [
          { goal_description: { $regex: query, $options: "i" } },
          { product: { $regex: query, $options: "i" } },
        ],
      },
      {}
    );
    if (x.length === 0) {
      return res.status(200).send("No goals found");
    } else {
      for (let i = 0; i < x.length; i++) {
        returnstring += `${x[i].goal_description} : ${x[i].current_donation} / ${x[i].donation_goal} \n Product decided: ${x[i].product} \n\n`;
      }
    }
    return res.status(200).send(returnstring);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server Error ~ Sasta server Quote");
  }
};

exports.addGoal = async (req, res) => {
  try {
    const crypto = require("crypto");
    const id = crypto.randomBytes(16).toString("hex");
    let query = req.query.query;
    // split the query sting and form goal object
    let queryArray = query.split(",");
    let goalObj = {
      id: `random_${id}`,
      goal_description: queryArray[0],
      donation_goal: queryArray[1],
      current_donation: 0,
      product: queryArray[2],
    };
    // convert donation goal and current donation to integer
    goalObj.donation_goal = parseInt(goalObj.donation_goal);
    goalObj.current_donation = parseInt(goalObj.current_donation);

    const mongo_core_workspace_db = new MongoManager("cyano");
    await mongo_core_workspace_db.init();
    await mongo_core_workspace_db.insert_one("goals", goalObj);
    return res.status(200).send("Goal added successfully");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server Error ~ Sasta server Quote");
  }
};

exports.updateGoal = async (req, res) => {
  try {
    let query = req.query.query;
    let queryArray = query.split(",");
    let searchQuery = queryArray[0];
    let increment_value = parseInt(queryArray[1]);
    const mongo_core_workspace_db = new MongoManager("cyano");
    await mongo_core_workspace_db.init();
    let goal = await mongo_core_workspace_db.find_one("goals", {
      $or: [
        { goal_description: { $regex: searchQuery, $options: "i" } },
        { product: { $regex: searchQuery, $options: "i" } },
      ],
    });
    if (goal === null) {
      return res.status(200).send("No goals found");
    } else {
      goal.current_donation += increment_value;
    }
    await mongo_core_workspace_db.update_one(
      "goals",
      { id: goal.id },
      { current_donation: goal.current_donation }
    );
    return res.status(200).send("Goal updated successfully");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server Error ~ Sasta server Quote");
  }
};
