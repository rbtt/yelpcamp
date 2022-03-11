const mongoose = require('mongoose')
const Campground = require('../models/campground')

mongoose
  .connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log(`There\'s been an error: \n ${err}`)
  })

Campground.deleteMany({}).then(() => {
  console.log('Database deleted')
  mongoose.connection.close()
})
