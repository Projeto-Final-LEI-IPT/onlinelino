const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const baseUrl = process.env.BASE_URL || 'http://onlinelino.ipt.pt:8080';
const cors = require('cors');
const morgan = require('morgan');
const sharp = require('sharp');
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

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) return cb(new Error('Tipo de ficheiro inválido'), false);
        cb(null, true);
    },
    limits: { fileSize: 3 * 1024 * 1024 }
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
        if (!rows.length) {
            const error = new Error("Edifício não encontrado");
            error.statusCode = 404;
            throw error;
          }
        res.json(transform(rows));
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).send(error.message || 'Erro interno');
        console.error(error);      
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

//Backoffice

//GETs
createEndpoint('/home', 'SELECT * FROM Home', () => [], rows => rows, true);
createEndpoint('/descricao', 'SELECT * FROM Descricao', () => [], rows => rows, true);
createEndpoint('/bibliografia', 'SELECT * FROM Bibliografia', () => [], rows => rows, true);
createEndpoint('/equipa', 'SELECT * FROM Equipa', () => [], rows => rows, true);
createEndpoint('/contactos', 'SELECT * FROM Contactos', () => [], rows => rows, true);
createEndpoint('/overview', 'SELECT * FROM overview', () => [], rows => rows, true);
createEndpoint(
    '/edificio/:id',
    `
    SELECT 
      e.id AS edificio_id,
      e.titulo,
      e.data_projeto,
      e.tipologia,
      e.localizacao,
      e.descricao_pt,
      e.descricao_en,
      e.fontes_bibliografia,
      e.latitude,
      e.longitude,
      f.id AS foto_id,
      f.legenda_pt,
      f.legenda_en,
      f.caminho,
      f.caminho_cronologia,
      f.cor
    FROM Edificio e
    LEFT JOIN Edificio_foto f ON f.edificio_id = e.id
    WHERE e.id = ?
    `,
    req => [req.params.id],
    rows => {
        if (!rows.length) return {};

        const edificio = {
            id: rows[0].edificio_id,
            titulo: rows[0].titulo,
            data_projeto: rows[0].data_projeto,
            tipologia: rows[0].tipologia,
            localizacao: rows[0].localizacao,
            descricao_pt: rows[0].descricao_pt,
            descricao_en: rows[0].descricao_en,
            fontes_bibliografia: rows[0].fontes_bibliografia,
            latitude: rows[0].latitude,
            longitude: rows[0].longitude,
            imagens: []
        };

        const imagemSet = new Set();
        for (const row of rows) {
            if (row.foto_id && !imagemSet.has(row.foto_id)) {
                imagemSet.add(row.foto_id);
                edificio.imagens.push({
                    id: row.foto_id,
                    legenda_pt: row.legenda_pt,
                    legenda_en: row.legenda_en,
                    caminho: `${baseUrl}${row.caminho}`,
                    caminho_cronologia: `${baseUrl}${row.caminho_cronologia}`,
                    cor: row.cor
                });
            }
        }

        return edificio;
    },
    true
);
createEndpoint('/materiais/:id', 'SELECT * FROM materiais WHERE id = ?', req => [req.params.id], rows => rows, true);
createEndpoint('/listaEdificios', 'SELECT id, titulo, data_projeto FROM edificio', () => [], rows => rows, true);

