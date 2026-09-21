const enigmaRepository = require('../repositories/enigmaRepository');

class EnigmaService {
    async listarTodos() {
        return enigmaRepository.listarTodos();
    }

    async buscarPorId(id) {
        const enigma = await enigmaRepository.buscarPorId(id);

        if (!enigma) {
            const error = new Error('Enigma não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return enigma;
    }

    async criar(dados) {
        if (!dados || !dados.titulo) {
            const error = new Error('Título do enigma é obrigatório.');
            error.statusCode = 400;
            throw error;
        }

        return enigmaRepository.criar(dados);
    }

    async atualizar(id, dados) {
        const enigmaExistente = await enigmaRepository.buscarPorId(id);

        if (!enigmaExistente) {
            const error = new Error('Enigma não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return enigmaRepository.atualizar(id, dados);
    }

    async remover(id) {
        const enigma = await enigmaRepository.buscarPorId(id);

        if (!enigma) {
            const error = new Error('Enigma não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return enigmaRepository.remover(id);
    }
}

module.exports = new EnigmaService();
