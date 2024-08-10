const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();

const mongo_uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

class MongoManager {
  constructor(dbname) {
    this.mongo_uri = null;
    this.mongo_client = null;
    this.workspace_mongo_uri = null;
    this.workspace_id = dbname;
  }

  async init() {
    if (this.workspace_id == "geta_core") {
      this.mongo_uri = mongo_uri;
      this.mongo_client = new MongoClient(mongo_uri);
    } else {
      await this.get_workspace_dbhost(this.workspace_id, false);
    }
  }

  async get_workspace_dbhost(workspace_id, cache = false) {
    let data = {};
    const mongoClient = new MongoClient(mongo_uri);

    try {
      await mongoClient.connect();
      const mongodb = mongoClient.db("geta_core");
      data = await mongodb
        .collection("workspace")
        .findOne(
          { workspace_id: workspace_id },
          { projection: { mongo_uri: 1, _id: 0 } }
        );
      this.mongo_uri = data?.mongo_uri;
      if (this.mongo_uri) {
        this.mongo_uri = this.mongo_uri;
      } else {
        this.mongo_uri = mongo_uri;
      }
    } catch (e) {
      console.error(e);
    } finally {
      await mongoClient.close();
    }
  }

  async find_one(collection_name, query, fields, sort_key = null) {
    let data = {};
    const mongoClient = new MongoClient(this.mongo_uri);
    try {
      await mongoClient.connect();
      const mongodb = mongoClient.db(this.workspace_id);
      if (sort_key) {
        data = await mongodb
          .collection(collection_name)
          .findOne(query, { sort: sort_key, projection: fields });
      } else {
        data = await mongodb
          .collection(collection_name)
          .findOne(query, { projection: fields });
      }
    } catch (error) {
      console.error(error);
    } finally {
      await mongoClient.close();
    }
    return data;
  }

  async find_many(collection_name, query, fields, sort_key) {
    let data = {};
    const mongoClient = new MongoClient(this.mongo_uri);
    try {
      await mongoClient.connect();
      const mongodb = mongoClient.db(this.workspace_id);
      if (sort_key) {
        data = await mongodb
          .collection(collection_name)
          .find(query, { sort: sort_key, projection: fields })
          .toArray();
      } else {
        data = await mongodb
          .collection(collection_name)
          .find(query, { projection: fields })
          .toArray();
      }
    } catch (e) {
      console.log(e);
    } finally {
      await mongoClient.close();
    }
    return data;
  }

  async insert_one(collectionName, requestData) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);

      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        await mongodb.collection(collectionName).insertOne(requestData);
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async insert_many(collectionName, requestData) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);
      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        await mongodb.collection(collectionName).insertMany(requestData);
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async increment_value(collection_name, query, update_data) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);
      let data = true;
      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        await mongodb
          .collection(collection_name)
          .updateOne(query, { $inc: update_data });
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async update_one(collection_name, query, update_data, upsert = false) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);
      let data = true;
      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        if (upsert == true) {
          await mongodb
            .collection(collection_name)
            .updateOne(query, { $set: update_data }, { upsert: true });
        } else {
          await mongodb
            .collection(collection_name)
            .updateOne(query, { $set: update_data });
        }
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async update_many(collection_name, query, update_data, upsert = false) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);
      let data = true;
      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        if (upsert == true) {
          await mongodb
            .collection(collection_name)
            .updateMany(query, { $set: update_data }, { upsert: true });
        } else {
          await mongodb
            .collection(collection_name)
            .updateMany(query, { $set: update_data });
        }
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async delete_one(collection_name, query) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);
      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        await mongodb.collection(collection_name).deleteOne(query);
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async delete_many(collection_name, query) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);
      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        await mongodb.collection(collection_name).deleteMany(query);
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }

  async count(collection_name, query) {
    let data = 0;
    const mongoClient = new MongoClient(this.mongo_uri);
    try {
      await mongoClient.connect();
      const mongodb = mongoClient.db(this.workspace_id);
      data = await mongodb.collection(collection_name).countDocuments(query);
    } catch (e) {
      console.log(e);
      return 0;
    } finally {
      await mongoClient.close();
    }
    return data;
  }

  async aggregate(collection_name, pipeline) {
    let data = [];
    const mongoClient = new MongoClient(this.mongo_uri);
    try {
      await mongoClient.connect();
      const mongodb = mongoClient.db(this.workspace_id);
      data = await mongodb
        .collection(collection_name)
        .aggregate(pipeline)
        .toArray();
    } catch (e) {
      console.log(e);
      return [];
    } finally {
      await mongoClient.close();
    }
    return data;
  }

  async distinct(collection_name, key, query) {
    let data = [];
    const mongoClient = new MongoClient(this.mongo_uri);
    try {
      await mongoClient.connect();
      const mongodb = mongoClient.db(this.workspace_id);
      data = await mongodb.collection(collection_name).distinct(key, query);
      data = data.toArray();
    } catch (e) {
      console.log(e);
      return [];
    } finally {
      await mongoClient.close();
    }
    return data;
  }

  async drop(collection_name) {
    return new Promise(async (resolve, reject) => {
      const mongoClient = new MongoClient(this.mongo_uri);

      try {
        await mongoClient.connect();
        const mongodb = mongoClient.db(this.workspace_id);
        await mongodb.collection(collection_name).drop();
        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      } finally {
        await mongoClient.close();
      }
    });
  }
}

module.exports = MongoManager;
