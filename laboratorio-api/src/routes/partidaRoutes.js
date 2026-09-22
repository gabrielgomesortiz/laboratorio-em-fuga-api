const express = require('express');
const router = express.Router();
const partidaController = require('../controllers/partidaController');

// Mapeamentos relativos a '/api/partidas'
router.get('/', partidaController.listarTodos);              // GET  /api/partidas
router.post('/', partidaController.criar);                   // POST /api/partidas
router.get('/:id', partidaController.buscarPorId);           // GET  /api/partidas/:id
router.put('/:id', partidaController.atualizar);             // PUT  /api/partidas/:id
router.delete('/:id', partidaController.remover);            // DELETE /api/partidas/:id

// Endpoint acionado pelo Final.jsx ao salvar o nome
router.post('/:id/finalizar', partidaController.finalizar);  // POST /api/partidas/:id/finalizar

module.exports = router;