const express = require('express');
const ServiceAuth = require('../service/auth_services');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require('../validators/categoryValidator');

const {
    getAllCategory,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    resizeImage,
    uploadCategoryImage
} = require('../service/category_services');


const subcategoriesRoute = require('./sub_category_route');

const router = express.Router();

// Nested route
router.use('/:categoryId/subcategories', subcategoriesRoute);

router
    .route('/')
    .get(ServiceAuth.protect, getAllCategory)
    .post(
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );
router
    .route('/:id')
    .get(getCategoryValidator, getOneCategory)
    .put(
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        deleteCategoryValidator,
        deleteCategory
    );

module.exports = router;
