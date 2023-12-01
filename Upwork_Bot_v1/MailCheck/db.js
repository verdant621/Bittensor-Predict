// import Database from './lib/mongodb.js'
export class FakeMail {
  constructor(db) {
    this.db = db;
  }
  async getAll() {
    const docs = await this.db.get("hayate-accounts", {
      status: { $ne: "active" },
      type: "fake-mail",
    });
    return docs;
  }
  async saveNotification(id) {
    const docs = await this.db.create("notifications", { id });
    return docs;
  }
  async isNewNotification(id) {
    const docs = await this.db.get("notifications", { id });
    return docs;
  }
}
