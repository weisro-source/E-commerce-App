const express = require('express');
const {
    getProducts,
    createProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    resizedProductImage,
    uploadProductImages

} = require('../service/products_service');  // Correct path to service

// Corrected name for the validation middleware import
const { createProductValidator } = require("../validators/productValidator");
const authService = require('../service/auth_services');
const router = express.Router({ mergeParams: true });

// Routes for handling products
router.route('/')
    .get(authService.protect, authService.allowedTo('admin'), getProducts)                // Retrieve all products
    .post(
        uploadProductImages,
        resizedProductImage,
        createProductValidator,
        createProduct);  // Use correct validator name to create a new product

router.route('/:id')
    .get(getOneProduct)              // Retrieve a single product by ID
    .put(
        uploadProductImages,
        resizedProductImage,
        updateProduct)          // Update a product
    .delete(deleteProduct);          // Delete a product

router.route('/deleteAll')
    .delete(deleteAllProducts);      // Delete all products

module.exports = router;
