const mysql=require("mysql");
const fs=require("fs")
// const database=require("./src/config/Database/database.js")
const dotenv=require("dotenv")

dotenv.config()
const database=require("./src/config/Database/database.js")
const pool=require("./src/config/Database/db.js")


// // fs.readFile("./src/views/Module/Files/criptomoneda.txt","utf-8",(err,res)=>{

    
// })


// "SHOW COLUMNS FROM exchange.transacciones"
// let route = __dirname.replace(/\\/g, "/");
// // `LOAD DATA INFILE './src/views/Module/Files/criptomoneda.txt' IGNORE INTO TABLE criptomoneda FIELDS TERMINATED BY ',' LINES TERMINATED BY ';'`
// pool.query(`LOAD DATA INFILE '${route}/src/views/Module/Files/criptomoneda.txt' IGNORE INTO TABLE criptomoneda FIELDS TERMINATED BY ',' LINES TERMINATED BY ';'`,(err, rows, fields)=>{

//     if(!err){
//         console.log(rows.affectedRows); process.exit()
//     }else{
//         console.log(err)
        
//     }
    

// })
