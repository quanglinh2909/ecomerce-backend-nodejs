const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Inventory'; // Đặt tên cho collection
const COLLECTION_NAME = 'Inventories'; // Đặt tên cho collection
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        inven_location: { type: String, required: true },
        inven_stock: { type: Number, required: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        inven_reservations: { type: Array, default: [] }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
