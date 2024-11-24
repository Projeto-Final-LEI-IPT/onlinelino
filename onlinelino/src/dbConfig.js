const mysql = require('mysql2/promise'); // Importa a versão promise
require('dotenv').config();

const connection = async () => {
    try {
        const db = await mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: '',
            port: ''
        });
        console.log('Database connected successfully');
        return db;
    } catch (error) {
        console.error('Error while connecting with the database:', error.message);
        throw error;
    }
};

module.exports = connection;
