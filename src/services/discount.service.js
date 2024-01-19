const { BadRequestException, NotFoundExeption } = require('../core/error.response');
const discount = require('../models/discount.model');
const { findAllProducts } = require('../models/repositories/product.repo');
const { findAllDiscountCodesSelect, findAllDiscountCodesUnselect } = require('../models/repositories/discount.repo');

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_activate,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user
        } = payload;
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
            throw new BadRequestException('Start date or end date is invalid');

        if (new Date(start_date) > new Date(end_date))
            throw new BadRequestException('Start date must be before end date');

        //create index for discount code
        const foundDiscount = await discount.findOne({ discount_code: code, discount_shopId: shopId });
        if (foundDiscount && foundDiscount.discount_isActive)
            throw new BadRequestException('Discount code already exists');

        const newDiscount = new discount({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_uses,
            discount_max_value: max_value,
            discount_uses_count: uses_count,
            discount_max_uses_pre_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_isActive: is_activate,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        });
        await newDiscount.save();
    }

    static async updateDiscountCode(payload) {
        //some....
    }
    static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
        const foundDiscount = await discount.findOne({ discount_code: code, discount_shopId: shopId });
        if (!foundDiscount || !foundDiscount.discount_isActive) throw new NotFoundExeption('Discount code not found');

        const { discount_applies_to, discount_product_ids } = foundDiscount;

        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: { _id: { $in: discount_product_ids }, isPublished: true },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
            return products;
        }

        if (discount_applies_to === 'specific') {
        }
    }

    static async getAllDiscountCodeByShop({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodesUnselect({
            filter: { discount_shopId: shopId, discount_isActive: true },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            uSelect: ['discount_product_ids', '__v'],
            model: discount
        });
        return discounts;
    }
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await discount.findOne({ discount_code: codeId, discount_shopId: shopId });
        if (!foundDiscount || !foundDiscount.discount_isActive) throw new NotFoundExeption('Discount code not found');
        const {
            discount_isActive,
            discount_max_use,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_pre_user,
            discount_type
        } = foundDiscount;
        if (!discount_isActive) throw new BadRequestException('Discount code is not active');
        if (!discount_max_use) throw new BadRequestException('Discount code is expired');
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))
            throw new BadRequestException('Discount code is expired');

        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            totalOrder = products.redule((acc, product) => {
                return acc + product.product_price * product.product_quantity;
            }, 0);
            if (totalOrder < discount_min_order_value) throw new BadRequestException('Discount code is not valid');
        }

        const amout =
            discount_type === 'fixed_anount' ? foundDiscount.discount_value : totalOrder * foundDiscount.discount_value;
        return { amout, discount_max_uses_pre_user };
    }
}
