const rankingRepository = require('../repositories/rankingRepository');

class RankingService {
    async listarTodos() {
        return rankingRepository.listarTodos();
    }

    async buscarPorId(id) {
        if (!id) {
            const error = new Error('ID do registro de ranking é obrigatório.');
            error.statusCode = 400;
            throw error;
        }

        const item = await rankingRepository.buscarPorId(id);

        if (!item) {
            const error = new Error('Registro de ranking não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return item;
    }

    async criar(dados) {
        if (!dados || dados.pontuacao === undefined || dados.pontuacao === null) {
            const error = new Error('Pontuação é obrigatória.');
            error.statusCode = 400;
            throw error;
        }

        if (typeof dados.pontuacao !== 'number' || dados.pontuacao < 0) {
            const error = new Error('A pontuação deve ser um número maior ou igual a zero.');
            error.statusCode = 400;
            throw error;
        }

        return rankingRepository.criar(dados);
    }

    async atualizar(id, dados) {
        await this.buscarPorId(id); // Já lança erro 400 ou 404 se não existir

        return rankingRepository.atualizar(id, dados);
    }

    async remover(id) {
        await this.buscarPorId(id); // Reaproveita a verificação de existência e ID válido

        return rankingRepository.remover(id);
    }
}

module.exports = new RankingService();