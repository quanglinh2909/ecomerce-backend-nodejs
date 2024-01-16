const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getInfodata } = require("../utils");
const {
  NotFoundExeption,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
//neu dung that nen bo bang ma so hoa
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static async signUp({ name, email, password }) {
    // try {
    //step1: check email exist
    const existingShop = await shopModel.findOne({ email }).lean();

    if (existingShop) {
      throw new BadRequestException("Email đã tồn tại");
    }
    //step2: hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    //step3: create new shop
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      role: [RoleShop.SHOP],
    });

    if (newShop) {
      //crate private key, public key
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // console.log("privateKey", privateKey);
      // console.log("publicKey", publicKey);
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestException("Đăng ký thất bại");
      }
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      return {
        tokens,
        shop: getInfodata({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
      };
    }
    throw new BadRequestException("Đăng ký thất bại");
  }
  /*
    1 -check email exist
    2 - compare password
    3 - create AccessToken, RefreshToken and save to db
    4 - return tokens
    5 - get data return login

   */
  static async signIn({ email, password, refreshToken = null }) {
    //1.
    const shop = await findByEmail(email);
    if (!shop) throw new NotFoundExeption("Email không tồn tại");
    //2.
    const isMatch = bcrypt.compareSync(password, shop.password);
    if (!isMatch) throw new UnauthorizedException("Mật khẩu không chính xác");
    //3.

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = shop;
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });

    return {
      tokens,
      shop: getInfodata({
        fileds: ["_id", "name", "email"],
        object: shop,
      }),
    };
  }

  static async logout(keyStore) {
    const delkey = await KeyTokenService.removeKeyById(keyStore._id);
    return delkey;
  }

  /*
   check this token used?
   
   */
  static handleRefreshToken = async (refreshToken) => {
    const keyStore = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (keyStore) {
      //decode xem laf ai
      const { userId, email } = await verifyJWT(
        refreshToken,
        keyStore.privateKey
      );
      console.log("userId", userId, "email", email);
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenException("Token đã được sử dụng");
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new UnauthorizedException("Token không tồn tại");
    }
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("userId 2: ", userId, "email 2:", email);

    //check userId
    const shop = await findByEmail(email);
    if (!shop) throw new NotFoundExeption("Email không tồn tại");
    // if (shop._id !== userId) throw new UnauthorizedException("Invalid UserID");
    //tao 1 cap token moi
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
