const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.log(`There\'s been an error: \n ${err}`)
});

const sample = function(array) {
    return array[Math.floor(Math.random() * array.length)]
} 

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<=50; i++) {
        const rand226 = Math.floor(Math.random() * 226) + 1;
        const randPrice = Math.floor(Math.random() * 30) + 10;
        let camp = new Campground({
            location: `${cities[rand226].city}, ${cities[rand226].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut, animi consectetur vel sed neque dolorum molestiae facilis a delectus illum placeat explicabo officia! Fugiat, odit alias illum suscipit enim qui.',
            price: randPrice
        })
        await camp.save();
    }
    // await console.log(cities[20].city + " община " + cities[20].admin_name);
}
seedDB().then(() => {
    mongoose.connection.close();
});
