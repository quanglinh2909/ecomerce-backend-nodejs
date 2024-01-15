const keyTokenModel = require("../models/keytoken.model");
class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
      const token = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return token ? token.publicKey : null;
    } catch (error) {
      console.log("KeyTokenService::createKeyToken::error", error);
      return error;
    }
  }
}

module.exports = KeyTokenService;
