import express, { json } from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { uploadCSVcustomers } from './helpersCustomers.js';

const app = express();
app.use(cors());
app.use(json());

// Configuración de PostgreSQL con datos reales
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Maria0295*',
  database: 'pd_pablo_jimenez_gosling',
});


// Obtener todos los clientes
app.get('/customers', (req, res) => {
    connection.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear un nuevo cliente
app.post('/customers', (req, res) => {
    const { customerName, id_customers, address, phone, email } = req.body;

    if (!customerName || !id_customers || !address || !phone || !email) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sql = 'INSERT INTO customers (customerName, id_customers, address, phone, email) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [customerName, id_customers, address, phone, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Cliente creado', id: result.insertId });
    });
});
// Actualizar un cliente por ID
app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, address, phone, email } = req.body;

    const sql = 'UPDATE customers SET customerName = ?, address = ?, phone = ?, email = ? WHERE id_customers = ?';
    connection.query(sql, [customerName, address, phone, email, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado correctamente' });
    });
});

// Eliminar un cliente por ID
app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM customers WHERE id_customers = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado correctamente' });
    });
});
//Csv 

app.post('/importproducts', (req, res) => {
    console.log("si");
    
//   uploadCSVcustomers();
//     res.json({ message: 'CSV importado correctamente' });

});

// // Obtener todos los usuarios
// app.get('/products', async (req, res) => {
//   try {
//     const { rows } = await db.query('SELECT * FROM products');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));