
const express = require('express');
// const {
//     getBrandValidator,
//     createBrandValidator,
//     updateBrandValidator,
//     deleteBrandValidator,
// } = require('../validators/brands_validator');
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    changeUserPasswordValidator,
    changeMyPasswordValidator,
    updateLoggedUserValidator
} = require('../validators/user_validator')

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    updatePassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData
} = require('../service/user_services');
const authService = require("../service/auth_services")
const router = express.Router();
router.use(authService.protect);
router.get('/getMe', getLoggedUserData, getUser)
router.put('/changeMyPassword', changeMyPasswordValidator, updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);
router.use(authService.allowedTo('admin', 'manager'));
router.put('/updatePassword/:id', changeUserPasswordValidator, updatePassword);
router
    .route('/')
    .get(getUsers)
    .post(
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );
router
    .route('/:id')
    .get(getUser)
    .put(
        updateUser,
    )
    .delete(
        deleteUser
    );

module.exports = router;
