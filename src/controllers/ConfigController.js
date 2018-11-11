const fs=require('fs');
const mysql=require('mysql');
const config=require('.././config/Database/database');
const path=require('path')


module.exports={

    getConfig:function(req,res,next){

        res.render('Module/module',{err:req.flash('uploadError'),succ:req.flash('uploadSuccess')});

    },

    postConfig:function(req,res,next){

        let   file=req.files.file;

        file.mv(__dirname+`/.././views/Module/Files/${file.name}`,err => {

            if(err){

                req.flash('uploadError','El archivo no se pudo cargar por favor intentelo de nuevo');
                
                res.redirect('/config',{mess:req.flash('uploadError')});

            }else{

                db=mysql.createConnection(config);

                db.connect();

                let name=path.basename(file.name,'.txt');

                let route=__dirname.replace(/\\/g, '/');

                db.query(`LOAD DATA INFILE '${route}/.././views/Module/Files/${file.name}' IGNORE INTO TABLE ${name} FIELDS TERMINATED BY ',' LINES TERMINATED BY ';'`,(err,rows,fields)=>{

                    if(err) throw err;

                    req.flash('uploadSuccess','Tabla respaldada con exito');
                
                    res.redirect('/config');

                });

            }
    
           

        })


    }

}