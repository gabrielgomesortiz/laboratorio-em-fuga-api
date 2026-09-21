# Laboratório em Fuga API

API REST para o projeto Laboratório em Fuga.

## Requisitos

- Node.js 18+
- npm
- Conta Supabase com projeto configurado

## Instalação

```bash
cd laboratorio-api/
yarn install
```

## Variáveis de ambiente

Configure as variáveis no arquivo `.env`:

```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon
```

## Execução

```bash
yarn dev
```

A API ficará disponível em: http://localhost:3000
