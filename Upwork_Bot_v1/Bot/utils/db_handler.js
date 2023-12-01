import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const dbName = "upwork";

const client = new MongoClient(MONGO_URI);

const connect = async (collectionName) => {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  return collection;
};

export const addUser = async (email, name, status, type, token) => {
  return connect(name)
    .then(async (collection) => {
      await collection.insertOne({
        email: email,
        name: name,
        status: status || "active",
        type: type || "fake-mail",
        token: token,
        createdAt: new Date(),
      });
      console.log("added user: ", email);
    })
    .catch((err) => {
      console.log("error adding user: ", err);
    })
    .finally(() => {
      client.close();
    });
};

export const getActiveUser = async (collectionName) => {
  return connect(collectionName)
    .then(async (collection) => {
      const result = await collection.findOne({ status: "active" });
      return result;
    })
    .catch((err) => {
      console.log("error getting active user: ", err);
      return null;
    })
    .finally(() => {
      client.close();
    });
};

export const updateStatus = async (collectionName, email, status = "sent") => {
  return connect(collectionName)
    .then(async (collection) => {
      await collection.updateOne(
        { email: email },
        { $set: { status: status } }
      );
      console.log(`updated status: ${status} for user: ${email}`);
    })
    .catch((err) => {
      console.log("error updating status: ", err);
    })
    .finally(() => {
      client.close();
    });
};

export const deleteUser = async (collectionName, email) => {
  return connect(collectionName)
    .then(async (collection) => {
      await collection.deleteOne({ email: email });
      console.log("deleted user: ", email);
    })
    .catch((err) => {
      console.log("error deleting user: ", err);
    })
    .finally(() => {
      client.close();
    });
};

export const deleteMany = async (collectionName, count) => {
  return connect(collectionName)
    .then(async (collection) => {
      let result = await collection
        .find({ status: "active" })
        .limit(count)
        .toArray();
      let userids = result.map((user) => user._id);

      await collection.deleteMany({ _id: { $in: userids } });
      console.log(`deleted ${count} users`);
    })
    .catch((err) => {
      console.log("error deleting users: ", err);
    })
    .finally(() => {
      client.close();
    });
};
