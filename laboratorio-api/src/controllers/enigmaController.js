const enigmaService = require('../services/enigmaService');

class EnigmaController {
    async listarTodos(req, res, next) {
        try {
            const enigmas = await enigmaService.listarTodos();
            res.status(200).json(enigmas);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const enigma = await enigmaService.buscarPorId(id);
            res.status(200).json(enigma);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const enigma = await enigmaService.criar(req.body);
            res.status(201).json(enigma);
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const enigma = await enigmaService.atualizar(id, req.body);
            res.status(200).json(enigma);
        } catch (error) {
            next(error);
        }
    }

    async remover(req, res, next) {
        try {
            const { id } = req.params;
            await enigmaService.remover(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EnigmaController();
