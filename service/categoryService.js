// // services/categoryService.js

// const Category = require('../models/category');
// const mongoose = require('mongoose');
// const slugify = require('slugify')
// const factory = require('./handlers_factory');

// //@desc add category 
// //@route post  /add-category
// //@access private
// const addCategory = async (name, isActive) => {
//   if (!name) {
//     throw new Error('Name is a required field');
//   }
//   if (name.length < 3) {
//     throw new Error('Name must be at least 3 characters long');
//   }
//   const newCategory = new Category({ name, isActive, slug: slugify(name) });
//   await newCategory.save();
//   return newCategory;
// };

// const getCategories = async () => {
//   return await Category.find();
// };

// const getActiveCategories = async () => {
//   return await Category.find({ isActive: true });
// };
// const getCategoryById = async (id) => {
//   return await Category.findById(id)
// };
// const deleteCategory = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new Error('Invalid category ID');
//   }
//   const deletedCategory = await Category.findByIdAndDelete(id);
//   if (!deletedCategory) {
//     throw new Error('Category not found');
//   }
//   return deletedCategory;
// };

// const updateCategory = async (id, name, isActive) => {

//   if (name && name.length < 3) {
//     throw new Error('Name must be at least 3 characters long');
//   }

//   const updatedCategory = await Category.findByIdAndUpdate(
//     id,
//     { name, isActive },
//     { new: true, runValidators: true }
//   );


//   return updatedCategory;
// };
// const deleteCategories = async () => {
//   return await Category.deleteMany({});
// };

// const getPaginatedCategories = async (page = 1, limit = 10) => {
//   try {
//     // Ensure page and limit are numbers and are greater than 0
//     page = Math.max(1, parseInt(page, 10));
//     limit = Math.max(1, parseInt(limit, 10));

//     const skip = (page - 1) * limit;

//     // Create a promise to count the total number of documents
//     const totalCountPromise = Category.countDocuments().exec();

//     // Create a promise to find the paginated categories
//     const categoriesPromise = Category.find()
//       .skip(skip)
//       .limit(limit)
//       .lean()
//       .exec();

//     // Await both promises
//     const [totalCount, categories] = await Promise.all([totalCountPromise, categoriesPromise]);

//     // Calculate total pages
//     const totalPages = Math.ceil(totalCount / limit);

//     return {
//       categories,
//       totalCount,
//       currentPage: page,
//       totalPages,
//     };
//   } catch (error) {
//     throw new Error(`Failed to retrieve paginated categories: ${error.message}`);
//   }
// };

// module.exports = {
//   addCategory,
//   getCategories,
//   getActiveCategories,
//   deleteCategory,
//   updateCategory,
//   deleteCategories,
//   getPaginatedCategories,
//   getCategoryById
// };
