const request=require('request');

module.exports={

    index:function(req,res,next){

    
        request.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=10',(err,result,body)=>{
            if(!err){

                let jsonObj=JSON.parse(body);//parsing the string Obj into JSON
                
                //console.log(jsonObj.data);
                res.render('index',{cripto:jsonObj});

            }
           
        });


    }

}