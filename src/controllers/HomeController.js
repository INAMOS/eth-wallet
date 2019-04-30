const request=require('request');
const mysql=require('mysql');
const config=require('.././config/Database/database');


module.exports={

    index:function(req,res,next){

        request.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=10',(err,result,body)=>{
            
            if(!err){

                let jsonObj=JSON.parse(body);//parsing the string Obj into JSON
                
                res.render('index',{
                    cripto:jsonObj,
                });

            }  
        });
    },

    home:function(req,res,next){

        let db=mysql.createConnection(config);

        db.connect();

        db.query(`SELECT * FROM transacciones WHERE ide_usu=${req.user.id}`,(err,rows,fields)=>{

            res.render('home',{
                isAuthenticated:req.isAuthenticated(),
                user:req.user,
                data:rows
            });

        });

        
       


    }

}