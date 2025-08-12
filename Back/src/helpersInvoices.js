import fs from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2';


export const uploadCSVinvoices = () => {

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

    fs.createReadStream('invoices.csv')
        .pipe(csv())
        .on('data', (row) => {
            db.query('INSERT INTO invoices (id_invoices, billingPeriod, invoicedAmount, amountPaid, id_transactions) VALUES (?, ?, ?, ?, ?)', [row.num_factura, row.periodo_factura, row.monto_facturado, row.monto_pagado, row.id_transaccion], (error, results) => {
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



uploadCSVinvoices()