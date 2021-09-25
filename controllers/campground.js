const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    if (!req.query.page) {
        const campground = await Campground.find({});
        const campgrounds = await Campground.paginate({});
        res.render('campgrounds/index', { campgrounds, campground })
    } else {
        const { page } = req.query;
        const campgrounds = await Campground.paginate({}, { page });
        res.status(200).json(campgrounds);
    }
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = (async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.showCampground = (async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not existed!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
})

module.exports.editForm = (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not existed!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
})

module.exports.updateCampground = (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.image.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', "Successfully edited campground!")
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteCampground = (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted campground!")
    res.redirect('/campgrounds')
})