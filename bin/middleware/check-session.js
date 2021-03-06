const debug = require('debug')('bin:middleware:check-session');

module.exports = (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.name = req.session.name;
    res.locals.userType = req.session.userType;
    next();
};