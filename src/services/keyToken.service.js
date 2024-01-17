const keyTokenModel = require('../models/keytoken.model');
class KeyTokenService {
    static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
        try {
            // const token = await keyTokenModel.create({
            //   user: userId,
            //   publicKey,
            //   privateKey,
            // });
            // console.log("userId", userId);
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken
                },
                options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            // console.log("KeyTokenService::createKeyToken::error", error);
            return error;
        }
    }
    static async findByUserId(userId) {
        const tokens = await keyTokenModel.findOne({
            user: userId
        });
        return tokens;
    }
    static async removeKeyById(id) {
        const tokens = await keyTokenModel.findByIdAndDelete(id);
        return tokens;
    }
    static async findByRefreshTokenUsed(refreshToken) {
        const tokens = await keyTokenModel
            .findOne({
                refreshTokensUsed: refreshToken
            })
            .lean();
        return tokens;
    }
    static async findByRefreshToken(refreshToken) {
        const tokens = await keyTokenModel.findOne({
            refreshToken
        });
        return tokens;
    }

    static async deleteKeyByUserId(userId) {
        const tokens = await keyTokenModel.deleteOne({
            user: userId
        });
        return tokens;
    }
}

module.exports = KeyTokenService;
