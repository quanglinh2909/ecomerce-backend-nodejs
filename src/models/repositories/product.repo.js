const { product, clothing, electronic, furniture } = require('../../models/product.model');
const { unGetSelectData, getSelectData } = require('../../utils/index');
const findAllForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await product
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const resutl = await product
        .find(
            {
                isPublished: true,
                $text: { $search: regexSearch }
            },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    return resutl;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    const total = await product.countDocuments(filter);
    const totalPage = Math.ceil(total / limit);
    return {
        products,
        total,
        totalPage
    };
};

const findProduct = async ({ product_id, unSelect }) => {
    const result = await product.findById(product_id).select(unGetSelectData(unSelect)).lean();
    return result;
};

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    return await model.findOneAndUpdate({ productId }, bodyUpdate, { new: isNew });
};

const publicshProductByShop = async ({ product_id, product_shop }) => {
    const result = await product.findOneAndUpdate({ _id: product_id, product_shop });
    console.log(result);
    if (!result) throw new NotFoundExeption('Product not found');
    result.isPublished = true;
    result.isDraft = false;
    const { modifiedCount } = await result.updateOne(result);
    return modifiedCount;
};
const unpublicshProductByShop = async ({ product_id, product_shop }) => {
    const result = await product.findOneAndUpdate({ _id: product_id, product_shop });
    console.log(result);
    if (!result) throw new NotFoundExeption('Product not found');
    result.isPublished = false;
    result.isDraft = true;
    const { modifiedCount } = await result.updateOne(result);
    return modifiedCount;
};

module.exports = {
    findAllForShop,
    publicshProductByShop,
    unpublicshProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
};
