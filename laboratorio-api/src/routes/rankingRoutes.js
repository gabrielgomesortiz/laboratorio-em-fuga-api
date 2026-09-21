const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

router.get('/', rankingController.listarTodos);
router.get('/:id', rankingController.buscarPorId);
router.post('/', rankingController.criar);
router.put('/:id', rankingController.atualizar);
router.delete('/:id', rankingController.remover);

module.exports = router;
