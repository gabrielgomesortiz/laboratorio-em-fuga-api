const enigmaService = require('../services/enigmaService');

class EnigmaController {
    listarTodos = async (req, res, next) => {
        try {
            const enigmas = await enigmaService.listarTodos();
            res.status(200).json(enigmas);
        } catch (error) {
            next(error);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const enigma = await enigmaService.buscarPorId(id);
            res.status(200).json(enigma);
        } catch (error) {
            next(error);
        }
    };

    criar = async (req, res, next) => {
        try {
            const enigma = await enigmaService.criar(req.body);
            res.status(201).json(enigma);
        } catch (error) {
            next(error);
        }
    };

    atualizar = async (req, res, next) => {
        try {
            const { id } = req.params;
            const enigma = await enigmaService.atualizar(id, req.body);
            res.status(200).json(enigma);
        } catch (error) {
            next(error);
        }
    };

    remover = async (req, res, next) => {
        try {
            const { id } = req.params;
            await enigmaService.remover(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    responder = async (req, res, next) => {
        try {
            const { id } = req.params;
            const resultado = await enigmaService.responder(id, req.body);
            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };

    buscarAleatorio = async (req, res, next) => {
        try {
            const { partidaId } = req.query;
            const enigma = await enigmaService.buscarAleatorio(partidaId);
            res.status(200).json(enigma);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new EnigmaController();