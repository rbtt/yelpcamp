const User = require('../models/user')

module.exports.renderRegister = (req,res) => {
    res.render('users/register')
}

module.exports.register = async(req,res,next) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({ username, email })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
        
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login')
}

module.exports.login = async(req,res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'Logged out');
    res.redirect('/campgrounds');
}