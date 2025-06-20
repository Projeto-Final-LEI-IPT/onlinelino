const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const baseUrl = process.env.BASE_URL || 'http://onlinelino.ipt.pt:8080';
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const connection = require('/onlinelino/src/server/dbConfig.js');
const createResponseOnSuccess = require('./Utils.js');

dotenv.config();
const app = express();

const PORT = 8080;
const BACKOFFICE_URL = 'backoffice';

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/img', express.static(path.join(__dirname, 'public/img/backoffice')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'public/img/backoffice')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, name + ext);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(file.mimetype)) return cb(new Error('Tipo de ficheiro inválido'), false);
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

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
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
        for (const [i, val] of values.entries()) {
            if (val === undefined) {
                return res.status(400).json({ error: `Campo obrigatório '${fields[i]}' está ausente.` });
            }
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

const createBulkUpdateEndpoint = (path, tableName, fields) => {
    const endpointPath = `/${BACKOFFICE_URL}${path}`;

    app.put(endpointPath, authenticateToken, async (req, res) => {
        const records = req.body;
        if (!Array.isArray(records)) {
            return res.status(400).json({ error: 'Array esperado no corpo da requisição.' });
        }
        let db;
        try {
            db = await connection();
            for (const record of records) {
                const { id } = record;
                const values = fields.map(field => record[field]);
                if (values.includes(undefined)) continue;
                if (id && !isNaN(id)) {
                    const setClause = fields.map(field => `${field} = ?`).join(', ');
                    const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
                    await db.execute(query, [...values, id]);
                } else {
                    const columns = fields.join(', ');
                    const placeholders = fields.map(() => '?').join(', ');
                    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
                    await db.execute(query, values);
                }
            }
            res.json({ message: 'Registos processados com sucesso.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao processar registos.' });
        } finally {
            if (db) await db.end();
        }
    });
};

const createDeleteEndpoint = (routePath, tableName) => {
    const endpointRoutePath = `/${BACKOFFICE_URL}${routePath}/:id`;

    app.delete(endpointRoutePath, authenticateToken, async (req, res) => {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
        let db;
        try {
            db = await connection();
            if (tableName === 'materiais_imagem') {
                const [rows] = await db.execute('SELECT path FROM materiais_imagem WHERE id = ?', [id]);
                if (rows.length && rows[0].path) {
                    const filePath = path.join(__dirname, 'public', rows[0].path);
                    fs.unlink(filePath, (err) => {
                        if (err) console.warn(`Erro ao apagar o ficheiro ${filePath}:`, err.message);
                    });
                    
                }
            }
            const [result] = await db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Registo não encontrado.' });
            }
            res.status(200).json({ message: 'Registo apagado com sucesso.', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao apagar registo.' });
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
    } catch (err) {
        console.error(err);
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
        res.status(200).json(createResponseOnSuccess('Login executado com sucesso', token, '1h'));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao processar login.' });
    } finally {
        if (db) await db.end();
    }
});

// Backoffice GETs
createEndpoint('/home', 'SELECT * FROM Home', () => [], rows => rows, true);
createEndpoint('/descricao', 'SELECT * FROM Descricao', () => [], rows => rows, true);
createEndpoint('/bibliografia', 'SELECT * FROM Bibliografia', () => [], rows => rows, true);
createEndpoint('/equipa', 'SELECT * FROM Equipa', () => [], rows => rows, true);
createEndpoint('/contactos', 'SELECT * FROM Contactos', () => [], rows => rows, true);
createEndpoint('/overview', 'SELECT * FROM overview', () => [], rows => rows, true);
createEndpoint('/sobre', 'SELECT * FROM materiais', () => [], rows => rows, true);

// Backoffice PUTs
createUpdateEndpoint('/equipa', 'equipa', ['nome', 'cargo']);
createUpdateEndpoint('/descricao', 'Descricao', ['descricao_pt', 'descricao_en']);
createBulkUpdateEndpoint('/contactos', 'Contactos', ['nome', 'email']);
createBulkUpdateEndpoint('/equipa', 'Equipa', ['nome', 'cargo']);
createUpdateEndpoint('/bibliografia', 'Bibliografia', ['texto_html']);
createUpdateEndpoint('/overview', 'Overview', ['descricao_pt', 'descricao_en']);

// Backoffice DELETEs
createDeleteEndpoint('/contactos', 'Contactos');
createDeleteEndpoint('/equipa', 'Equipa');
createDeleteEndpoint('/materiais/imagem', 'materiais_imagem');

// Backoffice GET todos materiais com imagens
createEndpoint(
    '/materiais',
    `
SELECT 
  m.id,
  m.descricao_pt,
  m.descricao_en,
  m.modificado_em,
  mi.id as imagem_id,
  mi.path as imagem_url,
  mi.descricao as imagem_descricao
FROM materiais m
LEFT JOIN materiais_imagem mi ON mi.material_id = m.id
ORDER BY m.id DESC
  `,
    () => [],
    rows => {
        const map = {};
        for (const row of rows) {
            if (!map[row.id]) {
                map[row.id] = {
                    id: row.id,
                    descricao_pt: row.descricao_pt,
                    descricao_en: row.descricao_en,
                    modificado_em: row.modificado_em,
                    imagens: [],
                };
            }
            if (row.imagem_id) {
                map[row.id].imagens.push({
                    id: row.imagem_id,
                    path: `${baseUrl}${row.imagem_url}`,
                    descricao: row.imagem_descricao,
                });
            }
        }
        return Object.values(map);
    },
    true
);

// Backoffice PUT página material (textos)
createUpdateEndpoint('/materiais', 'materiais', ['descricao_pt', 'descricao_en']);

// Backoffice POST imagem nova 
app.post(`/${BACKOFFICE_URL}/materiais/imagem`, authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Imagem é obrigatória.' });
    const newPath = `/img/${req.file.filename}`;
    const { descricao, material_id } = req.body;
    if (!material_id || isNaN(material_id)) return res.status(400).json({ error: 'material_id inválido.' });

    let db;
    try {
        db = await connection();
        const [result] = await db.execute(
            'INSERT INTO materiais_imagem (material_id, path, descricao) VALUES (?, ?, ?)',
            [material_id, newPath, descricao]
        );
        res.status(201).json({ id: result.insertId, path: `${baseUrl}${newPath}`, descricao: descricao || '' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao adicionar imagem.' });
    } finally {
        if (db) await db.end();
    }
});


// Backoffice PUT imagem existente (file e/ou descrição)
app.put(`/${BACKOFFICE_URL}/materiais/imagem/:id`, authenticateToken, upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    let db;
    try {
        db = await connection();

        let url;
        let newPath;
        if (req.file) {
            newPath = `/img/${req.file.filename}`;
            const [oldRow] = await db.execute('SELECT path FROM materiais_imagem WHERE id = ?', [id]);
            if (oldRow.length && oldRow[0].path) {
                const oldPath = path.join(__dirname, 'public', oldRow[0].path);
                fs.unlink(oldPath, () => { });
            }
        }

        const updates = [];
        const params = [];

        if (newPath) {
            updates.push('path = ?');
            params.push(newPath);
        }
        if (descricao !== undefined) {
            updates.push('descricao = ?');
            params.push(descricao);
        }
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Nada para atualizar.' });
        }
        params.push(id);

        const query = `UPDATE materiais_imagem SET ${updates.join(', ')} WHERE id = ?`;
        await db.execute(query, params);

        res.json({ id, ...(newPath ? { url: `${baseUrl}${newPath}` } : {}), ...(descricao !== undefined ? { descricao } : {}) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar imagem.' });
    } finally {
        if (db) await db.end();
    }
});

// Frontoffice GETs
createEndpoint('/home', 'SELECT descricao_pt FROM Home', () => [], rows => rows);
createEndpoint('/descricao', 'SELECT descricao_pt, descricao_en FROM Descricao', () => [], rows => rows);
createEndpoint('/bibliografia', 'SELECT texto_html FROM Bibliografia', () => [], rows => rows);
createEndpoint('/equipa', 'SELECT nome, cargo FROM Equipa', () => [], rows => rows);
createEndpoint('/equipa/:id', 'SELECT * FROM equipa WHERE id = ?', req => [req.params.id], rows => rows);
createEndpoint('/contactos', 'SELECT nome, email FROM contactos', () => [], rows => rows);
createEndpoint(
    '/overview',
    `
SELECT 
  o.id,
  o.descricao_pt,
  f.filme_url,
  l.link_url
FROM overview o
LEFT JOIN overview_filmes f ON f.overview_id = o.id
LEFT JOIN overview_outros_links l ON l.overview_id = o.id
  `,
    () => [],
    rows => Object.values(
        rows.reduce((acc, { id, descricao_pt, filme_url, link_url }) => {
            if (!acc[id]) {
                acc[id] = { descricao_pt, filmes: [], outros_links: [] };
            }
            if (filme_url && !acc[id].filmes.includes(filme_url)) acc[id].filmes.push(filme_url);
            if (link_url && !acc[id].outros_links.includes(link_url)) acc[id].outros_links.push(link_url);
            return acc;
        }, {})
    )
);
createEndpoint('/materiais', 'SELECT outros_links, filmes, descricao_pt FROM materiais', () => [], rows => rows);
createEndpoint('/iconic', 'SELECT outros_links, filmes, descricao_en, descricao_pt FROM obras_iconicas', () => [], rows => rows);
createEndpoint('/edificios', 'SELECT * FROM edificios', () => [], rows => rows);
createEndpoint(
    '/cronologia',
    `
SELECT
  o.id,
  o.titulo,
  o.data_projeto,
  MIN(CASE WHEN c.cor = 'yellow' THEN c.imagem END) AS imagem_yellow,
  MIN(CASE WHEN c.cor = 'green' THEN c.imagem END) AS imagem_green
FROM obra o
LEFT JOIN obra_imagem_cronologia c ON c.obra_id = o.id
GROUP BY o.id
ORDER BY CAST(SUBSTRING_INDEX(o.data_projeto, '-', 1) AS UNSIGNED)
  `,
    () => [],
    rows => rows
);
createEndpoint('/listaObras', 'SELECT id, titulo, data_projeto FROM obra', () => [], rows => rows);
createEndpoint(
    '/obra/:id',
    `
SELECT 
  o.id AS obra_id,
  o.titulo,
  o.data_projeto,
  o.tipologia,
  o.localizacao,
  o.descricao_pt,
  o.descricao_en,
  o.latitude,
  o.longitude,
  i.id AS imagem_id,
  i.caminho AS imagem_caminho,
  i.descricao_pt AS imagem_descricao_pt,
  i.descricao_en AS imagem_descricao_en,
  c.id AS cronologia_id,
  c.imagem AS cronologia_imagem,
  c.cor AS cronologia_cor,
  info.id AS info_id,
  info.texto AS info_texto,
  f.id AS fonte_id,
  f.descricao AS fonte_descricao,
  f.link AS fonte_link,
  b.id AS biblio_id,
  b.texto AS biblio_texto,
  b.url AS biblio_url
FROM obra o
LEFT JOIN obra_imagem i ON i.obra_id = o.id
LEFT JOIN obra_imagem_cronologia c ON c.obra_id = o.id
LEFT JOIN obra_info info ON info.obra_id = o.id
LEFT JOIN fonte f ON f.obra_id = o.id
LEFT JOIN fonte_biblio b ON b.fonte_id = f.id
WHERE o.id = ?
  `,
    req => [req.params.id],
    rows => {
        if (rows.length === 0) return {};
        const obra = {
            id: rows[0].obra_id,
            titulo: rows[0].titulo,
            data_projeto: rows[0].data_projeto,
            tipologia: rows[0].tipologia,
            localizacao: rows[0].localizacao,
            descricao_pt: rows[0].descricao_pt,
            descricao_en: rows[0].descricao_en,
            latitude: rows[0].latitude,
            longitude: rows[0].longitude,
            imagens: [],
            cronologia: [],
            info: [],
            fontes: [],
            outros_links: []
        };
        const imagensSet = new Set();
        const cronologiaSet = new Set();
        const infoSet = new Set();
        const fonteMap = new Map();
        const outrosLinksSet = new Set();

        for (const row of rows) {
            if (row.imagem_id && !imagensSet.has(row.imagem_id)) {
                imagensSet.add(row.imagem_id);
                obra.imagens.push({
                    id: row.imagem_id,
                    caminho: row.imagem_caminho,
                    descricao_pt: row.imagem_descricao_pt,
                    descricao_en: row.imagem_descricao_en
                });
            }
            if (row.cronologia_id && !cronologiaSet.has(row.cronologia_id)) {
                cronologiaSet.add(row.cronologia_id);
                obra.cronologia.push({
                    id: row.cronologia_id,
                    imagem: row.cronologia_imagem,
                    cor: row.cronologia_cor
                });
            }
            if (row.info_id && !infoSet.has(row.info_id)) {
                infoSet.add(row.info_id);
                obra.info.push({ id: row.info_id, texto: row.info_texto });
            }
            if (row.fonte_id) {
                if (!fonteMap.has(row.fonte_id)) {
                    fonteMap.set(row.fonte_id, {
                        id: row.fonte_id,
                        descricao: row.fonte_descricao,
                        link: row.fonte_link,
                        bibliografia: [],
                        _biblioSet: new Set(),
                    });
                }
                const fonte = fonteMap.get(row.fonte_id);
                if (row.biblio_id && row.biblio_url) {
                    const key = `${row.biblio_id}-${row.biblio_url}`;
                    if (!fonte._biblioSet.has(key)) {
                        fonte._biblioSet.add(key);
                        fonte.bibliografia.push({ id: row.biblio_id, texto: row.biblio_texto, url: row.biblio_url });
                        if (!outrosLinksSet.has(row.biblio_url)) {
                            outrosLinksSet.add(row.biblio_url);
                            obra.outros_links.push(row.biblio_url);
                        }
                    }
                }
            }
        }
        obra.fontes = Array.from(fonteMap.values()).map(f => { delete f._biblioSet; return f; });
        return obra;
    }
);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
connection();
