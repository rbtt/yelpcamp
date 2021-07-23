const express = require('express')
const router = express.Router({mergeParams: true}); // mergeParams IMPORTANT
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware')
const reviews = require('../controllers/reviews')

// REVIEWS
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId', isReviewAuthor, isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router;