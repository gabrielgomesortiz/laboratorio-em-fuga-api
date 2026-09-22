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

    async responder(id, dados) {
        const { partidaId, resposta } = dados || {};

        if (!resposta) {
            const error = new Error('Resposta é obrigatória.');
            error.statusCode = 400;
            throw error;
        }

        const enigma = await enigmaRepository.buscarPorId(id);

        if (!enigma) {
            const error = new Error('Enigma não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        const respostaEnviada = String(resposta)
            .trim()
            .toUpperCase();

        const respostaCorreta = String(enigma.resposta_correta)
            .trim()
            .toUpperCase();

        const acertou = respostaEnviada === respostaCorreta;

        // Tenta registrar no banco apenas se o partidaId for enviado e o repositório possuir suporte
        if (partidaId) {
            try {
                if (typeof enigmaRepository.registrarTentativa === 'function') {
                    await enigmaRepository.registrarTentativa({
                        partida_id: partidaId,
                        enigma_id: enigma.id,
                        resposta_enviada: respostaEnviada,
                        acertou,
                    });
                }

                if (acertou && typeof enigmaRepository.concluirEnigma === 'function') {
                    await enigmaRepository.concluirEnigma(
                        partidaId,
                        enigma.id
                    );
                }
            } catch (err) {
                console.warn('Registro opcional da tentativa falhou no banco:', err.message);
            }
        }

        return {
            acertou,
            enigmaId: enigma.id,
            partidaId: partidaId || null,
        };
    }

    async buscarAleatorio(partidaId) {
        // Torna a busca por ID de partida opcional
        const enigma = await enigmaRepository.buscarAleatorio(partidaId);

        if (!enigma) {
            const error = new Error(
                'Não há enigmas disponíveis.'
            );
            error.statusCode = 404;
            throw error;
        }

        return enigma;
    }
}

module.exports = new EnigmaService();