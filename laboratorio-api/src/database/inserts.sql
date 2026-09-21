-- ============================================================
-- DADOS DE TESTE
-- ============================================================


-- ============================================================
-- 1. JOGADORES
-- ============================================================

INSERT INTO public.jogadores (nome_usuario)
VALUES
    ('Gabriel'),
    ('Ana'),
    ('Carlos'),
    ('Mariana'),
    ('Joao'),
    ('Lucas'),
    ('Beatriz'),
    ('Rafael')
ON CONFLICT (nome_usuario) DO NOTHING;


-- ============================================================
-- 2. PARTIDAS
-- ============================================================

-- Gabriel - Vitória rápida
INSERT INTO public.partidas (
    jogador_id,
    tempo_inicial_segundos,
    tempo_restante_segundos,
    status,
    erros_cometidos,
    dicas_utilizadas,
    iniciado_em,
    finalizado_em
)
SELECT
    id,
    600,
    438,
    'VITORIA',
    1,
    1,
    NOW() - INTERVAL '25 minutes',
    NOW() - INTERVAL '18 minutes'
FROM public.jogadores
WHERE nome_usuario = 'Gabriel';


-- Ana - Vitória sem erros
INSERT INTO public.partidas (
    jogador_id,
    tempo_inicial_segundos,
    tempo_restante_segundos,
    status,
    erros_cometidos,
    dicas_utilizadas,
    iniciado_em,
    finalizado_em
)
SELECT
    id,
    600,
    510,
    'VITORIA',
    0,
    0,
    NOW() - INTERVAL '20 minutes',
    NOW() - INTERVAL '12 minutes'
FROM public.jogadores
WHERE nome_usuario = 'Ana';


-- Carlos - Vitória com alguns erros
INSERT INTO public.partidas (
    jogador_id,
    tempo_inicial_segundos,
    tempo_restante_segundos,
    status,
    erros_cometidos,
    dicas_utilizadas,
    iniciado_em,
    finalizado_em
)
SELECT
    id,
    600,
    315,
    'VITORIA',
    3,
    2,
    NOW() - INTERVAL '35 minutes',
    NOW() - INTERVAL '28 minutes'
FROM public.jogadores
WHERE nome_usuario = 'Carlos';


-- Mariana - Derrota
INSERT INTO public.partidas (
    jogador_id,
    tempo_inicial_segundos,
    tempo_restante_segundos,
    status,
    erros_cometidos,
    dicas_utilizadas,
    iniciado_em,
    finalizado_em
)
SELECT
    id,
    600,
    0,
    'DERROTA',
    4,
    2,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '50 minutes'
FROM public.jogadores
WHERE nome_usuario = 'Mariana';


-- Joao - Partida ainda em andamento
INSERT INTO public.partidas (
    jogador_id,
    tempo_inicial_segundos,
    tempo_restante_segundos,
    status,
    erros_cometidos,
    dicas_utilizadas
)
SELECT
    id,
    600,
    372,
    'EM_ANDAMENTO',
    1,
    1
FROM public.jogadores
WHERE nome_usuario = 'Joao';


-- Lucas - Vitória
INSERT INTO public.partidas (
    jogador_id,
    tempo_inicial_segundos,
    tempo_restante_segundos,
    status,
    erros_cometidos,
    dicas_utilizadas,
    iniciado_em,
    finalizado_em
)
SELECT
    id,
    600,
    390,
    'VITORIA',
    2,
    1,
    NOW() - INTERVAL '45 minutes',
    NOW() - INTERVAL '37 minutes'
FROM public.jogadores
WHERE nome_usuario = 'Lucas';


-- ============================================================
-- 3. PROGRESSO DAS PARTIDAS
-- ============================================================

-- Gabriel completou todos os enigmas

INSERT INTO public.progresso_partida (
    partida_id,
    enigma_id,
    concluido,
    concluido_em
)
SELECT
    p.id,
    e.id,
    TRUE,
    p.finalizado_em
FROM public.partidas p
CROSS JOIN public.enigmas e
INNER JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE j.nome_usuario = 'Gabriel';


-- Ana completou todos os enigmas

INSERT INTO public.progresso_partida (
    partida_id,
    enigma_id,
    concluido,
    concluido_em
)
SELECT
    p.id,
    e.id,
    TRUE,
    p.finalizado_em
FROM public.partidas p
CROSS JOIN public.enigmas e
INNER JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE j.nome_usuario = 'Ana';


-- Carlos completou todos os enigmas

INSERT INTO public.progresso_partida (
    partida_id,
    enigma_id,
    concluido,
    concluido_em
)
SELECT
    p.id,
    e.id,
    TRUE,
    p.finalizado_em
FROM public.partidas p
CROSS JOIN public.enigmas e
INNER JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE j.nome_usuario = 'Carlos';


-- Mariana chegou até o terceiro enigma

INSERT INTO public.progresso_partida (
    partida_id,
    enigma_id,
    concluido,
    concluido_em
)
SELECT
    p.id,
    e.id,
    CASE
        WHEN e.ordem <= 3 THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN e.ordem <= 3 THEN p.finalizado_em
        ELSE NULL
    END
FROM public.partidas p
CROSS JOIN public.enigmas e
INNER JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE j.nome_usuario = 'Mariana';


-- Joao está atualmente no terceiro enigma

