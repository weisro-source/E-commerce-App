const multer = require('multer')

const ApiError = require('../utils/ApiError')

const multerOptions = () => {
    const storage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Only Images allowed', 400), false);
        }
    };
    const upload = multer({ storage: storage, fileFilter: multerFilter });
    return upload;

};

exports.uploadSingleImage = (filedName) => {
    return multerOptions().single(filedName);
}
exports.uploadMixOfImage = (arrayOfFields) => multerOptions().fields(arrayOfFields);