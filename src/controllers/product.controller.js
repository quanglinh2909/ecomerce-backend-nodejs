const ProductService = require('../services/product.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');
class ProductController {
    async createProduct(req, res, next) {
        console.log(req.user);
        new CREATED({
            message: 'Tạo sản phẩm thành công',
            metadata: await ProductService.createProduct(req?.body?.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }
    async findAllDraftForShop(req, res, next) {
        new OK({
            message: 'Lấy danh sách sản phẩm thành công',
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }
    async publicshProductByShop(req, res, next) {
        new OK({
            message: 'Publicsh sản phẩm thành công',
            metadata: await ProductService.publicshProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res);
    }
    async unpublicshProductByShop(req, res, next) {
        new OK({
            message: 'Publicsh sản phẩm thành công',
            metadata: await ProductService.unpublicshProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res);
    }
    async findAllPublishedProduct(req, res, next) {
        new OK({
            message: 'Lấy danh sách sản phẩm thành công',
            metadata: await ProductService.findAllPublishedProduct({
                product_shop: req.user.userId
            })
        }).send(res);
    }
    async searchProducts(req, res, next) {
        new OK({
            message: 'Lấy danh sách sản phẩm thành công',
            metadata: await ProductService.searchProducts({
                keySearch: req.params.keySearch
            })
        }).send(res);
    }

    async findAllProducts(req, res, next) {
        new OK({
            message: 'Lấy danh sách sản phẩm thành công',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }
    async findProduct(req, res, next) {
        new OK({
            message: 'Lấy danh sách sản phẩm thành công',
            metadata: await ProductService.findProduct({ product_id: req.params.product_id })
        }).send(res);
    }

    async updateProduct(req, res, next) {
        new OK({
            message: 'Cập nhật sản phẩm thành công',
            metadata: await ProductService.updateProduct(req?.body?.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }
}

module.exports = new ProductController();