//POSTs
//Criar novo edificio
app.post(`/${BACKOFFICE_URL}/edificio`, authenticateToken, upload.array('fotos', 10), async (req, res) => {
    const {
        titulo,
        data_projeto,
        tipologia,
        localizacao,
        descricao_pt,
        descricao_en,
        fontes_bibliografia,
        latitude,
        longitude,
        fotos_meta
    } = req.body;

    let db;
    try {
        db = await connection();
        await db.beginTransaction();
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: "Latitude ou longitude inválida." });
        }

        const [result] = await db.execute(`
        INSERT INTO Edificio (
          titulo, data_projeto, tipologia, localizacao, descricao_pt,
          descricao_en, fontes_bibliografia, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            titulo, data_projeto, tipologia, localizacao, descricao_pt,
            descricao_en, fontes_bibliografia,
            latitude || null, longitude || null
        ]);

        const edificioId = result.insertId;

        const fotosMetaParsed = JSON.parse(fotos_meta || '[]');

        const [ultimaCorResult] = await db.execute(`
        SELECT cor FROM Edificio_foto
        WHERE caminho_cronologia IS NOT NULL AND cor IS NOT NULL
        ORDER BY id DESC LIMIT 1
      `);

        let ultimaCor = ultimaCorResult.length ? ultimaCorResult[0].cor : "yellow";
        let proximaCor = ultimaCor === "yellow" ? "green" : "yellow";

        for (let i = 0; i < fotosMetaParsed.length; i++) {
            const meta = fotosMetaParsed[i];
            const file = req.files[i];
            if (!file) continue;

            const timestamp = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = `${timestamp}.webp`;

            const destinoRoteiro = path.join(__dirname, 'public/img/backoffice/roteiro', filename);
            const destinoRoteiroChrono = path.join(__dirname, 'public/img/backoffice/roteiro_chrono', filename);

            await sharp(file.buffer)
                .resize({ width: 1600, withoutEnlargement: true }) 
                .webp({ quality: 75 })
                .toFile(destinoRoteiro);

            const caminho_cronologia = meta.hasOwnProperty('caminho_cronologia')
                ? `/img/roteiro_chrono/${filename}`
                : null;

            if (caminho_cronologia) {
                fs.mkdirSync(path.dirname(destinoRoteiroChrono), { recursive: true });
                fs.copyFileSync(destinoRoteiro, destinoRoteiroChrono);
            }

            const caminho = `/img/roteiro/${filename}`;
            const legenda_pt = meta.legenda_pt || "";
            const legenda_en = meta.legenda_en || "";

            let cor = null;
            if (caminho_cronologia) {
                cor = proximaCor;
                proximaCor = cor === "yellow" ? "green" : "yellow";
            }

            await db.execute(`
                INSERT INTO Edificio_foto (
                    edificio_id, legenda_pt, legenda_en, caminho, caminho_cronologia, cor
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                edificioId,
                legenda_pt,
                legenda_en,
                caminho,
                caminho_cronologia,
                cor
            ]);
        }

        await db.commit();

        res.status(201).json({ message: "Edifício criado com sucesso!", id: edificioId });
    } catch (err) {
        console.error(err);
        if (db) await db.rollback();
        res.status(500).json({ error: "Erro ao criar edifício." });
    } finally {
        if (db) await db.end();
    }
});

