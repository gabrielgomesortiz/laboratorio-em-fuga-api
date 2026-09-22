const supabase = require('../config/supabase');

class RankingRepository {
    async listarTodos() {
        // Busca todos os registros do ranking ordenando da maior pontuação para a menor.
        // Se houver chave estrangeira para 'jogadores', traz o nome do jogador no mesmo SELECT.
        const { data, error } = await supabase
            .from('ranking')
            .select('*, jogadores(nome)')
            .order('pontuacao', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }

    async buscarPorId(id) {
        const { data, error } = await supabase
            .from('ranking')
            .select('*, jogadores(nome)')
            .eq('id', id)
            .single();

        // PGRST116 é retornado pelo Supabase quando .single() não encontra linhas
        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    async criar(dados) {
        const { data, error } = await supabase
            .from('ranking')
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
            .from('ranking')
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
            .from('ranking')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    }
}

module.exports = new RankingRepository();