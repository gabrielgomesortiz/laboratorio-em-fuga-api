const jogadorRepository = require('../repositories/jogadorRepository');

class JogadorService {
    async listarTodos() {
        return jogadorRepository.listarTodos();
    }

    async buscarPorId(id) {
        const jogador = await jogadorRepository.buscarPorId(id);

        if (!jogador) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return jogador;
    }

    async criar(dados) {
        if (!dados || !dados.nome) {
            const error = new Error('Nome do jogador é obrigatório.');
            error.statusCode = 400;
            throw error;
        }

        return jogadorRepository.criar(dados);
    }

    async atualizar(id, dados) {
        const jogadorExistente = await jogadorRepository.buscarPorId(id);

        if (!jogadorExistente) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return jogadorRepository.atualizar(id, dados);
    }

    async remover(id) {
        const jogador = await jogadorRepository.buscarPorId(id);

        if (!jogador) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return jogadorRepository.remover(id);
    }
}

module.exports = new JogadorService();
