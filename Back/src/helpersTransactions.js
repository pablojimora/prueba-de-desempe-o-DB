import fs from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2';


export const uploadCSVtransactions = () => {

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

    fs.createReadStream('transactions.csv')
        .pipe(csv())
        .on('data', (row) => {
            db.query('INSERT INTO transactions (id_transactions, dateTime, transactionAmount, transactionStatus, transactionType, id_customers, id_plataform) VALUES (?, ?, ?, ?, ?, ?, ?)', [row.id_transaccion, row.fecha_hora_trans, row.monto_trans, row.estado_trans, row.tipo_trans, row.id_cliente, row.id_plataforma], (error, results) => {
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



uploadCSVtransactions()