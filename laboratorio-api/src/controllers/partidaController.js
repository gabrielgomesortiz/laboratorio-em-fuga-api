const partidaService = require('../services/partidaService');

class PartidaController {
  async listarTodos(req, res, next) {
    try {
      const partidas = await partidaService.listarTodos();
      res.status(200).json(partidas);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const partida = await partidaService.buscarPorId(id);
      res.status(200).json(partida);
    } catch (error) {
      next(error);
    }
  }

  async criar(req, res, next) {
    try {
      const partida = await partidaService.criar(req.body);
      res.status(201).json(partida);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const partida = await partidaService.atualizar(id, req.body);
      res.status(200).json(partida);
    } catch (error) {
      next(error);
    }
  }

  async remover(req, res, next) {
    try {
      const { id } = req.params;
      await partidaService.remover(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PartidaController();
