import fs from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2';


export const uploadCSVplataform = () => {

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
// This query is for append only one time each plataform name
    fs.createReadStream('plataform.csv')
        .pipe(csv())
        .on('data', (row) => {
            const sql =  `
            INSERT INTO plataform (plataformName)
            SELECT ? FROM DUAL
            WHERE NOT EXISTS (
                SELECT 1 FROM plataform WHERE plataformName = ?
            );
            `
            db.query(sql, [manejoVar(row.plataforma),manejoVar(row.plataforma)], (error, results) => {
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
        .toLowerCase()
        .trim();
}


uploadCSVplataform()