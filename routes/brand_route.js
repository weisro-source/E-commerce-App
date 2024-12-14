const express = require('express');
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('../validators/brands_validator');


const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage

} = require('../service/brand_service');

const router = express.Router();

router
    .route('/')
    .get(getBrands)
    .post(uploadBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand
    );
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        updateBrandValidator,
        updateBrand
    )
    .delete(
        deleteBrandValidator,
        deleteBrand
    );

module.exports = router;
