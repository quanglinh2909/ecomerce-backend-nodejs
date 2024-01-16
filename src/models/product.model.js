const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Product"; // Đặt tên cho collection
const COLLECTION_NAME = "Products"; // Đặt tên cho collection
// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    producr_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);

// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacture: { type: String, required: true },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
};
