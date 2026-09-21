const rankingRepository = require('../repositories/rankingRepository');

class RankingService {
    async listarTodos() {
        return rankingRepository.listarTodos();
    }

    async buscarPorId(id) {
        const item = await rankingRepository.buscarPorId(id);

        if (!item) {
            const error = new Error('Registro de ranking não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return item;
    }

    async criar(dados) {
        if (!dados || !dados.pontuacao) {
            const error = new Error('Pontuação é obrigatória.');
            error.statusCode = 400;
            throw error;
        }

        return rankingRepository.criar(dados);
    }

    async atualizar(id, dados) {
        const itemExistente = await rankingRepository.buscarPorId(id);

        if (!itemExistente) {
            const error = new Error('Registro de ranking não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return rankingRepository.atualizar(id, dados);
    }

    async remover(id) {
        const item = await rankingRepository.buscarPorId(id);

        if (!item) {
            const error = new Error('Registro de ranking não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return rankingRepository.remover(id);
    }
}

module.exports = new RankingService();
