const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONSDS = 5000;
//count connection
const countConnect = () => {
  const numberConnection = mongoose.connections.length;
  console.log("Number connection: " + numberConnection);
};

// check over load
const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    //exmaple maximum number of connections based on number osf cores
    const maxNumberConnection = numCores * 5;

    console.log(`Activate connections:${numberConnection}`);
    console.log(`memory usage:${memoryUsage / 1024 / 1024} MB`);

    if (numberConnection > maxNumberConnection) {
      console.log("Server is overload");
      console.log("Number connection: " + numberConnection);
      console.log("Max number connection: " + maxNumberConnection);
      console.log("Memory usage: " + memoryUsage);
    }
  }, _SECONSDS);
};
module.exports = { countConnect, checkOverload };
