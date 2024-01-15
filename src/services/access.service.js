const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getInfodata } = require("../utils");
//neu dung that nen bo bang ma so hoa
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static async signUp({ name, email, password }) {
    try {
      //step1: check email exist
      const existingShop = await shopModel.findOne({ email }).lean();

      if (existingShop) {
        return {
          code: "400",
          message: "Email đã tồn tại",
          status: "error",
        };
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
          return {
            code: "400",
            message: "Tạo public key thất bại",
            status: "error",
          };
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
          code: "200",
          message: "Đăng ký thành công",
          status: "success",
          metadata: {
            tokens,
            shop: getInfodata({
              fileds: ["_id", "name", "email"],
              object: newShop,
            }),
          },
        };
      }
      return {
        code: "400",
        message: "Đăng ký thất bại",
        status: "error",
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = AccessService;
