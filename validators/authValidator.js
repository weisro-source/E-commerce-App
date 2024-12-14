const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const User = require('../models/user_model');

// Common password list to prevent weak passwords
const commonPasswords = ['123456', 'password', 'qwerty', '111111', 'abc123']; // add more as needed

// Signup validator
exports.signupValidator = [
    // Name validation
    check('name')
        .notEmpty()
        .withMessage('User name required')
        .isLength({ min: 3 })
        .withMessage('User name too short')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom(async (val, { req }) => {
            // Check for uniqueness of username
            const existingUser = await User.findOne({ name: val });
            if (existingUser) {
                throw new Error('Username already taken');
            }
            // Create slug
            req.body.slug = slugify(val);
            return true;
        }),

    // Email validation
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail()
        .custom(async (val) => {
            // Check for uniqueness of email
            const user = await User.findOne({ email: val });
            if (user) {
                throw new Error('Email already in use');
            }
            return true;
        }),

    // Password validation
    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/)
        .withMessage('Password must contain at least one special character')
        .custom((password, { req }) => {
            // Disallow common passwords
            if (commonPasswords.includes(password)) {
                throw new Error('This password is too common. Please choose a more secure password.');
            }
            // Password confirmation match check
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password confirmation does not match');
            }
            return true;
        }),

    // Password confirmation validation
    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),

    // Optional age validation - must be at least 18 years old
    check('birthdate')
        .optional()
        .isDate()
        .withMessage('Birthdate must be a valid date')
        .custom((birthdate) => {
            const age = Math.floor((new Date() - new Date(birthdate)) / 31557600000);
            if (age < 18) {
                throw new Error('You must be at least 18 years old to sign up');
            }
            return true;
        }),

    // Apply validator middleware to handle errors
    validatorMiddleware,
];

// Login validator
exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    // Apply validator middleware to handle errors
    validatorMiddleware,
];
