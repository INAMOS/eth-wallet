var web3=require('.././config/web3');
var mysql=require('mysql');
var config=require('../config/Database/database');
var TX=require('ethereumjs-tx');
var ABI=require('.././contracts/abi');

module.exports={

    wallet:function(req,res,next){

        web3.eth.getBalance(req.user.direccion,function(error, result) {

            let  ether=web3.utils.fromWei(result,'ether')

            res.render('wallet',{user:req.user,balance:ether}); 
            
        });

        
         
    },

    getSend:function(req,res,next){

        web3.eth.getBalance(req.user.direccion, function(error, result) {

            let val=web3.utils.fromWei(result,'ether');

            res.render('account/send',{direccion:req.user.direccion,balance:val,SuccessMessage:req.flash('success'),ErrorMessage:req.flash('error')});

            
        });
        
     
    }, 
    

    postSend:function(req,res,next){

        if(!web3.utils.isAddress(req.body.to)){

            req.flash('error','La direccion que introdujiste es incorrecta, por favor verificala')
            res.redirect('/send');
        
        }else{

            let db=mysql.createConnection(config);

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

                        let values={
                            has_tra:hash,
                            cod_cri:'ETH',
                            mon_tra:req.body.amount,
                            ide_usu:req.user.id
                        }

                        db.query('INSERT INTO transacciones SET ?',values,function(err,rows,fields){
                            
                            if(err) throw err;

                            db.end();
                        })

                        req.flash('success',' Su transaccion ha sido enviada con exito, ingrese al menu de transacciones para ver su confirmacion');
                        res.redirect('/send');
                    });

                });
                
            }); 

        }

    },


    getToken:function(req,res,next){

        res.render('account/token',{SuccessMessage:req.flash('success'),ErrorMessage:req.flash('error')});

    },

    postToken:function(req,res,next){

        let {name,code}=req.body;
        let supply=parseInt(req.body.supply),decimals=parseInt(req.body.decimals);

        let db=mysql.createConnection(config);

        db.connect();

        db.query(`SELECT lla_pri FROM llaves_privadas WHERE ide_usu=${req.user.id}`,(err,rows,fields)=>{

            const Contract=new web3.eth.Contract(ABI);

            web3.eth.accounts.wallet.add(rows[0].lla_pri);

            Contract.deploy({
                data: '0x608060405234801561001057600080fd5b5060405161095a38038061095a8339810180604052810190808051906020019092919080518201929190602001805190602001909291908051820192919050505082600090805190602001906100679291906100dd565b50806003908051906020019061007e9291906100dd565b50836002819055508160ff1660018190555083600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050505050610182565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011e57805160ff191683800117855561014c565b8280016001018555821561014c579182015b8281111561014b578251825591602001919060010190610130565b5b509050610159919061015d565b5090565b61017f91905b8082111561017b576000816000905550600101610163565b5090565b90565b6107c9806101916000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063095ea7b31461007257806323b872dd146100d757806370a082311461015c578063a9059cbb146101b3578063dd62ed3e14610218575b600080fd5b34801561007e57600080fd5b506100bd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061028f565b604051808215151515815260200191505060405180910390f35b3480156100e357600080fd5b50610142600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610381565b604051808215151515815260200191505060405180910390f35b34801561016857600080fd5b5061019d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610568565b6040518082815260200191505060405180910390f35b3480156101bf57600080fd5b506101fe600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506105b1565b604051808215151515815260200191505060405180910390f35b34801561022457600080fd5b50610279600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610716565b6040518082815260200191505060405180910390f35b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b600080600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101580156104525750828110155b151561045d57600080fd5b82600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555082600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a360019150509392505050565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101580156106025750600082115b151561060d57600080fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050929150505600a165627a7a723058204eabf110aa3ddf020b9cf6d84ee321751c0865004ff503bfaf6188be31f0c56f0029',
                arguments: [supply,name,decimals,code]
            })
            .send({
                from: req.user.direccion,
                gas: 1500000,
                gasPrice: '3000000'
            }, function(error, transactionHash){ 

                req.flash('success','Su Token ha sido creado, revise su historial y compruebe su direccion de token')
                res.redirect('/token');

            })
            .on('error', function(error){
                req.flash('error','Ha ocurrido un error por favor verifica!');
                res.redirect('/login');
            })
            .on('transactionHash', function(transactionHash){

            })
            .on('receipt', function(receipt){

                let values={
                    dir_mon:receipt.contractAddress,
                    cod_mon:req.body.code,
                    nom_mon:req.body.name,
                    sup_tot:req.body.supply,
                    dec_mon:req.body.decimals,
                    dir_cre:req.user.direccion
                }


                db.query('INSERT INTO criptomoneda SET ?',values,function(err,rows,fields){

                    if(err) throw err;

                });
               // contains the new contract address
            
            })
            // .on('confirmation', function(confirmationNumber, receipt){  })
            // .then(function(newContractInstance){
            //     console.log(newContractInstance.options.address) // instance with the new contract address
            // });


        });
         
        
       
    },

    getSendToken:function(req,res,next){

        let db=mysql.createConnection(config);

        db.connect();

        db.query('SELECT dir_mon,cod_mon,nom_mon FROM criptomoneda',(err,rows,fields)=>{

            res.render('account/sendToken',{data:rows,direccion:req.user.direccion,SuccessMessage:req.flash('success'),ErrorMessage:req.flash('error')});
            db.end();
        
        }) 

       

    },

    postSendToken:function(req,res,next){

        if(!web3.utils.isAddress(req.body.to)){

            req.flash('error','La direccion que introdujiste es incorrecta, por favor verificala')
            res.redirect('/sendToken');

        }else{

            let db=mysql.createConnection(config);

            let tokenAddress=req.body.address;
            let to = req.body.to;
            let amount=parseInt(req.body.amount);
        

            db.connect();

            db.query(`SELECT lla_pri FROM llaves_privadas WHERE ide_usu=${req.user.id}`,function(err,rows,field){
                
                web3.eth.accounts.wallet.add(rows[0].lla_pri);

                let token = new web3.eth.Contract(ABI,tokenAddress);

                token.methods.transfer(to,amount).send({from:req.user.direccion,gasPrice:'10000',gas:'100000'})
                .on('transactionHash', function(hash){
                    req.flash('success','Su token ha sido enviado correctamente,revise su historial de transsacciones para ver confirmacion')
                    res.redirect('/sendToken');
                    db.end();
                });
            });
            

        }


    },
}