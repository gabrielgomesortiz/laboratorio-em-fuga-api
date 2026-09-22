const jogadorService = require('../services/jogadorService');

class JogadorController {
  listarTodos = async (req, res, next) => {
    try {
      const jogadores = await jogadorService.listarTodos();
      res.status(200).json(jogadores);
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const jogador = await jogadorService.buscarPorId(id);
      res.status(200).json(jogador);
    } catch (error) {
      next(error);
    }
  };

  criar = async (req, res, next) => {
    try {
      const jogador = await jogadorService.criar(req.body);
      res.status(201).json(jogador);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const jogador = await jogadorService.atualizar(id, req.body);
      res.status(200).json(jogador);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req, res, next) => {
    try {
      const { id } = req.params;
      await jogadorService.remover(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new JogadorController();