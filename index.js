if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp'
const MongoStore = require('connect-mongo');
const { storage } = require('./cloudinary');

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.log(`There\'s been an error: \n ${err}`)
});
//sSESSIOn

const secret = process.env.SECRET || 'thisismysecret'

const store = MongoStore.create({
    mongoUrl: dbURL,
    secret,
    touchAfter: 24 * 60 * 60
})
store.on('error', function(e) {
    console.log('Session store error: ', e)
})
const sessionConfig = {
    store,
    name: 'camp_sesh',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7        
    }
}
app.use(session(sessionConfig))
// FLASH
app.use(flash())


// PASSPORT
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//middleware for flash
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next()
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.engine('ejs', ejsMate)

// custom router
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)
// serving public assets
app.use(express.static(path.join(__dirname, 'public')))
//Security
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(helmet({contentSecurityPolicy: false}))


//Main routes
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req,res,next) => {
    next(new ExpressError('Page not found', 404))
})

// Error middleware
app.use((err,req,res,next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('error', { statusCode, message, err });
})

app.listen(3000, () => {
    console.log('Listening on port 3000..')
})