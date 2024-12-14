const slugify = require('slugify')
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');

const { v4: uuidv4 } = require('uuid');

const sharp = require('sharp');

const Product = require('../models/product');


const factory = require('./handlers_factory');

const { uploadMixOfImage } = require('../middlewares/upload_single_image_muddleware');



exports.uploadProductImages = uploadMixOfImage([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },


]);
exports.resizedProductImage = asyncHandler(
    async (req, res, next) => {
        if (req.files.imageCover) {
            const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

            await sharp(req.files.imageCover[0].buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(`uploads/products/${imageCoverFileName}`);

            // Save image into our db
            req.body.imageCover = imageCoverFileName;
        }
        if (req.files.images) {
            req.body.images = [];
            await Promise.all(
                req.files.images.map(async (img, index) => {
                    const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

                    await sharp(img.buffer)
                        .resize(2000, 1333)
                        .toFormat('jpeg')
                        .jpeg({ quality: 95 })
                        .toFile(`uploads/products/${imageName}`);

                    // Save image into our db
                    req.body.images.push(imageName);
                })
            );

        }
        next();


    }

);
// @ dec create  sub categories
// @ route '/api/v1/subcategory
// @ access private 
exports.createProduct = factory.createOne(Product);
// @ dec get list of sub categories
// @ route '/api/v1/subcategory
// @ access Public 
exports.getProducts = factory.getAll(Product);
// @ dec get specific subcategory
// @ route /api/v1/subcategory/:id
// @ public
exports.getOneProduct = factory.getOne(Product);
// @ dec update  sub categories
// @ route '/api/v1/subcategory
// @ access private 
exports.updateProduct = factory.updateOne(Product);
// @ dec delete  sub categories
// @ route '/api/v1/subcategory
// @ access private 
exports.deleteProduct = factory.deleteOne(Product);
// @ dec delete all categories
// @ route '/api/v1/subcategory
// @ access private 
exports.deleteAllProducts = factory.deleteAll(Product);
