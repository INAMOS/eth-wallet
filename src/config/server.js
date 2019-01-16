const express=require('express');
const app=express();
const path=require('path');
const passport=require('passport');
const flash=require('connect-flash');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const fileUpload=require('express-fileupload');
const dotenv=require('dotenv');


//Settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'../views'))
app.set('view engine','ejs');
dotenv.config(
    
);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(fileUpload());
app.use(session({
    secret:'secreteWord',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./passport/passport')(passport);

//Routes
require('.././app/routes')(app,passport);



//static files
app.use(express.static(path.join(__dirname,'../public')));
app.use('/bulma', express.static(__dirname + '../../../node_modules/bulma/css'));

module.exports=app;