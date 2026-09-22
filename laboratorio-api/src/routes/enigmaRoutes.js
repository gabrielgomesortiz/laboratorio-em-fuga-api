const express = require('express');
const router = express.Router();
const enigmaController = require('../controllers/enigmaController');

// Rotas de Consulta
router.get('/', enigmaController.listarTodos);
router.get('/aleatorio', enigmaController.buscarAleatorio); // DEVE vir antes de /:id
router.get('/:id', enigmaController.buscarPorId);

// Rotas de Ação e Interação
router.post('/', enigmaController.criar);
router.post('/:id/responder', enigmaController.responder);

// Rotas de Alteração e Remoção
router.put('/:id', enigmaController.atualizar);
router.delete('/:id', enigmaController.remover);

module.exports = router;