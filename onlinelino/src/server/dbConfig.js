const mysql = require('mysql2/promise'); 
require('dotenv').config();

const connection = async () => {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'ram',
            password: 'ramipt',
            database: 'raullinodb',
            port: '4000'
        });
        console.log('Database connected successfully');
        return db;
    } catch (error) {
        console.error('Error while connecting with the database:', error.message);
        throw error;
    }
};

module.exports = connection;
