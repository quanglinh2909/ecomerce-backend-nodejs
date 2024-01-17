const { product, clothing, electronic, furniture } = require('../models/product.model');
const { NotFoundExeption, BadRequestException } = require('../core/error.response');
const {
    publicshProductByShop,
    findAllForShop,
    unpublicshProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo');
// define factory class to create product
class ProductFactory {
    // static async createProduct(type, payload) {
    //     switch (type) {
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct();
    //         case 'Electronic':
    //             return new Electronic(payload).createProduct();
    //         default:
    //             throw new BadRequestException('Product type not found');
    //     }
    // }
    static productRegistry = {};
    static registerProduct(type, product) {
        this.productRegistry[type] = product;
    }
    static createProduct(type, payload) {
        const Product = this.productRegistry[type];
        if (!Product) throw new BadRequestException('Product type not found');
        return new Product(payload).createProduct();
    }
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllForShop({ query, limit, skip });
    }
    static async publicshProductByShop({ product_id, product_shop }) {
        return await publicshProductByShop({ product_id, product_shop });
    }
    static async unpublicshProductByShop({ product_id, product_shop }) {
        return await unpublicshProductByShop({ product_id, product_shop });
    }
    static async findAllPublishedProduct({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllForShop({ query, limit, skip });
    }
    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['product_name', 'product_price', 'product_thumd']
        });
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] });
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        producr_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.producr_description = producr_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothong = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newClothong) throw new BadRequestException('Create clothing failed');

        const newProduct = await super.createProduct(newClothong._id);
        if (!newProduct) throw new BadRequestException('Create product failed');

        return newProduct;
    }

    async updateProduct(product_id) {
        const objectParams = this;
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate, model: clothing });
        }
        const updateProduct = await super.updateProduct(product_id, objectParams);
        return updateProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newElectronic) throw new BadRequestException('Create clothing failed');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestException('Create product failed');

        return newProduct;
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newFurniture) throw new BadRequestException('Create clothing failed');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestException('Create product failed');

        return newProduct;
    }
}

ProductFactory.registerProduct('Clothing', Clothing);
ProductFactory.registerProduct('Electronic', Electronic);
ProductFactory.registerProduct('Furniture', Furniture);

module.exports = ProductFactory;
