const supabase = require('../config/supabase');

class RankingRepository {
    async listarTodos() {
        const { data, error } = await supabase.from('ranking').select('*');

        if (error) {
            throw error;
        }

        return data;
    }

    async buscarPorId(id) {
        const { data, error } = await supabase.from('ranking').select('*').eq('id', id).single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    async criar(dados) {
        const { data, error } = await supabase.from('ranking').insert(dados).select().single();

        if (error) {
            throw error;
        }

        return data;
    }

    async atualizar(id, dados) {
        const { data, error } = await supabase.from('ranking').update(dados).eq('id', id).select().single();

        if (error) {
            throw error;
        }

        return data;
    }

    async remover(id) {
        const { error } = await supabase.from('ranking').delete().eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    }
}

module.exports = new RankingRepository();
