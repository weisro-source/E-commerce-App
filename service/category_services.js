const Category = require('../models/category');

const factory = require('./handlers_factory');

const { uploadSingleImage } = require('../middlewares/upload_single_image_muddleware');

const multer = require('multer')

const { v4: uuidv4 } = require('uuid');

const sharp = require('sharp');

const asyncHandler = require('express-async-handler');



exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `categories-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);
    // Save image into our db 
    req.body.image = filename;
    next();
});


exports.createCategory = factory.createOne(Category);

exports.getAllCategory = factory.getAll(Category);

exports.getOneCategory = factory.getOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);

exports.deleteAll = factory.deleteAll(Category);
