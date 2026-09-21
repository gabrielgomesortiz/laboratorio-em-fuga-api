const supabase = require('../config/supabase');

class PartidaRepository {
    async listarTodos() {
        const { data, error } = await supabase.from('partidas').select('*');

        if (error) {
            throw error;
        }

        return data;
    }

    async buscarPorId(id) {
        const { data, error } = await supabase.from('partidas').select('*').eq('id', id).single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    async criar(dados) {
        const { data, error } = await supabase.from('partidas').insert(dados).select().single();

        if (error) {
            throw error;
        }

        return data;
    }

    async atualizar(id, dados) {
        const { data, error } = await supabase.from('partidas').update(dados).eq('id', id).select().single();

        if (error) {
            throw error;
        }

        return data;
    }

    async remover(id) {
        const { error } = await supabase.from('partidas').delete().eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    }
}

module.exports = new PartidaRepository();
