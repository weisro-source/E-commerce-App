const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Collect all error messages into a single string
        const errorMessages = errors.array().map((err) => err.msg).join(', ');

        // Or, if you'd like each message on a new line
        // const errorMessages = errors.array().map((err) => err.msg).join('\n');

        return res.status(400).json({
            status: 'error',
            message: errorMessages, // Send all error messages in a single field
        });
    }

    next();
};

module.exports = validatorMiddleware;