//PUTs
createUpdateEndpoint('/equipa', 'equipa', ['nome', 'cargo']);
createUpdateEndpoint('/descricao', 'Descricao', ['descricao_pt', 'descricao_en']);
createBulkUpdateEndpoint('/contactos', 'Contactos', ['nome', 'email']);
createBulkUpdateEndpoint('/equipa', 'Equipa', ['nome', 'cargo']);
createUpdateEndpoint('/bibliografia', 'Bibliografia', ['texto_html']);
createUpdateEndpoint('/overview', 'Overview', ['descricao_pt', 'descricao_en']);
//Atualizar edificio por ID
app.put(`/${BACKOFFICE_URL}/edificio/:id`, authenticateToken, upload.array('fotos', 10), async (req, res) => {
    const { id } = req.params;
    const {
        titulo,
        data_projeto,
        tipologia,
        localizacao,
        descricao_pt,
        descricao_en,
        fontes_bibliografia,
        latitude,
        longitude,
        fotos_meta
    } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    let db;
    try {
        db = await connection();
        await db.beginTransaction();

        const [rows] = await db.execute('SELECT id FROM Edificio WHERE id = ?', [id]);
        if (!rows.length) {
            await db.rollback();
            return res.status(404).json({ error: 'Edifício não encontrado.' });
        }

        await db.execute(`
            UPDATE Edificio SET 
              titulo = ?, data_projeto = ?, tipologia = ?, localizacao = ?, 
              descricao_pt = ?, descricao_en = ?, fontes_bibliografia = ?, 
              latitude = ?, longitude = ?
            WHERE id = ?
        `, [
            titulo, data_projeto, tipologia, localizacao,
            descricao_pt, descricao_en, fontes_bibliografia,
            latitude !== undefined ? latitude : null,
            longitude !== undefined ? longitude : null,
            id
        ]);

        let fotosMetaParsed = [];
        try {
            fotosMetaParsed = JSON.parse(fotos_meta || '[]');
        } catch (e) {
            await db.rollback();
            return res.status(400).json({ error: 'fotos_meta inválido.' });
        }

        const idsEnviados = fotosMetaParsed.filter(f => f.id).map(f => f.id);

        const [imagensAtuais] = await db.execute('SELECT id, caminho, caminho_cronologia FROM Edificio_foto WHERE edificio_id = ?', [id]);

        const imagensParaDeletar = imagensAtuais.filter(img => !idsEnviados.includes(img.id));

        for (const imgDel of imagensParaDeletar) {
            await db.execute('DELETE FROM Edificio_foto WHERE id = ?', [imgDel.id]);

            try {
                const caminhoFisico = path.join(__dirname, 'public', imgDel.caminho);
                const caminhoCronoFisico = imgDel.caminho_cronologia
                    ? path.join(__dirname, 'public', imgDel.caminho_cronologia)
                    : null;

                await fs.unlink(caminhoFisico).catch(err => {
                    if (err.code !== 'ENOENT') console.warn('Erro ao apagar arquivo principal:', err);
                });

                if (caminhoCronoFisico) {
                    await fs.unlink(caminhoCronoFisico).catch(err => {
                        if (err.code !== 'ENOENT') console.warn('Erro ao apagar arquivo cronologia:', err);
                    });
                }

            } catch (err) {
                console.warn('Erro ao tentar apagar arquivos da imagem:', err);
            }
        }

        for (const meta of fotosMetaParsed) {
            if (meta.id) {
                const [result] = await db.execute(`
                    UPDATE Edificio_foto SET legenda_pt = ?, legenda_en = ? WHERE id = ?
                `, [
                    meta.legenda_pt ?? null,
                    meta.legenda_en ?? null,
                    meta.id
                ]);
                if (result.affectedRows === 0) {
                    await db.rollback();
                    return res.status(400).json({ error: `Imagem com id ${meta.id} não encontrada.` });
                }
            }
        }

        const fotosMetaComArquivo = fotosMetaParsed.filter(meta => meta.hasNewFile === true);
        if (req.files.length !== fotosMetaComArquivo.length) {
            await db.rollback();
            return res.status(400).json({ error: 'Número de imagens e metadados não conferem.' });
        }

        // Alternância de cores
        let proximaCor = "yellow";

        for (let i = 0; i < fotosMetaComArquivo.length; i++) {
            const meta = fotosMetaComArquivo[i];
            const file = req.files[i];
            if (!file) continue;

            const timestamp = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = `${timestamp}.webp`;

            const destinoRoteiro = path.join(__dirname, 'public/img/backoffice/roteiro', filename);
            const destinoRoteiroChrono = path.join(__dirname, 'public/img/backoffice/roteiro_chrono', filename);

            // Cria diretórios se não existirem
            fs.mkdirSync(path.dirname(destinoRoteiro), { recursive: true });
            fs.mkdirSync(path.dirname(destinoRoteiroChrono), { recursive: true });

            // Converte e salva imagem principal
            await sharp(file.buffer)
                .resize({ width: 1600, withoutEnlargement: true })
                .webp({ quality: 75 })
                .toFile(destinoRoteiro);

            let caminho_cronologia = null;
            let cor = null;

            // Se for imagem cronológica, copia
            if (meta.hasOwnProperty('caminho_cronologia')) {
                fs.copyFileSync(destinoRoteiro, destinoRoteiroChrono);
                caminho_cronologia = `/img/roteiro_chrono/${filename}`;
                cor = proximaCor;
                proximaCor = cor === "yellow" ? "green" : "yellow";
            }

            const caminho = `/img/roteiro/${filename}`;
            const legenda_pt = meta.legenda_pt || "";
            const legenda_en = meta.legenda_en || "";

            if (meta.id) {
                const [result] = await db.execute(`
                    UPDATE Edificio_foto 
                    SET caminho = ?, caminho_cronologia = ?, cor = ?, legenda_pt = ?, legenda_en = ?
                    WHERE id = ?
                `, [caminho, caminho_cronologia, cor, legenda_pt, legenda_en, meta.id]);
                if (result.affectedRows === 0) {
                    await db.rollback();
                    return res.status(400).json({ error: `Imagem com id ${meta.id} não encontrada para atualização.` });
                }
            } else {
                await db.execute(`
                    INSERT INTO Edificio_foto (edificio_id, caminho, caminho_cronologia, cor, legenda_pt, legenda_en)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [id, caminho, caminho_cronologia, cor, legenda_pt, legenda_en]);
            }
        }

        await db.commit();
        res.json({ message: 'Edifício atualizado com sucesso!' });

    } catch (err) {
        if (db) await db.rollback();
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o edifício.' });
    } finally {
        if (db) await db.end();
    }
});
//PUT página material (textos)
createUpdateEndpoint('/materiais', 'materiais', ['descricao_pt', 'descricao_en']);


//DELETEs
createDeleteEndpoint('/contactos', 'Contactos');
createDeleteEndpoint('/equipa', 'Equipa');
//DELETE excluir um edificio e suas imagens
app.delete(`/${BACKOFFICE_URL}/edificio/:id`, authenticateToken, async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    let db;
    try {
        db = await connection();
        await db.beginTransaction();

        // Buscar imagens do edifício
        const [fotos] = await db.execute(
            'SELECT caminho FROM Edificio_foto WHERE edificio_id = ?',
            [id]
        );

        // Deletar edifício 
        const [result] = await db.execute('DELETE FROM Edificio WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            await db.rollback();
            return res.status(404).json({ error: 'Edifício não encontrado.' });
        }

        // Confirmar transação
        await db.commit();

        // Agora apagar os ficheiros físicos 
        fotos.forEach((foto) => {
            if (foto.caminho) {
                const filePath = path.join(__dirname, 'public', foto.caminho);
                fs.unlink(filePath, (err) => {
                    if (err) console.warn(`Erro ao apagar o ficheiro ${filePath}:`, err.message);
                });
            }
        });

        res.status(200).json({ message: 'Edifício excluído com sucesso.', id });
    } catch (error) {
        if (db) await db.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir o edifício.' });
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
createEndpoint('/overview',`SELECT descricao_pt FROM overview`,() => [],rows => rows);
createEndpoint('/materiais', 'SELECT descricao_pt FROM materiais', () => [], rows => rows);
createEndpoint(
    '/cronologia',
    `
  SELECT
    e.id,
    e.titulo,
    e.data_projeto,
    MIN(f.caminho) AS imagem_yellow,
    MIN(f.caminho) AS imagem_green
  FROM edificio e
  LEFT JOIN edificio_foto f ON f.edificio_id = e.id AND f.caminho IS NOT NULL
  GROUP BY e.id
  ORDER BY CAST(SUBSTRING_INDEX(e.data_projeto, '-', 1) AS UNSIGNED)
  `,
    () => [],
    rows => rows.map(row => ({
        ...row,
        imagem_yellow: row.imagem_yellow ? baseUrl + row.imagem_yellow : row.imagem_yellow,
        imagem_green: row.imagem_green ? baseUrl + row.imagem_green : row.imagem_green,
    }))
);
createEndpoint('/listaEdificios', 'SELECT id, titulo, data_projeto FROM edificio', () => [], rows => rows);
createEndpoint(
    '/edificio/:id',
    `
    SELECT 
      e.id AS edificio_id,
      e.titulo,
      e.data_projeto,
      e.tipologia,
      e.localizacao,
      e.descricao_pt,
      e.descricao_en,
      e.fontes_bibliografia,
      e.latitude,
      e.longitude,
      f.id AS foto_id,
      f.legenda_pt,
      f.legenda_en,
      f.caminho,
      f.caminho_cronologia,
      f.cor
    FROM Edificio e
    LEFT JOIN Edificio_foto f ON f.edificio_id = e.id
    WHERE e.id = ?
    `,
    req => [req.params.id],
    rows => {
        if (!rows.length) return {};

        const edificio = {
            id: rows[0].edificio_id,
            titulo: rows[0].titulo,
            data_projeto: rows[0].data_projeto,
            tipologia: rows[0].tipologia,
            localizacao: rows[0].localizacao,
            descricao_pt: rows[0].descricao_pt,
            descricao_en: rows[0].descricao_en,
            fontes_bibliografia: rows[0].fontes_bibliografia,
            latitude: rows[0].latitude,
            longitude: rows[0].longitude,
            imagens: []
        };

        const imagemSet = new Set();
        for (const row of rows) {
            if (row.foto_id && !imagemSet.has(row.foto_id)) {
                imagemSet.add(row.foto_id);
                edificio.imagens.push({
                    id: row.foto_id,
                    legenda_pt: row.legenda_pt,
                    legenda_en: row.legenda_en,
                    caminho: `${baseUrl}${row.caminho}`,
                    caminho_cronologia: `${baseUrl}${row.caminho_cronologia}`,
                    cor: row.cor
                });
            }
        }

        return edificio;
    },
);
createEndpoint(
    '/mapaEdificios',
    `SELECT 
        e.id,
        e.titulo,
        e.latitude,
        e.longitude,
        e.data_projeto,
        CONCAT(?, (
          SELECT ef.caminho
          FROM edificio_foto ef
          WHERE ef.edificio_id = e.id
          ORDER BY ef.criado_em ASC
          LIMIT 1
        )) AS caminho_imagem
     FROM edificio e
     WHERE e.latitude IS NOT NULL AND e.longitude IS NOT NULL`,
    () => [baseUrl],
    rows => rows
  );
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
connection();
