// const express = require('express');
// const mongoose = require('mongoose');
// const categoryService = require('../service/categoryService');
// const ApiError = require('../utils/ApiError');

// const router = express.Router();


// // eslint-disable-next-line import/order
// const { param, validationResult } = require('express-validator');

// const { getCategoryValidator } = require('../validators/categoryValidator');
// const { getSubCategories } = require('../service/sub_category_service');

// const SubCategoriesRoute = require('./sub_category_route');  // Correct import


// const handleError = (res, error) => {
//   if (error.code === 11000) {
//     return res.status(409).json({ success: false, message: 'Category name already exists' });
//   } if (error.message.includes('required') || error.message.includes('characters long')) {
//     return res.status(422).json({ success: false, message: error.message });
//   } if (error.message === 'Invalid category ID') {
//     return res.status(400).json({ success: false, message: error.message });
//   } if (error.message === 'Category not found') {
//     return res.status(404).json({ success: false, message: error.message });
//   }
//   return res.status(500).json({ success: false, message: 'Internal Server Error', details: error.message });
// };

// // Middleware to validate MongoDB ObjectId
// const validateObjectId = (req, res, next) => {
//   const { id } = req.params;
//   if (id && !mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ success: false, message: 'Invalid category ID' });
//   }
//   next();
// };

// // Apply the middleware for routes with :id parameter

// router.use('/category/:categoryId/subcategories', SubCategoriesRoute);

// router.post('/add-category', async (req, res) => {
//   try {
//     const { name, isActive } = req.body;
//     const newCategory = await categoryService.addCategory(name, isActive);
//     res.status(201).json({
//       success: true,
//       message: 'Category added successfully',
//       data: newCategory,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// router.get('/categories', async (req, res) => {
//   try {
//     const { page, limit } = req.query;

//     if (page && limit) {
//       const categories = await categoryService.getPaginatedCategories(page, limit);
//       res.status(200).json({
//         success: true,
//         message: 'Categories retrieved successfully',
//         result: categories.totalCount,
//         currentPage: categories.currentPage,
//         totalPages: categories.totalPages,
//         data: categories.categories,
//       });
//     } else {
//       const categories = await categoryService.getCategories(); // Fetch all categories if no pagination parameters are provided
//       res.status(200).json({
//         success: true,
//         message: 'All categories retrieved successfully',
//         result: categories.length,
//         data: categories,
//       });
//     }
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// router.get('/categories/:id',
//   param('id').isMongoId().withMessage("Invalid category id format"),

//   async (req, res, next) => {


//     try {
//       const { id } = req.params;
//       const category = await categoryService.getCategoryById(id);

//       if (!category) {
//         return next(new ApiError(`No Category found for id ${id}`, 404));
//       }

//       res.status(200).json({
//         success: true,
//         data: category,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );


// router.get('/active-category', async (req, res) => {
//   try {
//     const categories = await categoryService.getActiveCategories();
//     res.status(200).json({
//       success: true,
//       message: 'Active categories retrieved successfully',
//       data: categories,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// router.delete('/category/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await categoryService.deleteCategory(id);
//     res.status(200).json({
//       success: true,
//       message: 'Category deleted successfully',
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// router.put('/category/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, isActive } = req.body;
//     const updatedCategory = await categoryService.updateCategory(id, name, isActive);
//     if (!updatedCategory) {
//       res.status(404).json({
//         success: false,
//         message: "category not found"

//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: 'Category updated successfully',
//       data: updatedCategory,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// router.delete('/category', async (req, res) => {
//   try {
//     const deletedCategories = await categoryService.deleteCategories();
//     res.status(200).json({
//       success: true,
//       message: 'All categories deleted successfully',
//       data: deletedCategories,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// module.exports = router;
