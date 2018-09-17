var mysql=require('mysql');
var bcrypt=require('bcrypt-nodejs');
var request=require('request');

module.exports={

    getSignUp:function(req,res,next){
        res.render('users/signup');
    },

    postSignUp:function(req,res,next){

        let salt=bcrypt.genSaltSync(10);
        let password=bcrypt.hashSync(req.body.password,salt);
        
        let user={
            nombre:req.body.nombre,
            usuario:req.body.usuario,
            email:req.body.email,
            password:password
        }

        var config=require('../config/database');

        db=mysql.createConnection(config);

        db.connect();

        db.query('INSERT INTO usuarios SET ?',user,(err,rows,fields)=>{

            if(err) throw err;

            db.end();
        });

        req.flash('info','Se ha registrado Correctamente, ya puede iniciar sesion');
        res.redirect('/login');

    },

    getSignIn:function(req,res,next){
        res.render('users/signin',{message:req.flash('info')});
    },

    postSignIn:function(req,res,next){

        console.log(req.body.email);
        return;

    }

}