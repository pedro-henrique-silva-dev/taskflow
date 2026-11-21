# Arquitetura do TaskFlow

## Visão geral

O TaskFlow é dividido em três partes independentes:

```
[ Navegador ]  --HTTP/JSON-->  [ API REST (Express) ]  --SQL-->  [ PostgreSQL ]
  frontend/                       backend/                        database/
```

- **frontend/**: SPA em React + Vite. Consome a API REST e guarda o token JWT do usuário.
- **backend/**: API REST em Node.js + Express, organizada em camadas.
- **database/**: scripts SQL versionados (migrations) e dados de exemplo (seeds).

## Frontend (`frontend/src`)

| Pasta         | Responsabilidade                                               |
| ------------- | -------------------------------------------------------------- |
| `assets/`     | Imagens e ícones importados pelos componentes                  |
| `components/` | Componentes reutilizáveis (botões, campos, cards, modais)      |
| `pages/`      | Telas da aplicação (login, cadastro, dashboard, tarefas)       |
| `hooks/`      | Hooks personalizados com lógica reutilizável                   |
| `services/`   | Comunicação HTTP com a API                                     |
| `context/`    | Estado global (ex.: usuário autenticado)                       |
| `styles/`     | CSS global e variáveis de tema                                 |
| `utils/`      | Funções auxiliares puras (formatação de datas, constantes)     |

## Backend (`backend/src`)

Fluxo de uma requisição:

```
routes -> middlewares -> validators -> controllers -> services -> repositories -> PostgreSQL
```

| Pasta           | Responsabilidade                                                   |
| --------------- | ------------------------------------------------------------------ |
| `config/`       | Variáveis de ambiente e conexão com o banco                        |
| `routes/`       | Definição dos endpoints e ligação com os controllers               |
| `middlewares/`  | Autenticação JWT, tratamento centralizado de erros                 |
| `validators/`   | Validação dos dados de entrada                                     |
| `controllers/`  | Recebem a requisição HTTP e devolvem a resposta                    |
| `services/`     | Regras de negócio                                                  |
| `repositories/` | Consultas SQL ao PostgreSQL                                        |
| `models/`       | Formato das entidades retornadas pela API                          |
| `utils/`        | Funções auxiliares (ex.: classe de erro da aplicação)              |
| `app.js`        | Configuração do Express (middlewares e rotas)                      |
| `server.js`     | Inicialização do servidor HTTP                                     |

## Banco de dados (planejado)

- **users**: id, name, email (único), password_hash, created_at, updated_at
- **categories**: id, user_id (FK users), name, color, created_at — nome único por usuário
- **tasks**: id, user_id (FK users), category_id (FK categories, opcional), title, description,
  priority (low | medium | high), status (pending | completed), due_date, completed_at,
  created_at, updated_at

Toda consulta de tarefas e categorias é filtrada pelo `user_id` do token JWT, garantindo que cada
usuário acesse apenas os próprios dados.

## Fases de desenvolvimento

1. Preparação do projeto
2. Frontend
3. Backend
4. Banco de dados
5. Integração completa
6. Finalização e portfólio
