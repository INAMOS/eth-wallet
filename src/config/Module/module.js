async function proccesFiles(files, pool) {
  try {
    let { file1, file2, file3 } = files;

    let firstPromise = await uploadFile(file1, pool);
    let secondPromise = await uploadFile(file2, pool);
    let thirdPromise = await uploadFile(file3, pool);

    return Promise.all([firstPromise, secondPromise, thirdPromise]);
  } catch (err) {
    return Promise.reject("Error al respaldar " + err);
  }
}

const uploadFile = (_file, pool) => {
  return new Promise((resolve, reject) => {
    const path = require("path");
    const fs = require("fs");

    let route = __dirname.replace(/\\/g, "/");
    let fileName = _file.name;
    let name = path.basename(fileName, ".txt");

    //Si el archivo ha sido cargado previamente lo borramos del directorio para evitar errores
    if (fs.existsSync(`${route}/../.././views/Module/Files/${fileName}`)) {
      fs.unlinkSync(`${route}/../.././views/Module/Files/${fileName}`);
    }

    //Consultamos las filas de la tabla que vamos a respaldar para podear sanear los datos
    pool.query(
      `SHOW COLUMNS FROM exchange.${name}`,
      (err, rows, fields) => {
        let size = rows.length;

        try {
          _file.mv(
            __dirname + `/../.././views/Module/Files/${fileName}`,
            err => {
              if (err) {
                reject(
                  `El archivo ${
                    fileName
                  } no se pudo cargar por favor intentelo de nuevo`
                );
              } else {

                let file = fs.readFileSync(`${route}/../.././views/Module/Files/${fileName}`, "utf-8");
                let rows = file.split(";");
                let fields = rows.map(currentValue => currentValue.split(","));
      
                //Eliminamos el resgistro si hay errores de mas
                fields.forEach(item => {
                  if (item.length != size) {
                    fields.splice(fields.indexOf(item), 1);
                  }
                });
      
                //Mapeamos la data para poder corregir un error de formato
                let data = fields.map((currentValue, index, array) => {
                  let _data = currentValue;
                  _data[currentValue.length - 1] =
                    _data[currentValue.length - 1] + ";";
                  return _data;
                });
      
                unsanedData = data.toString();
      
                let finalData = unsanedData.replace(/;,/g, ";");

                fs.unlinkSync(`${route}/../.././views/Module/Files/${fileName}`);

                fs.writeFileSync(
                  `${route}/../.././views/Module/Files/${fileName}`,
                  finalData
                );
      
                //Si no ha ocurrido ningun error al cargar el archivo procedemos a respaldarlo en la tabla
                pool.query(
                  `LOAD DATA INFILE '${route}/../.././views/Module/Files/${fileName}' IGNORE INTO TABLE ${name} FIELDS TERMINATED BY ',' LINES TERMINATED BY ';'`,
                  (err, rows, fields) => {
                    //Si entra aqui todo bien
                    if (!err) resolve(rows.affectedRows);
                    //si no mandara un error con el archivo que no se pudo respaldar
                    else
                      reject(
                        `Error al respaldar el archivo ${fileName} , intentelo de nuevo`
                      );
      
                    // SELECT *
                    // FROM criptomoneda
                    // INTO OUTFILE 'criptomoneda.txt'
                    // FIELDS TERMINATED BY ','
                    // // LINES TERMINATED BY ';'
                  }
                );

              }
            }
          );
         
        } catch (err) {
          err;
          reject(
            `El archivo ${fileName} no se pudo cargar por favor intentelo de nuevo`
          );
        }
      }
    );
  });
};

module.exports = proccesFiles;
