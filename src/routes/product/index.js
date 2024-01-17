const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get('/search/:keySearch', asyncHandler(productController.searchProducts));
router.get('/all', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));
// authentication
router.use(authentication);
router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.get('/drafts/all', asyncHandler(productController.findAllDraftForShop));
router.post('/publish/:id', asyncHandler(productController.publicshProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unpublicshProductByShop));
router.get('/published/all', asyncHandler(productController.findAllPublishedProduct));

module.exports = router;
