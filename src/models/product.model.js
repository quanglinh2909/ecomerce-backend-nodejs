const { Schema, model } = require('mongoose'); // Erase if already required
const slugify = require('slugify');
const DOCUMENT_NAME = 'Product'; // Đặt tên cho collection
const COLLECTION_NAME = 'Products'; // Đặt tên cho collection
// Declare the Schema of the Mongo model
var productSchema = new Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        producr_description: String,
        product_slug: String,
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ['Electronic', 'Clothing', 'Furniture']
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: { type: Schema.Types.Mixed, required: true },

        product_ratings_average: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating must be at most 5'],
            set: value => Math.round(value * 10) / 10
        },
        product_variations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);
//create index for search
productSchema.index({ product_name: 'text', producr_description: 'text' });
//document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// define the product type = clothing
const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
    },
    {
        timestamps: true,
        collection: 'Clothes'
    }
);

// define the product type = electronic
const electronicSchema = new Schema(
    {
        manufacture: { type: String, required: true },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
    },
    {
        timestamps: true,
        collection: 'Electronics'
    }
);

const furnitureSchema = new Schema(
    {
        manufacture: { type: String, required: true },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
    },
    {
        timestamps: true,
        collection: 'Furnitures'
    }
);

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
};
