const express = require('express');
const cors = require('cors');

const jogadorRoutes = require('./routes/jogadorRoutes');
const partidaRoutes = require('./routes/partidaRoutes');
const enigmaRoutes = require('./routes/enigmaRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'API do Laboratório em Fuga funcionando.' });
});

app.use('/api/jogadores', jogadorRoutes);
app.use('/api/partidas', partidaRoutes);
app.use('/api/enigmas', enigmaRoutes);
app.use('/api/ranking', rankingRoutes);

app.use(errorHandler);

module.exports = app;
