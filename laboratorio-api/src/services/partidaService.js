const partidaRepository = require('../repositories/partidaRepository');

class PartidaService {
    async listarTodos() {
        return partidaRepository.listarTodos();
    }

    async buscarPorId(id) {
        const partida = await partidaRepository.buscarPorId(id);

        if (!partida) {
            const error = new Error('Partida não encontrada.');
            error.statusCode = 404;
            throw error;
        }

        return partida;
    }

    async criar(dados) {
        if (!dados || !dados.status) {
            const error = new Error('Status da partida é obrigatório.');
            error.statusCode = 400;
            throw error;
        }

        return partidaRepository.criar(dados);
    }

    async atualizar(id, dados) {
        const partidaExistente = await partidaRepository.buscarPorId(id);

        if (!partidaExistente) {
            const error = new Error('Partida não encontrada.');
            error.statusCode = 404;
            throw error;
        }

        return partidaRepository.atualizar(id, dados);
    }

    async remover(id) {
        const partida = await partidaRepository.buscarPorId(id);

        if (!partida) {
            const error = new Error('Partida não encontrada.');
            error.statusCode = 404;
            throw error;
        }

        return partidaRepository.remover(id);
    }
}

module.exports = new PartidaService();
