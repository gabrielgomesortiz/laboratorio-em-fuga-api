const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogadorController');

// Operações de Leitura
router.get('/', jogadorController.listarTodos);
router.get('/:id', jogadorController.buscarPorId);

// Operações de Escrita e Modificação
router.post('/', jogadorController.criar);
router.put('/:id', jogadorController.atualizar);
router.delete('/:id', jogadorController.remover);

module.exports = router;