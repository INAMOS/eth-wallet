const mysql=require("mysql")
const configDB=require("./database")

var pool=mysql.createPool({
    connectionLimit:20,
    ...configDB
})

pool.getConnection((err,connection)=>{

    if(err){
        switch(err.code){
            case "PROTOCOL_CONNECTION_LOST":
                return new Error("Conexion con la base de datos perdida")
                break;
            
            case "ER_CON_COUNT_ERROR":
                return new Error("Conexiones a la base de datos excedidas")
            break;

            case "ECONNREFUSED":
                return new Error("Conexion  la base de datos rechazada")
            break;
        }
    }else{
        connection.release()
        return 
    }
})

module.exports=pool