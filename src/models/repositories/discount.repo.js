const { unGetSelectData, getInfodata } = require('../../utils');

const findAllDiscountCodesUnselect = async ({ limit = 50, page = 1, sort = 'ctime', filter, uSelect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const document = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(uSelect))
        .lean();

    return document;
};

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const document = await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(getInfodata(select)).lean();

    return document;
};

const checkDiscountExist = async (model, filter) => {
    return await model.findOne(filter);
};

module.exports = {
    findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    checkDiscountExist
};
