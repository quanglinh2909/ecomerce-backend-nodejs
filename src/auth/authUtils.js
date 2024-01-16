const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const {
  UnauthorizedException,
  NotFoundExeption,
} = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
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

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1 - check userId missing ??
  2 - get accessToken
  3 - verify accessToken
  4 - check user in db
  5 - check keyStore with this userID?
  6 - oK all => return next()
  */

  //1.
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new UnauthorizedException("Invalid Request");
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new UnauthorizedException("Invalid Request");
  //2.
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundExeption("not found keyStore");

  try {
    const decoded = await JWT.verify(accessToken, keyStore.publicKey);

    if (userId !== decoded.userId)
      throw new UnauthorizedException("Invalid UserID");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw new UnauthorizedException("Invalid Request");
  }
});

const verifyJWT = async (token, keySecret) => {
  try {
    const decoded = await JWT.verify(token, keySecret);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
