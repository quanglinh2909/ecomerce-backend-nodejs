const { findById } = require("..//services/apikey.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const Key = req.headers[HEADER.API_KEY]?.toString();
    if (!Key) {
      return res.status(403).json({
        code: 403,
        message: "Forbidden Error",
        status: "error",
      });
    }
    //check object key
    const objectKey = await findById(Key);
    if (!objectKey) {
      return res.status(403).json({
        code: 403,
        message: "Forbidden Error",
        status: "error",
      });
    }
    req.objKey = objectKey;
    return next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({
      code: 403,
      message: "Forbidden Error 1",
      status: "error",
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    const { objKey } = req;
    if (!objKey.permissions) {
      return res.status(403).json({
        code: 403,
        message: "Premission dinied 1",
        status: "error",
      });
    }
    console.log("permission", objKey.permission);
    const valid = objKey.permissions.includes(permission);
    if (!valid) {
      return res.status(403).json({
        code: 403,
        message: "Premission dinied",
        status: "error",
      });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
