const apikeyModel = require("../models/apikey.model");
const crypto = require("node:crypto");
const findById = async (key) => {
  //   console.log("vào");
  // const newKey = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   status: true,
  //   permissions: ["0000"],
  // });
  // console.log("newKey", newKey);

  const objectKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objectKey;
};

module.exports = {
  findById,
};
