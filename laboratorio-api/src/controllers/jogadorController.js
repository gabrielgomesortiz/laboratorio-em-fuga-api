const jogadorService = require('../services/jogadorService');

class JogadorController {
  async listarTodos(req, res, next) {
    try {
      const jogadores = await jogadorService.listarTodos();
      res.status(200).json(jogadores);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const jogador = await jogadorService.buscarPorId(id);
      res.status(200).json(jogador);
    } catch (error) {
      next(error);
    }
  }

  async criar(req, res, next) {
    try {
      const jogador = await jogadorService.criar(req.body);
      res.status(201).json(jogador);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const jogador = await jogadorService.atualizar(id, req.body);
      res.status(200).json(jogador);
    } catch (error) {
      next(error);
    }
  }

  async remover(req, res, next) {
    try {
      const { id } = req.params;
      await jogadorService.remover(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JogadorController();
