var controllers=require('.././controllers');
var AuthMiddleware=require('../middlewares/auth');

module.exports=(app,passport)=>{

    app.get('/',controllers.HomeController.index);

    app.get('/home',AuthMiddleware.isLogged,controllers.HomeController.home)
   
    app.get('/signup',controllers.UserController.getSignUp);

    app.post('/signup',controllers.UserController.postSignUp);

    app.get('/login',controllers.UserController.getSignIn);
    
    app.post('/login',passport.authenticate('local',{
        successRedirect:'/home',
        failureRedirect:'/login',
        failureFlash:true
    }));

    app.get('/wallet',controllers.AccountController.wallet);

    app.get('/send',controllers.AccountController.getSend);

    app.post('/send',controllers.AccountController.postSend);

    app.get('/token',controllers.AccountController.getToken);
    
    app.post('/token',controllers.AccountController.postToken);

    app.get('/sendToken',controllers.AccountController.getSendToken);

    app.post('/sendToken',controllers.AccountController.postSendToken);


    app.get('/logout',controllers.UserController.logout);

};