const express=require('express');
const app=express();
const path=require('path');
const passport=require('passport');
const flash=require('connect-flash');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const session=require('express-session');

require('./passport/passport')(passport);

//Settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'../views'))
app.set('view engine','ejs');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret:'secreteWord',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
require('.././app/routes')(app);

//static files
app.use(express.static(path.join(__dirname,'../public')));
app.use('/bulma', express.static(__dirname + '../../../node_modules/bulma/css'));

module.exports=app;