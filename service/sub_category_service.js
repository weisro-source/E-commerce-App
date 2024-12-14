const mongoose = require('mongoose');
const slugify = require('slugify')
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');

const SubCategory = require('../models/sub_category');

const ApiError = require('../utils/ApiError');

const ApiFeatures = require('../utils/api_features');

const factory = require('./handlers_factory');

exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();

};

exports.setFilterObject = (req, res, next) => {
    let filterObject = {};

    if (req.params.categoryId)
        filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
    console.log(filterObject);
    next();

};
// @ dec create  sub categories
// @ route '/api/v1/subcategory
// @ access private 
exports.createSubCategory = factory.createOne(SubCategory);
// @ dec get list of sub categories
// @ route '/api/v1/subcategory
// @ access Public 
exports.getSubCategories = asyncHandler(async (req, res, next) => {
    const countOfDocuments = await SubCategory.countDocuments();
    const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
        .search()
        .filter()
        .sort()
        .limitFields()
        .paginate(countOfDocuments);

    const { mongooseQuery, paginationResult } = apiFeatures;

    const subcategories = await mongooseQuery;
    res.status(200).json({ result: subcategories.length, paginationResult, data: subcategories });

});
// @ dec get specific subcategory
// @ route /api/v1/subcategory/:id
// @ public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
        return next(new ApiError(`No Sub Category for this ${id}`, 404));
    }
    res.status(200).json({ data: subCategory });
});
// @ dec update  sub categories
// @ route '/api/v1/subcategory/id
// @ access private 
exports.updateSubCategory = factory.updateOne(SubCategory);
// @ dec delete  sub categories
// @ route '/api/v1/subcategory
// @ access private 
exports.deleteSubCategory = factory.deleteOne(SubCategory);
// @ dec delete all categories
// @ route '/api/v1/subcategory
// @ access private 
exports.deleteSubCategories = asyncHandler(async (req, res, next) => {
    await SubCategory.deleteMany();
    res.status(204).send();

});