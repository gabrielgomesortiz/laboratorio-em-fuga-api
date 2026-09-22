const jogadorRepository = require('../repositories/jogadorRepository');

class JogadorService {
    async listarTodos() {
        return jogadorRepository.listarTodos();
    }

    async buscarPorId(id) {
        if (!id) {
            const error = new Error('ID do jogador é obrigatório.');
            error.statusCode = 400;
            throw error;
        }

        const jogador = await jogadorRepository.buscarPorId(id);

        if (!jogador) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return jogador;
    }

    async criar(dados) {
        if (!dados || !dados.nome || !dados.nome.trim()) {
            const error = new Error('Nome do jogador é obrigatório.');
            error.statusCode = 400;
            throw error;
        }

        // Remove espaços extras nas extremidades
        const dadosFormatados = {
            ...dados,
            nome: dados.nome.trim()
        };

        return jogadorRepository.criar(dadosFormatados);
    }

    async atualizar(id, dados) {
        await this.buscarPorId(id); // Já lança erro 400 (se sem ID) ou 404 (se não encontrado)

        if (dados && dados.nome !== undefined) {
            if (!dados.nome || !dados.nome.trim()) {
                const error = new Error('Nome do jogador não pode ser vazio.');
                error.statusCode = 400;
                throw error;
            }
            dados.nome = dados.nome.trim();
        }

        return jogadorRepository.atualizar(id, dados);
    }

    async remover(id) {
        await this.buscarPorId(id); // Reutiliza a validação e busca

        return jogadorRepository.remover(id);
    }
}

module.exports = new JogadorService();