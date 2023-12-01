import Database from "./lib/mongodb.js";
export const saveAccount = async ({ email, name, status, type, botName }) => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const doc = await db.create("hayate-accounts", {
    email,
    name,
    status,
    type,
    botName,
  });
  await db.close();

  return doc;
};
export const getAccounts = async () => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const docs = await db.get(
    "hayate-accounts",
    {
      status: "active",
    },
    { limit: 1 }
  );
  await db.close();
  return docs;
};
export const deleteAccount = async ({ email }) => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const result = await db.delete("hayate-accounts", {
    email,
  });
  await db.close();
  return docs;
};
export const updateAccount = async ({ email }) => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const result = await db.update(
    "hayate-accounts",
    { email },
    { status: "sent" }
  );
  await db.close();
  return docs;
};
export const findMMails = async () => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const docs = await db.get("hayate-accounts", {
    status: "sent",
    type: "minutebox",
  });
  await db.close();
  return docs;
};
export const saveNotification = async (id) => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const docs = await db.create("hayate-notifications", { _id: id });
  await db.close();
  return docs;
};
export const isNewNotification = async (id) => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const docs = await db.get("hayate-notifications", { _id: id });
  await db.close();
  return docs;
};
