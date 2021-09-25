const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const campgrounds = require('../controllers/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const multer = require('multer')
const  {storage}  = require('../cloudinary')
const upload = multer({ storage })
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    
router.get('/new', isLoggedIn, campgrounds.newForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));



module.exports = router;