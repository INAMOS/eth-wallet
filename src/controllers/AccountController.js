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

        db.connect();

        web3.eth.getTransactionCount(req.user.direccion,function(error, result) {

            //Building Transaction Object
            const txObject={
                nonce:web3.utils.toHex(result),
                to:req.body.to,
                value:web3.utils.toHex(web3.utils.toWei(req.body.amount,'ether')),
                gasLimit:web3.utils.toHex(21000),
                gasPrice:web3.utils.toHex(web3.utils.toWei('10','gwei'))
            }

            db.query(`SELECT lla_pri FROM llaves_privadas WHERE ide_usu=${req.user.id}`,(err,rows,fields)=>{

                if(err) throw err;

                field=rows[0].lla_pri.substring(2);

                let privateKey=Buffer.from(field,'hex');
                
                //signin transaction
                const tx=new TX(txObject);
                tx.sign(privateKey);

                const serializedTransaction=tx.serialize();
                const raw='0x'+serializedTransaction.toString('hex');

                web3.eth.sendSignedTransaction(raw,(err,hash)=>{

                    if(err) throw err;

                    console.log('TXT hash: '+hash);
                    
                });

                db.end();
            });
            
        }); 

        web3.eth.getBalance(req.user.direccion, function(error, result) {

            console.log('Balance:'+web3.utils.fromWei(result,'ether'));
            
        });

    }
}