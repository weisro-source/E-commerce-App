const express = require('express');

const router = express.Router();
const {
    signupValidator,
    loginValidator,
} = require('../validators/authValidator');

const {
    signup,
    login,
    forgotPassword,
    verifyOtp,
    verifyPassResetCode,
    resetPassword,
} = require('../service/auth_services');

router.post('/signup', signupValidator, signup);
router.post('/verifyOtp', verifyOtp);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgotPassword);

module.exports = router;
