const express = require('express');
const {
    createReviewValidator,
    updateReviewValidator,
    getReviewValidator,
    deleteReviewValidator,
} = require('../validators/reviewValidator');

const {
    getReview,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    createFilterObj,
    setProductIdAndUserIdToBody,
} = require('../service/reviewService');
const authService = require('../service/auth_services');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(createFilterObj, getReviews)
    .post(
        authService.protect,
        authService.allowedTo('user'),
        setProductIdAndUserIdToBody,
        createReviewValidator,
        createReview
    );
router
    .route('/:id')
    .get(getReviewValidator, getReview)
    .put(
        authService.protect,
        authService.allowedTo('user'),
        updateReviewValidator,
        updateReview
    )
    .delete(
        authService.protect,
        authService.allowedTo('user', 'manager', 'admin'),
        deleteReviewValidator,
        deleteReview
    );
module.exports = router;
