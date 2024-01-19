const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Discount'; // Đặt tên cho collection
const COLLECTION_NAME = 'Discounts'; // Đặt tên cho collection
// Declare the Schema of the Mongo model
var discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, default: 'fixed_anount', enum: ['fixed_anount', 'percenttage'] },
        discount_value: { type: Number, required: true },
        discount_code: { type: String, required: true },
        discount_start_date: { type: Date, required: true },
        discount_end_date: { type: Date, required: true },
        discount_max_use: { type: Number, required: true },
        discount_uses_count: { type: Number, required: true }, // so discount da su dung
        discount_users_used: { type: Array, default: [] }, // user da su dung discount
        discount_max_uses_pre_user: { type: Number, required: true }, // so lan discount duoc su dung cho 1 user
        discount_min_order_value: { type: Number, required: true },
        discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        discount_isActive: { type: Boolean, default: true },
        discount_applies_to: { type: String, default: 'all', enum: ['all', 'specific'] },
        discount_product_ids: { type: Array, default: [] } // danh sach product duoc ap dung discount
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
