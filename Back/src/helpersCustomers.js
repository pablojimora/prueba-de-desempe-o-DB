import fs from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2';


export const uploadCSVcustomers = () => {

    const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Maria0295*',
      database: 'pd_pablo_jimenez_gosling',
    });
    

    db.connect((error) => {
        if (error) throw error;
        console.log('Conectado exitosamente a la db');
    })

    fs.createReadStream('customers.csv')
        .pipe(csv())
        .on('data', (row) => {
            db.query('INSERT INTO customers (customerName, id_customers, address, phone, email) VALUES (?, ?, ?, ?, ?)', [manejoVar(row.nombre_cliente), row.identificacion, row.direccion, row.tel, row.correo], (error, results) => {
                if (error) throw error;
                console.log(`Fila insertada: ${results.affectedRows}`);
            });
            console.log(row);
            console.log('--');
        })
        .on('end', () => {
            console.log('CSV único procesado.');
            db.end();
        });

}


function manejoVar(x) {
    return x
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .toLowerCase()
        .trim();
}
