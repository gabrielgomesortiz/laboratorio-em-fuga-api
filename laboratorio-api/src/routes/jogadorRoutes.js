const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogadorController');

router.get('/', jogadorController.listarTodos);
router.get('/:id', jogadorController.buscarPorId);
router.post('/', jogadorController.criar);
router.put('/:id', jogadorController.atualizar);
router.delete('/:id', jogadorController.remover);

module.exports = router;
