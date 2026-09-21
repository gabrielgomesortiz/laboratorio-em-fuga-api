const express = require('express');
const router = express.Router();
const partidaController = require('../controllers/partidaController');

router.get('/', partidaController.listarTodos);
router.get('/:id', partidaController.buscarPorId);
router.post('/', partidaController.criar);
router.put('/:id', partidaController.atualizar);
router.delete('/:id', partidaController.remover);

module.exports = router;
