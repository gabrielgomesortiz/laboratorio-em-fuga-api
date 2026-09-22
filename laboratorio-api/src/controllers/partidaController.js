const partidaService = require('../services/partidaService');

class PartidaController {
  listarTodos = async (req, res, next) => {
    try {
      const partidas = await partidaService.listarTodos();
      res.status(200).json(partidas);
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const partida = await partidaService.buscarPorId(id);
      res.status(200).json(partida);
    } catch (error) {
      next(error);
    }
  };

  criar = async (req, res, next) => {
    try {
      const partida = await partidaService.criar(req.body);
      res.status(201).json(partida);
    } catch (error) {
      next(error);
    }
  };

  finalizar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const nome = req.body.nome || req.body.nomeJogador;

      if (nome) {
        const partidaFinalizada = await partidaService.finalizarComJogador(id, nome);
        return res.status(200).json(partidaFinalizada);
      }

      const { tempo_total } = req.body;
      const partida = await partidaService.finalizar(id, tempo_total);
      res.status(200).json(partida);
    } catch (error) {
      next(error);
    }
  };

  obterRanking = async (req, res, next) => {
    try {
      const ranking = await partidaService.obterRanking();
      res.status(200).json(ranking);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const partida = await partidaService.atualizar(id, req.body);
      res.status(200).json(partida);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req, res, next) => {
    try {
      const { id } = req.params;
      await partidaService.remover(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new PartidaController();