const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utility/catchAsync');
const reviews = require('../controllers/review');
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware');


router.post('/', isLoggedIn, validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;