INSERT INTO public.progresso_partida (
    partida_id,
    enigma_id,
    concluido,
    concluido_em
)
SELECT
    p.id,
    e.id,
    CASE
        WHEN e.ordem <= 2 THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN e.ordem <= 2 THEN NOW() - INTERVAL '3 minutes'
        ELSE NULL
    END
FROM public.partidas p
CROSS JOIN public.enigmas e
INNER JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE j.nome_usuario = 'Joao';


-- Lucas completou todos os enigmas

INSERT INTO public.progresso_partida (
    partida_id,
    enigma_id,
    concluido,
    concluido_em
)
SELECT
    p.id,
    e.id,
    TRUE,
    p.finalizado_em
FROM public.partidas p
CROSS JOIN public.enigmas e
INNER JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE j.nome_usuario = 'Lucas';


-- ============================================================
-- 4. TENTATIVAS DOS ENIGMAS
-- ============================================================


-- ----------------------------
-- Gabriel
-- ----------------------------

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 1
WHERE j.nome_usuario = 'Gabriel';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'A', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Gabriel';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'A', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 3
WHERE j.nome_usuario = 'Gabriel';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 3
WHERE j.nome_usuario = 'Gabriel';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, '200', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 4
WHERE j.nome_usuario = 'Gabriel';


-- ----------------------------
-- Ana
-- ----------------------------

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, e.resposta_correta, TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
CROSS JOIN public.enigmas e
WHERE j.nome_usuario = 'Ana';


-- ----------------------------
-- Carlos
-- ----------------------------

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'C', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 1
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 1
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'A', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'C', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 3
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'D', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 3
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 3
WHERE j.nome_usuario = 'Carlos';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, '200', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 4
WHERE j.nome_usuario = 'Carlos';


-- ============================================================
-- 5. TENTATIVAS DA PARTIDA EM ANDAMENTO
-- ============================================================

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 1
WHERE j.nome_usuario = 'Joao';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'D', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Joao';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'A', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Joao';


-- ============================================================
-- 6. TENTATIVAS DA DERROTA
-- ============================================================

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'A', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 1
WHERE j.nome_usuario = 'Mariana';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'C', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Mariana';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'B', TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 2
WHERE j.nome_usuario = 'Mariana';

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, 'A', FALSE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
JOIN public.enigmas e ON e.ordem = 3
WHERE j.nome_usuario = 'Mariana';


-- ============================================================
-- 7. TENTATIVAS DO LUCAS
-- ============================================================

INSERT INTO public.tentativas_enigma (
    partida_id,
    enigma_id,
    resposta_enviada,
    acertou
)
SELECT p.id, e.id, e.resposta_correta, TRUE
FROM public.partidas p
JOIN public.jogadores j ON j.id = p.jogador_id
CROSS JOIN public.enigmas e
WHERE j.nome_usuario = 'Lucas';


-- ============================================================
-- 8. RANKING
-- ============================================================

INSERT INTO public.ranking (
    partida_id,
    jogador_id,
    tempo_total_gasto_segundos,
    pontuacao_final
)
SELECT
    p.id,
    p.jogador_id,
    p.tempo_inicial_segundos - p.tempo_restante_segundos,
    CASE j.nome_usuario
        WHEN 'Gabriel' THEN 850
        WHEN 'Ana' THEN 1000
        WHEN 'Carlos' THEN 620
        WHEN 'Lucas' THEN 720
        ELSE 0
    END
FROM public.partidas p
JOIN public.jogadores j
    ON j.id = p.jogador_id
WHERE p.status = 'VITORIA';


-- ============================================================
-- 9. CONSULTAS PARA TESTAR OS DADOS
-- ============================================================

-- Jogadores
SELECT *
FROM public.jogadores
ORDER BY criado_em;


-- Enigmas
SELECT
    id,
    ordem,
    titulo,
    resposta_correta,
    penalidade_tempo_segundos
FROM public.enigmas
ORDER BY ordem;


-- Opções
SELECT
    e.ordem,
    e.titulo,
    o.letra,
    o.texto_opcao
FROM public.enigmas e
JOIN public.opcoes_enigma o
    ON o.enigma_id = e.id
ORDER BY e.ordem, o.letra;


-- Partidas
SELECT
    j.nome_usuario,
    p.status,
    p.tempo_inicial_segundos,
    p.tempo_restante_segundos,
    p.erros_cometidos,
    p.dicas_utilizadas,
    p.iniciado_em,
    p.finalizado_em
FROM public.partidas p
JOIN public.jogadores j
    ON j.id = p.jogador_id
ORDER BY p.iniciado_em DESC;


-- Progresso
SELECT
    j.nome_usuario,
    e.ordem,
    e.titulo,
    pp.concluido,
    pp.concluido_em
FROM public.progresso_partida pp
JOIN public.partidas p
    ON p.id = pp.partida_id
JOIN public.jogadores j
    ON j.id = p.jogador_id
JOIN public.enigmas e
    ON e.id = pp.enigma_id
ORDER BY j.nome_usuario, e.ordem;


-- Tentativas
SELECT
    j.nome_usuario,
    e.ordem,
    e.titulo,
    t.resposta_enviada,
    t.acertou,
    t.registrado_em
FROM public.tentativas_enigma t
JOIN public.partidas p
    ON p.id = t.partida_id
JOIN public.jogadores j
    ON j.id = p.jogador_id
JOIN public.enigmas e
    ON e.id = t.enigma_id
ORDER BY t.registrado_em;


-- Ranking
SELECT *
FROM public.vw_ranking_leaderboard;