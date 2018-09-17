var controllers=require('.././controllers');
var passport=require('passport');

module.exports=(app)=>{

    app.get('/',controllers.HomeController.index);
   
    app.get('/signup',controllers.UserController.getSignUp);

    app.post('/signup',controllers.UserController.postSignUp);

    app.get('/login',controllers.UserController.getSignIn);
    
    app.post('/login',passport.authenticate('local',{

        succesRedirect:'/',
        failureRedirect:'/',
        failureFlash:true

    }),controllers.UserController.postSignIn);

};