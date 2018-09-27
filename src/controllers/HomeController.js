const request=require('request');

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

        
       res.render('home',{
            isAuthenticated:req.isAuthenticated(),
            user:req.user
        });


    }

}