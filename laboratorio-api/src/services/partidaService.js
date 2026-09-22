const supabase = require('../config/supabase');

class PartidaService {
    async criar(dados = {}) {
        const { data, error } = await supabase
            .from('partidas')
            .insert([{
                iniciado_em: new Date().toISOString(),
                tempo_total_segundos: 0,
                status: dados.status || 'em_andamento',
                ...dados
            }])
            .select()
            .single();

        if (error) {
            const err = new Error(`Erro ao criar partida: ${error.message}`);
            err.statusCode = 400;
            throw err;
        }

        return data;
    }

    async listarTodos() {
        const { data, error } = await supabase
            .from('partidas')
            .select('*, jogadores(nome)')
            .order('iniciado_em', { ascending: false });

        if (error) {
            throw new Error(`Erro ao buscar partidas: ${error.message}`);
        }

        return data;
    }

    async buscarPorId(partidaId) {
        const { data, error } = await supabase
            .from('partidas')
            .select('*')
            .eq('id', partidaId)
            .single();

        if (error || !data) {
            const err = new Error('Partida não encontrada.');
            err.statusCode = 404;
            throw err;
        }

        return data;
    }

    async atualizar(partidaId, dados) {
        const { data, error } = await supabase
            .from('partidas')
            .update(dados)
            .eq('id', partidaId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar partida: ${error.message}`);
        }

        return data;
    }

    async remover(partidaId) {
        const { error } = await supabase
            .from('partidas')
            .delete()
            .eq('id', partidaId);

        if (error) {
            throw new Error(`Erro ao remover partida: ${error.message}`);
        }

        return true;
    }

    async finalizar(partidaId, tempoTotal) {
        return await this.atualizar(partidaId, {
            status: 'finalizada',
            finalizado_em: new Date().toISOString(),
            tempo_total_segundos: tempoTotal
        });
    }

    async finalizarComJogador(partidaId, nomeJogador) {
        // 1. Busca os dados atuais da partida para pegar a data de início (iniciado_em)
        const partidaAtual = await this.buscarPorId(partidaId);

        // 2. Calcula a duração total em segundos
        const inicio = new Date(partidaAtual.iniciado_em).getTime();
        const fim = Date.now();
        const tempoTotalSegundos = Math.max(0, Math.floor((fim - inicio) / 1000));

        // 3. Busca o jogador usando o nome correto da coluna: 'nome_usuario'
        let { data: jogador, error: errJogador } = await supabase
            .from('jogadores')
            .select('id')
            .eq('nome_usuario', nomeJogador)
            .maybeSingle();

        if (errJogador) {
            throw new Error(`Erro ao buscar jogador: ${errJogador.message}`);
        }

        // 4. Se o jogador não existir, insere gravando na coluna 'nome_usuario'
        if (!jogador) {
            const { data: novoJogador, error: errCriar } = await supabase
                .from('jogadores')
                .insert([{ nome_usuario: nomeJogador }])
                .select()
                .single();

            if (errCriar) throw new Error(`Erro ao salvar jogador: ${errCriar.message}`);
            jogador = novoJogador;
        }

        // 5. Salva a partida vinculada ao ID do jogador
        const { data: partidaFinalizada, error: errPartida } = await supabase
            .from('partidas')
            .update({
                jogador_id: jogador.id,
                status: 'finalizada',
                finalizado_em: new Date(fim).toISOString(),
                tempo_total_segundos: tempoTotalSegundos
            })
            .eq('id', partidaId)
            .select()
            .single();

        if (errPartida) throw new Error(`Erro ao finalizar partida: ${errPartida.message}`);

        return partidaFinalizada;
    }
}

module.exports = new PartidaService();