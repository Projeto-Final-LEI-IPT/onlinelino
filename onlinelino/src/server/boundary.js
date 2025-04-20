const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('/onlinelino/src/server/dbConfig.js');
const createResponseOnSuccess = require('./Utils.js');

dotenv.config();
const app = express();

const PORT = 8080;
const BACKOFFICE_URL = 'backoffice';

app.use(cors({
    //TODO Colocar o dominio do site como origin
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan('dev'));

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Autenticação necessária.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Autenticação necessária.' });
        req.user = user;
        next();
    });
};

const handleRequest = async (req, res, query, paramsExtractor, transform) => {
    let db;
    try {
        db = await connection();
        const params = paramsExtractor(req);
        const [rows] = await db.execute(query, params);
        res.json(transform(rows));
    } catch (error) {
        res.status(500).send('Erro interno. Tente novamente mais tarde');
        console.log(error);
    } finally {
        if (db) await db.end();
    }
};

const createEndpoint = (path, query, paramsExtractor = () => [], transform = rows => rows, requiresAuth = false) => {
    const endpointPath = requiresAuth ? `/${BACKOFFICE_URL}${path}` : path;
    app.get(endpointPath, async (req, res) => {
        if (requiresAuth) return authenticateToken(req, res, async () => await handleRequest(req, res, query, paramsExtractor, transform));
        await handleRequest(req, res, query, paramsExtractor, transform);
    });
};

const createUpdateEndpoint = (path, tableName, fields) => {
  const endpointPath = `/${BACKOFFICE_URL}${path}/:id`;

  app.put(endpointPath, authenticateToken, async (req, res) => {
      const { id } = req.params;
      const values = fields.map(field => req.body[field]);

      if (values.includes(undefined)) {
          return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      let db;
      try {
          db = await connection();

          const setClause = fields.map(field => `${field} = ?`).join(', ') + ', modificado_em = NOW()';
          const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;

          await db.execute(query, [...values, id]);

          res.json({ message: 'Atualização realizada com sucesso.', entidade_atualizada: values, modificada_em: new Date() });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao atualizar.' });
      } finally {
          if (db) await db.end();
      }
  });
};




app.post(`/${BACKOFFICE_URL}/register`, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || password.length < 4) return res.status(400).json({ error: 'Email e password são obrigatórios e devem ter pelo menos 4 caracteres.' });
    let db;
    try {
        db = await connection();
        const [existingUsers] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
        if (existingUsers.length > 0) return res.status(409).json({ error: 'O email já está em uso.' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'Utilizador registado com sucesso!' });
    } catch {
        res.status(500).json({ error: 'Erro ao registar Utilizador.' });
    } finally {
        if (db) await db.end();
    }
});

app.post(`/${BACKOFFICE_URL}/login`, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    let db;
    try {
        db = await connection();
        const [users] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
        if (users.length === 0 || !(await bcrypt.compare(password, users[0].password_hash))) return res.status(401).json({ error: 'Credenciais inválidas.' });
        const token = jwt.sign({ userId: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json(createResponseOnSuccess('Login executado com sucesso', token));
    } catch {
        res.status(500).json({ error: 'Erro ao processar login.' });
    } finally {
        if (db) await db.end();
    }
});

//Páginas do backoffice devem estar todas protegidas
createEndpoint('/home', 'SELECT * FROM Home', () => [], (rows) => rows, true);
createEndpoint('/descricao', 'SELECT * FROM Descricao', () => [], (rows) => rows, true);
createEndpoint('/bibliografia', 'SELECT descricao FROM Bibliografia', () => [], (rows) => rows, true);
createEndpoint('/equipa', 'SELECT nome, cargo FROM Equipa', () => [], (rows) => rows, true);
createUpdateEndpoint('/equipa', 'equipa', ['nome', 'cargo'], true);
createEndpoint('/contactos', 'SELECT nome, email FROM Contactos', () => [], (rows) => rows, true);

createEndpoint('/overview', 'SELECT * FROM overview', () => [], (rows) => rows, true);
createEndpoint('/sobre', 'SELECT * FROM materiais', () => [], (rows) => rows, true);





//Aba Projeto Raul Lino
createEndpoint('/home', 'SELECT descricao_pt FROM Home', () => [], (rows) => rows);
createEndpoint('/descricao', 'SELECT descricao_pt, descricao_en FROM Descricao', () => [], (rows) => rows);
createEndpoint('/bibliografia', 'SELECT descricao FROM Bibliografia', () => [], (rows) => rows);
createEndpoint('/equipa', 'SELECT * FROM Equipa ORDER BY cargo, nome', () => [], (rows) => rows);
createEndpoint('/equipa/:id', 'SELECT * FROM equipa WHERE id = ?', (req) => [req.params.id], (rows) => rows);
createEndpoint('/contactos', 'SELECT nome, email FROM contactos', () => [], (rows) => rows);

//Aba Carreira em Arquitetura
createEndpoint('/overview', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM overview', () => [], (rows) => rows);
createEndpoint('/materiais', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM materiais', () => [], (rows) => rows);
createEndpoint('/iconic', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM obras_iconicas', () => [], (rows) => rows);

//Aba Médio Tejo
createEndpoint('/obras', 'SELECT * FROM obra', () => [], (rows) => rows);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

connection();
