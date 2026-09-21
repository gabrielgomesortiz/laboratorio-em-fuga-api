const rankingService = require('../services/rankingService');

class RankingController {
  async listarTodos(req, res, next) {
    try {
      const ranking = await rankingService.listarTodos();
      res.status(200).json(ranking);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const item = await rankingService.buscarPorId(id);
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  }

  async criar(req, res, next) {
    try {
      const item = await rankingService.criar(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const item = await rankingService.atualizar(id, req.body);
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  }

  async remover(req, res, next) {
    try {
      const { id } = req.params;
      await rankingService.remover(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RankingController();
