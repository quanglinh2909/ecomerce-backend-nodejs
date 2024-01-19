const { listNotiByUser } = require('../services/notification.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');
class NotificationController {
    async listNotiByUser(req, res, next) {
        new OK({
            message: 'Lấy danh sách thông báo thành công',
            metadata: await listNotiByUser(req.query)
        }).send(res);
    }
}
module.exports = new NotificationController();
