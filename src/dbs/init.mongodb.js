const {
  db: { host, port, name },
} = require("../configs/config.mongodb");
const mongoose = require("mongoose");
const username = "root";
const password = "1";
// ("mongodb://root:1@localhost:27017");
const connectString = `mongodb://${username}:${password}@${host}:${port}`;
console.log("Connect to mongodb with string: " + connectString);
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongo") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    switch (type) {
      case "mongo":
        mongoose
          .connect(connectString, {
            // maxPoolSize: 100,
            // minPoolSize: 10,
          })
          .then((_) => {
            console.log("Connect to mongodb successfully");
            // kiem tra so luong ket noi
            countConnect();
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      default:
        console.log("Database type is not supported");
        break;
    }
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
