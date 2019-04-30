
async function proccesFiles(files,db){

    try{

        let {file1,file2,file3}=files;

        let first=uploadFile(file1,db);
        let second=uploadFile(file2,db);
        let third=uploadFile(file3,db);
    
        return Promise.all([first,second,third])

    }catch(err){

        return Promise.reject('Error al respaldar')
        
    }
  
}


const uploadFile=(file,db)=>{

    return new Promise((resolve,reject)=>{

        const path=require('path');

        file.mv(__dirname+`/../.././views/Module/Files/${file.name}`,err => {

            if(err){
                
                reject(`El archivo ${file.name} no se pudo cargar por favor intentelo de nuevo`)
               
            }else{
                
                let name=path.basename(file.name,'.txt');

                let route=__dirname.replace(/\\/g, '/');

                db.query(`LOAD DATA INFILE '${route}/../.././views/Module/Files/${file.name}' IGNORE INTO TABLE ${name} FIELDS TERMINATED BY ',' LINES TERMINATED BY ';'`,(err,rows,fields)=>{

                    if(!err)
                        resolve('Migracion realizada con exito')
                    else
                        reject(`Error al respaldar el archivo ${file.name} , intentelo de nuevo`);
                    

                    // SELECT *
                    // FROM criptomoneda
                    // INTO OUTFILE 'criptomoneda.txt'
                    // FIELDS TERMINATED BY ','
                    // // LINES TERMINATED BY ';'
                    
                });
    
            }
    
        })

    })

}


module.exports=proccesFiles;