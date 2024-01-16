const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  async signUp(req, res, next) {
    // return res.status(200).json(await AccessService.signUp(req.body));
    new CREATED({
      message: "Đăng ký thành công",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  }
  async signIn(req, res, next) {
    new OK({
      message: "Đăng nhập thành công",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  }
  async logout(req, res, next) {
    new OK({
      message: "Đăng xuất thành công",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }
  async handleRefreshToken(req, res, next) {
    new OK({
      message: "Refresh Token thành công",
      metadata: await AccessService.handleRefreshToken(req.body?.refreshToken),
    }).send(res);
  }
}
module.exports = new AccessController();
