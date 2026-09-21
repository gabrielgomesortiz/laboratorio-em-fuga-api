const express = require('express');
const router = express.Router();
const enigmaController = require('../controllers/enigmaController');

router.get('/', enigmaController.listarTodos);
router.get('/:id', enigmaController.buscarPorId);
router.post('/', enigmaController.criar);
router.put('/:id', enigmaController.atualizar);
router.delete('/:id', enigmaController.remover);

module.exports = router;
