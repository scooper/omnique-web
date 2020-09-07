import debug = require('debug');
import express = require('express');
import path = require('path');
// config
const config = require('./config/config.json');

// external
import bodyParser = require('body-parser');
var mongoose = require('mongoose');

// general routes
import homeRoutes from './routes/Home';
import productRoutes from './routes/Products';
import contactRoutes from './routes/Contact';
import testimonialRoutes from './routes/Testimonals';
import largeOrderRoutes from './routes/LargeOrders';

// webhooks
import webhookRoutes from './routes/Webhooks';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// for requests
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

//// datepicker setup
//app.use('/datepicker/js', express.static(path.join(__dirname, '/node_modules/foundation-datepicker/js')));
//app.use('/datepicker/css', express.static(path.join(__dirname, '/node_modules/foundation-datepicker/css')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use general routes
app.use('/', homeRoutes);
app.use('/products', productRoutes);
app.use('/contact', contactRoutes);
app.use('/testimonials', testimonialRoutes);
app.use('/large-orders', largeOrderRoutes);

// use webhook routes
app.use('/webhook', webhookRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// mongo
mongoose.connect(config.mongo.connectionString, { useNewUrlParser: true });
var db = mongoose.connection;

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
