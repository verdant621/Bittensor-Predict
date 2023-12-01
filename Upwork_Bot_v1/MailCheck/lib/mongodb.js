import { MongoClient } from "mongodb";
class Database {
  constructor(uri) {
    this.client = new MongoClient(uri);
    this.dbName = "upwork";
  }
  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error("[ERR] ", error);
    }
  }
  async get(collectionName, filter, options = {}) {
    const db = this.client.db(this.dbName);
    const collection = db.collection(collectionName);
    let query;
    try {
      query = collection.find(filter);
      if (options.limit) query = query.limit(options.limit);
      const docs = await query.toArray();
      return docs;
    } catch (e) {
      console.error("[ERR] ", e);
    }
  }
  async create(collectionName, document) {
    const db = this.client.db(this.dbName);
    const collection = db.collection(collectionName);
    try {
      const doc = await collection.insertOne({
        ...document,
        createdAt: new Date(),
      });
      return doc;
    } catch (e) {
      console.error("[ERR] ", e);
    }
  }
  async update(collectionName, filter, document) {
    const db = this.client.db(this.dbName);
    const collection = db.collection(collectionName);
    try {
      const result = await collection.updateMany(
        filter,
        { $set: document },
        { upsert: true }
      );
      return result;
    } catch (e) {
      console.error("[ERR] ", e);
    }
  }
  async delete(collectionName, filter) {
    const db = this.client.db(this.dbName);
    const collection = db.collection(collectionName);
    try {
      const result = await collection.deleteMany(filter);
      return result;
    } catch (e) {
      console.error("[ERR] ", e);
    }
  }
  async close() {
    await this.client.close();
  }
}
export default Database;
