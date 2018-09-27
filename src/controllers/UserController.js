var mysql=require('mysql');
var bcrypt=require('bcrypt-nodejs');
var request=require('request');
var web3=require('.././config/web3');

module.exports={

    getSignUp:function(req,res,next){
        res.render('users/signup');
    },

    postSignUp:function(req,res,next){

        let salt=bcrypt.genSaltSync(10);
        let password=bcrypt.hashSync(req.body.password,salt);

        let account=web3.eth.accounts.create();
        let private_key={lla_pri:account.privateKey};
        
        let user={
            nombre:req.body.nombre,
            usuario:req.body.usuario,
            email:req.body.email,
            password:password,
            direccion:account.address
        }

        var config=require('../config/Database/database');

        db=mysql.createConnection(config);

        db.connect();

        db.query('INSERT INTO usuarios SET ?',user,(err,rows,fields)=>{

            if(err) throw err;

            db.query(`SELECT id FROM usuarios WHERE direccion='${account.address}'`,(er,row,field)=>{

                private_key.ide_usu=row[0].id;

                db.query('INSERT INTO llaves_privadas SET ?',private_key,(error,rowss,fieldss)=>{

                    if(error) throw error;
                    
                    db.end();
                });
            
            });
               
            
           
        });

    
        

        req.flash('info','Se ha registrado Correctamente, ya puede iniciar sesion');
        res.redirect('/login');

    },

    getSignIn:function(req,res,next){
        res.render('users/signin',{message:req.flash('info'),authMessage:req.flash('loginMessage')});
    },

    logout:function(req,res,next){

        req.logout();

        res.redirect('/login');
    }

    
}