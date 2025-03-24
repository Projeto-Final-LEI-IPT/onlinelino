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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.info('Token de autenticação não fornecido.');
        return res.status(403).json({ error: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.info(`Token fornecido por ${user} é inválido`);
            return res.status(403).json({ error: 'Token inválido.' });
        }
        req.user = user;
        next();
    });
};

const createEndpoint = (path, query, paramsExtractor = () => [], transform = rows => rows, requiresAuth = false) => {
    app.get(`/${BACKOFFICE_URL}${path}`, async (req, res) => {
        if (requiresAuth) {
            return authenticateToken(req, res, async () => {
                await handleRequest(req, res, query, paramsExtractor, transform);
            });
        }
        await handleRequest(req, res, query, paramsExtractor, transform);
    });
};

const handleRequest = async (req, res, query, paramsExtractor, transform) => {
    const safeTransform = transform || (rows => rows);
    let db;
    try {
        db = await connection();

        const params = paramsExtractor(req);

        const [rows] = await db.execute(query, params);
        res.json(safeTransform(rows));
    } catch (error) {
        console.error(`Erro ao buscar dados para ${req.path}:`, error.message);
        res.status(500).send('Erro interno. Tente novamente mais tarde');
    } finally {
        if (db) await db.end();
    }
};

app.post(`/${BACKOFFICE_URL}/register`, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.info('Email e password são obrigatórios.');
        return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    if (password.length < 4) {
        console.info('A password deve ter pelo menos 4 caracteres.');
        return res.status(400).json({ error: 'A password deve ter pelo menos 4 caracteres.' });
    }

    let db;
    try {
        db = await connection();
        const [existingUsers] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            console.info(`O email: ${email} já esta em uso.`);
            return res.status(409).json({ error: 'O email já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        console.info(`Novo utilizador criado com sucesso: ${email}`);
        res.status(201).json({ message: 'Utilizador registado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registar Utilizador:', error.message);
        res.status(500).json({ error: 'Erro ao registar Utilizador.' });
    } finally {
        if (db) await db.end();
    }
});

app.post(`/${BACKOFFICE_URL}/login`, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    let db;
    try {
        db = await connection();
        const [users] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);

        if (users.length === 0) {
            console.info(`${email} inexistente.`);
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.info(`O user com email ${user} digitou a password errada`);
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Chave secreta JWT não configurada.');
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
        console.info(`${email} realizou login.`);
        res.status(200).json(createResponseOnSuccess('Login executado com sucesso', token));
    } catch (error) {
        console.error('Erro ao processar login:', error.message);
        res.status(500).json({ error: 'Erro ao processar login.' });
    } finally {
        if (db) await db.end();
    }
});


//Páginas do backoffice devem estar todas protegidas
//createEndpoint('/protected', 'SELECT * FROM ProtectedData', null, true);
createEndpoint(`/${BACKOFFICE_URL}/bibliografia`, 'SELECT * FROM Bibliografia', [], null, true);

//Aba Projeto Raul Lino
createEndpoint('/home', 'SELECT descricao_pt FROM Home', []);
createEndpoint('/bibliografia', 'SELECT descricao FROM Bibliografia', []);
createEndpoint('/equipa', 'SELECT * FROM Equipa ORDER BY cargo, nome', [], null, true);
createEndpoint('/equipa/:id', 'SELECT * FROM equipa WHERE id = ?', req => [req.params.id]);
createEndpoint('/contactos', 'SELECT nome, email FROM contactos', []);

//Aba Carreira em Arquitetura
createEndpoint('/overview', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM overview', []);
createEndpoint('/materiais', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM materiais', []);
createEndpoint('/iconic', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM obras_iconicas', []);

//Aba Médio Tejo
createEndpoint('/obras', 'SELECT * FROM obra', []);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connection();
