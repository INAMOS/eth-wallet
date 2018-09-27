var web3=require('.././config/web3');
var mysql=require('mysql');
var config=require('../config/Database/database');
var TX=require('ethereumjs-tx');

module.exports={

    wallet:function(req,res,next){

        /*db=mysql.createConnection(config);

        db.connect();


        db.query(`SELECT direccion FROM usuarios WHERE email=`);*/

        res.render('wallet',{user:req.user});
        
    },

    getSend:function(req,res,next){

       /* web3.eth.getBalance("0x82464f91835A5d8bF2cab20D5aA47f09687B4C6F").
        then(console.log)
        .catch(err=>{throw err});*/


        res.render('account/send',{direccion:req.user.direccion});

    },

    postSend:function(req,res,next){

        db=mysql.createConnection(config);

        /*const tx={
            nonce:,
            to:req.body.to,
            value:req.body.amount,
            gasLimit:,
            gasPrice:
        }*/
        db.connect();

        db.query(`SELECT lla_priv FROM usuarios WHERE ide_usu=${req.id}`,(err,rows,fields)=>{

            web3.eth.accounts.signTransaction(tx, rows[0].lla_priv,(err,hash)=>{

            });
        });

    }
}