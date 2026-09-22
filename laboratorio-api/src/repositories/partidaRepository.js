const supabase = require('../config/supabase');

class PartidaRepository {
    async listarTodos() {
        // Traz as partidas e inclui o nome do jogador associado (se houver chave estrangeira com a tabela jogadores)
        const { data, error } = await supabase
            .from('partidas')
            .select('*, jogadores(nome)')
            .order('tempo_inicio', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }

    async buscarPorId(id) {
        const { data, error } = await supabase
            .from('partidas')
            .select('*, jogadores(nome)')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    async criar(dados) {
        const { data, error } = await supabase
            .from('partidas')
            .insert(dados)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async finalizar(id, tempoTotal) {
        const { data, error } = await supabase
            .from('partidas')
            .update({
                tempo_fim: new Date().toISOString(),
                tempo_total: tempoTotal
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async atualizar(id, dados) {
        const { data, error } = await supabase
            .from('partidas')
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
            .from('partidas')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    }
}

module.exports = new PartidaRepository();