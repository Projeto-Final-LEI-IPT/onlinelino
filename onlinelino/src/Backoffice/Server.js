const express = require('express'); // Express framework
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Importando a função de conexão usando require
const connection = require('../dbConfig.js');

dotenv.config();
const app = express();

// Configuração de CORS
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json()); 
app.use(morgan('dev')); // Logger de requisições HTTP

const PORT =  8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Endpoint para Equipa
app.get('/equipa', async (req, res) => {
  let db; // Declare a variável fora do bloco try para fechar corretamente a conexão
  try {
      db = await connection(); // Conecta ao banco
      const [rows] = await db.query('SELECT * FROM Equipa ORDER BY cargo, nome'); // Realiza a consulta
      res.json(rows); // Retorna os dados em formato JSON
  } catch (error) {
      console.error('Erro ao buscar dados da tabela Equipa:', error.message);
      res.status(500).send('Erro ao buscar dados da tabela Equipa');
  } finally {
      if (db) {
          await db.end(); // Fecha a conexão com o banco
      }
  }
});



// Conectando ao banco de dados
connection();
