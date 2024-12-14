const factory = require('./handlers_factory');

const { uploadSingleImage } = require('../middlewares/upload_single_image_muddleware');

const User = require('../models/user_model');

const ApiError = require('../utils/ApiError');

const createToken = require('../utils/create_token');
const sharp = require('sharp');

const asyncHandler = require('express-async-handler');

const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');

// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');


// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${filename}`);
        // Save image into our db
        req.body.profileImg = filename;
    }

    next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Create user
// @route   POST  /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findOneAndUpdate(req.params.id, {

        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        email: req.body.email,
        profileImg: req.body.profileImg,
        role: req.body.role,

    },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });


});
// @desc    update user password
// @route   POST  /api/v1/users/updatePassword
// @access  Private/user

exports.updatePassword = asyncHandler(async (req, res, next) => {

    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });

});
// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});
// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    // Check if currentPassword matches
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
        return next(new ApiError('Incorrect current password', 400));
    }
    const isSameAsOldPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if (isSameAsOldPassword) {
        return next(new ApiError('New password cannot be the same as the old password', 400));
    }
    user.passwordChangedAt = Date.now() - 1000;
    await user.save();
    const token = createToken(user._id);

    res.status(200).json({ data: user, token });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);
