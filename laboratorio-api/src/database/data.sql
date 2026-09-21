-- PROJETO: LABORATÓRIO DE TERMODINÂMICA (ESCAPE ROOM)
-- SGBD: PostgreSQL / Supabase

-- LIMPEZA

DROP VIEW IF EXISTS public.vw_ranking_leaderboard;

DROP TABLE IF EXISTS public.ranking CASCADE;
DROP TABLE IF EXISTS public.tentativas_enigma CASCADE;
DROP TABLE IF EXISTS public.progresso_partida CASCADE;
DROP TABLE IF EXISTS public.partidas CASCADE;
DROP TABLE IF EXISTS public.opcoes_enigma CASCADE;
DROP TABLE IF EXISTS public.enigmas CASCADE;
DROP TABLE IF EXISTS public.jogadores CASCADE;


-- 1. JOGADORES

CREATE TABLE public.jogadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome_usuario VARCHAR(50) UNIQUE NOT NULL,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 2. ENIGMAS / DESAFIOS

CREATE TABLE public.enigmas (
    id BIGSERIAL PRIMARY KEY,

    ordem INTEGER UNIQUE NOT NULL
        CHECK (ordem > 0),

    titulo VARCHAR(100) NOT NULL,

    descricao TEXT NOT NULL,

    dica TEXT NOT NULL,

    resposta_correta VARCHAR(255) NOT NULL,

    penalidade_tempo_segundos INTEGER NOT NULL DEFAULT 30
        CHECK (penalidade_tempo_segundos >= 0)
);


-- 3. OPÇÕES DOS ENIGMAS

CREATE TABLE public.opcoes_enigma (
    id BIGSERIAL PRIMARY KEY,

    enigma_id BIGINT NOT NULL
        REFERENCES public.enigmas(id)
        ON DELETE CASCADE,

    letra CHAR(1) NOT NULL
        CHECK (letra IN ('A', 'B', 'C', 'D')),

    texto_opcao TEXT NOT NULL,

    CONSTRAINT unq_enigma_letra
        UNIQUE (enigma_id, letra)
);


-- 4. PARTIDAS / SESSÕES

CREATE TABLE public.partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    jogador_id UUID NOT NULL
        REFERENCES public.jogadores(id)
        ON DELETE CASCADE,

    tempo_inicial_segundos INTEGER NOT NULL DEFAULT 600
        CHECK (tempo_inicial_segundos > 0),

    tempo_restante_segundos INTEGER NOT NULL DEFAULT 600
        CHECK (tempo_restante_segundos >= 0),

    status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO'
        CHECK (
            status IN (
                'EM_ANDAMENTO',
                'VITORIA',
                'DERROTA'
            )
        ),

    erros_cometidos INTEGER NOT NULL DEFAULT 0
        CHECK (erros_cometidos >= 0),

    dicas_utilizadas INTEGER NOT NULL DEFAULT 0
        CHECK (dicas_utilizadas >= 0),

    iniciado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    finalizado_em TIMESTAMPTZ,

    CONSTRAINT chk_tempo_restante
        CHECK (
            tempo_restante_segundos <= tempo_inicial_segundos
        ),

    CONSTRAINT chk_partida_finalizacao
        CHECK (
            (
                status = 'EM_ANDAMENTO'
                AND finalizado_em IS NULL
            )
            OR
            (
                status IN ('VITORIA', 'DERROTA')
                AND finalizado_em IS NOT NULL
            )
        )
);


-- 5. PROGRESSO DA PARTIDA

CREATE TABLE public.progresso_partida (
    id BIGSERIAL PRIMARY KEY,

    partida_id UUID NOT NULL
        REFERENCES public.partidas(id)
        ON DELETE CASCADE,

    enigma_id BIGINT NOT NULL
        REFERENCES public.enigmas(id)
        ON DELETE CASCADE,

    concluido BOOLEAN NOT NULL DEFAULT FALSE,

    concluido_em TIMESTAMPTZ,

    CONSTRAINT unq_partida_enigma
        UNIQUE (partida_id, enigma_id),

    CONSTRAINT chk_progresso_conclusao
        CHECK (
            (
                concluido = FALSE
                AND concluido_em IS NULL
            )
            OR
            (
                concluido = TRUE
                AND concluido_em IS NOT NULL
            )
        )
);


-- 6. TENTATIVAS DOS ENIGMAS

