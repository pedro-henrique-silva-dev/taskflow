# TaskFlow

Sistema full stack de gerenciamento de tarefas, desenvolvido como projeto de portfólio.

> Projeto em desenvolvimento. A documentação completa (instalação, API e telas) será adicionada na fase final.

## Tecnologias

| Camada         | Tecnologias                               |
| -------------- | ----------------------------------------- |
| Frontend       | React, Vite, JavaScript, HTML5, CSS3      |
| Backend        | Node.js, Express, JavaScript              |
| Banco de dados | PostgreSQL                                |
| Autenticação   | JWT                                       |
| Ferramentas    | Git, GitHub, npm, API REST, JSON          |

## Estrutura do projeto

```
TaskFlow/
├── frontend/   # Aplicação React (Vite)
├── backend/    # API REST em Node.js/Express
├── database/   # Migrations e seeds SQL do PostgreSQL
└── docs/       # Documentação técnica
```

Detalhes da arquitetura em [docs/arquitetura.md](docs/arquitetura.md).

## Pré-requisitos

- Node.js 20.19+ (ou 22.12+)
- npm
- PostgreSQL 16+
- Git

## Executando o frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação ficará disponível em http://localhost:5173.
