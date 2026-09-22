const supabase = require('../config/supabase');

class EnigmaRepository {
    async listarTodos() {
        const { data, error } = await supabase
            .from('enigmas')
            .select('*')
            .order('ordem', { ascending: true }); // Se existir uma coluna de ordem

        if (error) {
            throw error;
        }

        return data;
    }

    async buscarPorId(id) {
        const { data, error } = await supabase
            .from('enigmas')
            .select(`
                *,
                opcoes_enigma (
                    id,
                    letra,
                    texto_opcao
                )
            `)
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    async buscarAleatorio(partidaId) {
        let enigmasConcluidos = [];

        // 1. Busca quais enigmas já foram concluídos nesta partida
        if (partidaId) {
            const { data: progresso, error: progressoError } = await supabase
                .from('progresso_partida')
                .select('enigma_id')
                .eq('partida_id', partidaId)
                .eq('concluido', true);

            if (progressoError) {
                throw progressoError;
            }

            enigmasConcluidos = (progresso || []).map((item) => item.enigma_id);
        }

        // 2. Monta a query para buscar enigmas disponíveis com as opções
        let query = supabase
            .from('enigmas')
            .select(`
                id,
                titulo,
                enunciado,
                dica,
                dificuldade,
                opcoes_enigma (
                    id,
                    letra,
                    texto_opcao
                )
            `);

        // Aplica o filtro 'not in' formatado de maneira segura
        if (enigmasConcluidos.length > 0) {
            query = query.not('id', 'in', `(${enigmasConcluidos.join(',')})`);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return null; // Todos os enigmas já foram concluídos
        }

        // 3. Sorteia um dos enigmas não concluídos
        const indiceAleatorio = Math.floor(Math.random() * data.length);
        return data[indiceAleatorio];
    }

    async verificarResposta(enigmaId, respostaJogador) {
        const { data, error } = await supabase
            .from('enigmas')
            .select('resposta_correta')
            .eq('id', enigmaId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return false;
        }

        // Comparação case-insensitive e sem espaços extras
        const respostaCerta = String(data.resposta_correta).trim().toLowerCase();
        const respostaEnviada = String(respostaJogador).trim().toLowerCase();

        return respostaCerta === respostaEnviada;
    }

    async criar(dados) {
        const { data, error } = await supabase
            .from('enigmas')
            .insert(dados)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async atualizar(id, dados) {
        const { data, error } = await supabase
            .from('enigmas')
            .update(dados)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async remover(id) {
        const { error } = await supabase
            .from('enigmas')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    }
}

module.exports = new EnigmaRepository();