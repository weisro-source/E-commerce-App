const express = require('express');
require('mongoose');
const { createSubCategory, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory, deleteSubCategories, setCategoryIdToBody, setFilterObject } = require('../service/sub_category_service');

const { createSubCategoryValidator, getSubCategoryValidator, deleteSubCategoryValidator, updateSubCategoryValidator } = require("../validators/sub_category_validator");
// mergeParams allow us access prams in other route
// 🔅 ex:we need to access category Id from category Router
const router = express.Router({ mergeParams: true });
router.route('/').post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory).get(setFilterObject, getSubCategories).delete(deleteSubCategories);
router.route('/:id').get(getSubCategoryValidator, getSubCategory).delete(deleteSubCategoryValidator, deleteSubCategory).put(updateSubCategoryValidator, updateSubCategory);
// module.exports = router;
module.exports = router;

