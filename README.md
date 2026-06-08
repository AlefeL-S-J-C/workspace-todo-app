# 🚀 Fullstack To-Do List (C# .NET 8 + SQLite + Vanilla JS)

Um aplicativo moderno e responsivo de gerenciamento de tarefas (To-Do List). O projeto foi evoluído de um armazenamento puramente local (`localStorage`) para uma arquitetura client-server completa, utilizando uma **Web API em C#** com persistência de dados em um banco de dados **SQLite**.

## 🚀 Funcionalidades

- **CRUD Completo:** Criação, listagem, edição visual detalhada e exclusão de tarefas.
- **Filtros Dinâmicos:** Filtragem rápida por tarefas "Todas", "Pendentes" ou "Concluídas".
- **Sistema de Urgência:** Cores dinâmicas na borda de cada tarefa indicando o nível de prioridade (de "Não Urgente" até "Imediato").
- **Barra de Pesquisa:** Busca em tempo real por termos digitados no título da tarefa.
- **Persistência Real:** Dados salvos localmente em arquivo físico do SQLite através do Entity Framework Core.
- **Modais Bootstrap:** Telas flutuantes elegantes para visualização e edição de registros.
- **Feedbacks com SweetAlert2:** Alertas personalizados e confirmações de exclusão nativas com estilo Bootstrap.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
- HTML5 / CSS3 / JavaScript (Vanilla)
- Bootstrap 5 (Estilização e Layout)
- SweetAlert2 (Mensagens de alerta e modais de confirmação)

**Back-end:**
- .NET 8 (Web API / Minimal APIs)
- Entity Framework Core (ORM)
- SQLite (Banco de dados relacional em arquivo local)

---

## 📦 Como Executar o Projeto

### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/pt-br/download/dotnet/8.0) instalado.
- Extensão *Live Server* no VS Code (ou similar para rodar o Front-end).

### 1. Configurando e rodando o Back-end (C#)
No seu terminal, navegue até a pasta da API:
```bash
cd BACKEND/TodoApi