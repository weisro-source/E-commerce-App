const crypto = require('crypto');

const User = require('../models/user_model');

const ApiError = require('../utils/ApiError')
const createToken = require('../utils/create_token');

const asyncHandler = require('express-async-handler');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { log } = require('console');
const sendEmail = require('../utils/send_email');



const signupData = {}; // Temporary storage for user data (consider using Redis for scaling)
// @desc    Signup with OTP
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;



    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Temporarily store user data and hashed OTP
    signupData[email] = {
        name,
        email,
        password,
        otp: hashedOtp,
        otpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    };

    // Send OTP email
    // Improved HTML Email Content
    const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #4CAF50;">Welcome to E-Shop, ${name}!</h2>
            <p style="font-size: 16px;">We are excited to have you on board. To complete your signup process, please verify your email address using the OTP code below:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #4CAF50; background: #f1f1f1; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #555;">Please note: This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; text-align: center; color: #aaa;">
                This email was sent by E-Shop Team. If you need help, please contact us at <a href="mailto:support@eshop.com" style="color: #4CAF50;">support@eshop.com</a>.
            </p>
        </div>
    `;

    try {
        await sendEmail({
            email,
            subject: 'Signup OTP Verification',
            message,
        });

        res.status(200).json({ status: 'Success', message: 'OTP sent to email' });
    } catch (err) {
        console.error('Error sending email: ', err.message);
        delete signupData[email];
        return next(new ApiError('Error sending email. Please try again.', 500));
    }
});
// @desc    Verify OTP and create user
// @route   POST /api/v1/auth/verifyOtp
// @access  Public
exports.verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    const userData = signupData[email];
    if (!userData) {
        return next(new ApiError('Invalid or expired OTP', 400));
    }

    // Verify OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOtp !== userData.otp || Date.now() > userData.otpExpires) {
        return next(new ApiError('Invalid or expired OTP', 400));
    }

    // Create user in database
    const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Hashing is handled in the User model (if set up correctly)
    });

    // Cleanup temporary signup data
    delete signupData[email];

    // Generate token
    const token = createToken(user._id);

    res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    // 1) check if password and email in the body (validation) in login validation
    // 2) check if user exist & check if password is correct
    const user = await User.findOne({ email: req.body.email });
    // compare the password with bcrypt.compare
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }
    // 3) generate token
    const token = createToken(user._id);

    // Delete password from response
    delete user._doc.password;
    // 4) send response to client side
    res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    console.log(req.headers);

    // 1) Check if token exist, if exist get
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {

        token = req.headers.authorization.split(' ')[1];
        console.log(token);

    }
    if (!token) {
        return next(
            new ApiError(
                'You are not login, Please login to get access this route',
                401
            )
        );
    }

    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new ApiError(
                'The user that belong to this token does no longer exist',
                401
            )
        );
    }

    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
        // Password changed after token created (Error)
        if (passChangedTimestamp > decoded.iat) {
            return next(
                new ApiError(
                    'User recently changed his password. please login again..',
                    401
                )
            );
        }
    }

    req.user = currentUser;
    next();
});
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError('You are not allowed to access this route', 403)
            );
        }
        next();
    });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`No user found with email ${req.body.email}`, 404));
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();

    const message = `Hi ${user.name},\n We received a request to reset your password. \n Reset Code: ${resetCode}\n Please use it within 10 minutes.\n - The Team`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Code',
            message,
        });
        res.status(200).json({ status: 'Success', message: 'Reset code sent to email' });
    } catch (err) {
        console.error('Error sending email: ', err.message);
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        try {
            await user.save({ validateBeforeSave: false });
        } catch (saveErr) {
            console.error('Error cleaning user data: ', saveErr.message);
        }
        return next(new ApiError('There is an error in sending email', 500));
    }
});

