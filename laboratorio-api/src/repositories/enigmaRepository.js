const supabase = require('../config/supabase');

class EnigmaRepository {
    async listarTodos() {
        const { data, error } = await supabase.from('enigmas').select('*');

        if (error) {
            throw error;
        }

        return data;
    }

    async buscarPorId(id) {
        const { data, error } = await supabase.from('enigmas').select('*').eq('id', id).single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    async criar(dados) {
        const { data, error } = await supabase.from('enigmas').insert(dados).select().single();

        if (error) {
            throw error;
        }

        return data;
    }

    async atualizar(id, dados) {
        const { data, error } = await supabase.from('enigmas').update(dados).eq('id', id).select().single();

        if (error) {
            throw error;
        }

        return data;
    }

    async remover(id) {
        const { error } = await supabase.from('enigmas').delete().eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    }
}

module.exports = new EnigmaRepository();
