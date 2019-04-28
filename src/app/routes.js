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

    app.get('/wallet',AuthMiddleware.isLogged,controllers.AccountController.wallet);

    app.get('/send',AuthMiddleware.isLogged,controllers.AccountController.getSend);

    app.post('/send',controllers.AccountController.postSend);

    app.get('/token',AuthMiddleware.isLogged,controllers.AccountController.getToken);
    
    app.post('/token',controllers.AccountController.postToken);

    app.get('/sendToken',AuthMiddleware.isLogged,controllers.AccountController.getSendToken);

    app.post('/sendToken',controllers.AccountController.postSendToken);

    app.get('/logout',controllers.UserController.logout);

    app.get('/config',controllers.ConfigController.getConfig);

    // app.get('/config',AuthMiddleware.isLogged,controllers.ConfigController.getConfig);

    app.post('/upload',controllers.ConfigController.postConfig);

};