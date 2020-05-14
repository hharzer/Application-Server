const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const express_enforces_ssl = require('express-enforces-ssl');
const hsts = require('hsts')
const cookieSession = require('cookie-session');

const app = express();

// Enforce HTTPS
app.enable('trust proxy');

if(process.env.NODE_ENV === "production"){
	
	app.use(express_enforces_ssl());
	app.use(hsts({
		maxAge: 86400 // 1 day in seconds
	}));

}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use( logger('dev') );
app.use(express.json( { limit: '150mb'} ) );
app.use(express.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join(__dirname, 'public' ) ) );

app.use(cookieSession({
	name: 'choirless-session',
	secret : process.env.SESSION_SECRET,
	maxAge: 12 * 60 * 60 * 1000, // 12 hours
	secure : process.env.NODE_ENV === "production"
}));

app.use('/', require(`${__dirname}/routes/index`));
app.use('/account', require(`${__dirname}/routes/account`));
app.use('/performance', require(`${__dirname}/routes/performance`));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
