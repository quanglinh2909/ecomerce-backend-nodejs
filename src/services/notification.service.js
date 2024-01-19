const { NOTI } = require('../models/notification.model');
const pushNotiToSystem = async ({ type = 'SHOP-001', receivedId = 1, senderId = 1, options = {} }) => {
    let noti_content;
    if (type === 'SHOP-001') {
        noti_content = '@@@ đã đăng thêm sản phẩm mới: @@@@';
    } else if (type === 'ORDER-001') {
        noti_content = '@@@ vùa mới thêm một voucher : @@@@';
    }
    const newNoti = await NOTI.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receivedId,
        noti_content: noti_content,
        noti_options: options
    });

    return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
    const match = { noti_receiverId: userId };
    if (type !== 'ALL') match.noti_type = type;

    return await NOTI.aggregate([
        {
            $match: match
        },

        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: ['$noti_options.productName: ', 0, -1]
                        },
                        'Vừa mới thêm sản phẩm mới: ',
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        }
                    ]
                },
                createdAt: 1,
                noti_options: 1
            }
        }
    ]);
};

module.exports = {
    pushNotiToSystem,
    listNotiByUser
};
