const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, pubKey, privKey) => {
  try {
    const accessToken = await JWT.sign(payload, pubKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privKey, {
      expiresIn: "7 days",
    });

    //
    JWT.verify(accessToken, pubKey, (err, decoded) => {
      if (err) {
        console.log("err verify accessToken", err);
      } else {
        console.log("decoded", decoded);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

module.exports = {
  createTokenPair,
};