CREATE TABLE public.tentativas_enigma (
    id BIGSERIAL PRIMARY KEY,

    partida_id UUID NOT NULL
        REFERENCES public.partidas(id)
        ON DELETE CASCADE,

    enigma_id BIGINT NOT NULL
        REFERENCES public.enigmas(id)
        ON DELETE CASCADE,

    resposta_enviada VARCHAR(255) NOT NULL,

    acertou BOOLEAN NOT NULL,

    registrado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 7. RANKING

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

    pontuacao_final INTEGER NOT NULL
        CHECK (pontuacao_final >= 0),

    registrado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ÍNDICES

CREATE INDEX idx_partidas_jogador
    ON public.partidas(jogador_id);

CREATE INDEX idx_progresso_partida
    ON public.progresso_partida(partida_id);

CREATE INDEX idx_tentativas_partida
    ON public.tentativas_enigma(partida_id);

CREATE INDEX idx_tentativas_enigma
    ON public.tentativas_enigma(enigma_id);

CREATE INDEX idx_ranking_pontuacao
    ON public.ranking(pontuacao_final DESC);

CREATE INDEX idx_ranking_tempo
    ON public.ranking(tempo_total_gasto_segundos ASC);


--ENIGMAS

INSERT INTO public.enigmas (
    ordem,
    titulo,
    descricao,
    dica,
    resposta_correta,
    penalidade_tempo_segundos
)
VALUES

(
    1,
    'O Gás sob Pressão',
    'O laboratório está aquecendo o cilindro. O volume do gás permanece constante. O que acontecerá com a pressão do gás?',
    'Lembre-se da transformação isocórica: com volume constante, a temperatura e a pressão são diretamente proporcionais.',
    'B',
    30
),

(
    2,
    'A Válvula de Emergência',
    'A pressão do laboratório está aumentando! O cientista precisa liberar parte do gás para diminuir a pressão. Qual transformação está acontecendo quando o gás é liberado e realiza trabalho sobre o ambiente?',
    'Observe qual elemento está aplicando força para se expandir sobre o meio externo.',
    'A',
    30
),

(
    3,
    'O Sistema de Refrigeração',
    'O sistema de emergência precisa transferir energia térmica para resfriar o laboratório. Em qual direção ocorre espontaneamente a transferência de calor?',
    'De acordo com a Segunda Lei da Termodinâmica, o calor flui espontaneamente do corpo de maior temperatura para o de menor temperatura.',
    'B',
    30
),

(
    4,
    'O ÚLTIMO CÁLCULO',
    'Um gás ocupa inicialmente 2 L a uma pressão de 100 kPa. O pistão é comprimido até o volume de 1 L. A temperatura permanece constante. Qual será a nova pressão do gás?',
    'Aplique a Lei de Boyle: P1 * V1 = P2 * V2.',
    '200',
    60
);


-- OPÇÕES DO ENIGMA 1

INSERT INTO public.opcoes_enigma (
    enigma_id,
    letra,
    texto_opcao
)
VALUES
(1, 'A', 'A pressão diminui.'),
(1, 'B', 'A pressão aumenta.'),
(1, 'C', 'A pressão permanece igual.'),
(1, 'D', 'O gás desaparece.');


-- OPÇÕES DO ENIGMA 2

INSERT INTO public.opcoes_enigma (
    enigma_id,
    letra,
    texto_opcao
)
VALUES
(2, 'A', 'O gás realiza trabalho sobre o ambiente.'),
(2, 'B', 'O ambiente realiza trabalho sobre o gás.'),
(2, 'C', 'Não existe trabalho envolvido.'),
(2, 'D', 'A temperatura necessariamente permanece constante.');


--  OPÇÕES DO ENIGMA 3

INSERT INTO public.opcoes_enigma (
    enigma_id,
    letra,
    texto_opcao
)
VALUES
(3, 'A', 'Do corpo frio para o corpo quente.'),
(3, 'B', 'Do corpo quente para o corpo frio.'),
(3, 'C', 'O calor não pode ser transferido.'),
(3, 'D', 'O calor sempre se divide igualmente entre os dois corpos.');


-- RANKING

CREATE OR REPLACE VIEW public.vw_ranking_leaderboard AS
SELECT
    j.nome_usuario,
    r.pontuacao_final,
    r.tempo_total_gasto_segundos,
    p.erros_cometidos,
    r.registrado_em AS data_conclusao
FROM public.ranking AS r
INNER JOIN public.jogadores AS j
    ON j.id = r.jogador_id
INNER JOIN public.partidas AS p
    ON p.id = r.partida_id
WHERE p.status = 'VITORIA'
ORDER BY
    r.pontuacao_final DESC,
    r.tempo_total_gasto_segundos ASC;