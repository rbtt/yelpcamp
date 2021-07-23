const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req,res) => {    
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campground)
    newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    newCamp.author = req.user._id;
    newCamp.geometry = geoData.body.features[0].geometry
    await newCamp.save();
    req.flash('success', 'Successfully created new Campground.')
    res.redirect(`/campgrounds/${newCamp._id}`)   
}

module.exports.showCampgrounds = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author')
    if(!campground) {
        req.flash('error', 'Campground not found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Campground not found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async(req,res) => {
    const {id} = req.params;
    // console.log(req.body) 
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true})
    const images = req.files.map(f => ( {url: f.path, filename: f.filename }))
    campground.images.push(...images);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground.');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    // console.log(req.params)
    const {id} = req.params;
    await Campground.findByIdAndDelete(id, (err, doc) => {
        if (!err) {console.log('deleted: ', doc)}
    });
    req.flash('success', 'Successfully deleted campground.')
    res.redirect('/campgrounds')
}