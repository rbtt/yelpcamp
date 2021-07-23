const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCamp, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req,res) => {
    //     res.send(req.files)
    // })

router.get('/new', isLoggedIn , campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCamp, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;