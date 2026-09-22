-- ==========================================
-- PROJETO: LABORATÓRIO DE TERMODINÂMICA (ESCAPE ROOM)
-- SGBD: PostgreSQL / Supabase
-- ==========================================

-- 1. LIMPEZA INICIAL
DROP VIEW IF EXISTS public.vw_ranking_leaderboard;
DROP TABLE IF EXISTS public.ranking CASCADE;
DROP TABLE IF EXISTS public.partidas CASCADE;
DROP TABLE IF EXISTS public.jogadores CASCADE;

-- 2. TABELA DE JOGADORES
CREATE TABLE public.jogadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE PARTIDAS
CREATE TABLE public.partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jogador_id UUID NOT NULL
        REFERENCES public.jogadores(id)
        ON DELETE CASCADE,
    tempo_total_segundos INTEGER DEFAULT 0
        CHECK (tempo_total_segundos >= 0),
    iniciado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finalizado_em TIMESTAMPTZ
);

-- 4. TABELA DE RANKING
CREATE TABLE public.ranking (
    id BIGSERIAL PRIMARY KEY,
    partida_id UUID UNIQUE NOT NULL
        REFERENCES public.partidas(id)
        ON DELETE CASCADE,
    jogador_id UUID NOT NULL
        REFERENCES public.jogadores(id)
        ON DELETE CASCADE,
    tempo_total_gasto_segundos INTEGER NOT NULL
        CHECK (tempo_total_gasto_segundos >= 0),
    pontuacao_final INTEGER NOT NULL DEFAULT 0
        CHECK (pontuacao_final >= 0),
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ÍNDICES DE DESEMPENHO
CREATE INDEX idx_partidas_jogador
    ON public.partidas(jogador_id);

CREATE INDEX idx_ranking_jogador
    ON public.ranking(jogador_id);

CREATE INDEX idx_ranking_pontuacao
    ON public.ranking(pontuacao_final DESC);

CREATE INDEX idx_ranking_tempo
    ON public.ranking(tempo_total_gasto_segundos ASC);

-- 6. VIEW DO LEADERBOARD / RANKING
CREATE OR REPLACE VIEW public.vw_ranking_leaderboard AS
SELECT
    j.nome_usuario,
    r.pontuacao_final,
    r.tempo_total_gasto_segundos,
    r.registrado_em AS data_conclusao
FROM public.ranking AS r
INNER JOIN public.jogadores AS j
    ON j.id = r.jogador_id
INNER JOIN public.partidas AS p
    ON p.id = r.partida_id
ORDER BY
    r.pontuacao_final DESC,
    r.tempo_total_gasto_segundos ASC;