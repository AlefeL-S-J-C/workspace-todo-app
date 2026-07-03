# 🚀 Workspace To-Do, Notes, Habits & Finance

Aplicação web completa para produtividade pessoal com **Quadro Kanban**, **Nota de Texto (Texto Rico + Editor em Blocos estilo Notion)**, **Bloco de Notas Digital (Canvas)**, **Rastreador de Hábitos** com gráfico de contribuição estilo GitHub, **Assistente IA (Gemini)**, **Pomodoro Timer**, **Controle Financeiro**, **Agenda Diária (Time Blocking)** e **Mapas Mentais (Mind Maps)**.

---

## ✨ Funcionalidades Principais

### 📝 Nota de Texto (Texto Rico + Editor em Blocos)
- **Duas abas no mesmo modal:** A nota de texto oferece "📝 Texto Rico" (Quill.js) e "🧱 Blocos" (editor estilo Notion).
- **🧱 Editor em Blocos:** Digite `/` para abrir menu e escolher entre Título, Checklist, Código ou Tabela. Enter cria novo bloco, Backspace deleta bloco vazio.
- **📝 Texto Rico:** Quill.js com negrito, itálico, listas, links, realce de sintaxe (Highlight.js) e imagens.
- **Descrição com Quill.js:** Tanto ao criar quanto ao editar tarefas, a descrição usa o editor Quill.js (negrito, itálico, listas, links) em vez de um `<textarea>` simples.
- **Blocos de Código:** Suporte a código com realce de sintaxe (Highlight.js) nas notas.
- **Imagens:** Arraste ou cole imagens diretamente no editor de notas.

### 📊 Rastreador de Hábitos (Habit Tracker)
- **Mapa de Contribuição Geral:** Gráfico agregado estilo GitHub nos dias do último ano. A intensidade da cor varia conforme a quantidade de hábitos concluídos no dia (mais hábitos = quadrado mais forte).
- **Sequência (Streak):** Contador de dias consecutivos no gráfico geral.
- **Check-in Diário:** Marque/desmarque hábitos diretamente na sidebar.
- **Visualização por Cor:** A cor do quadrado vai de opaco (nenhum hábito) até totalmente verde (todos os hábitos concluídos).

### 🤖 Assistente Virtual com Inteligência Artificial
- **Dividir Tarefa com IA:** Botão mágico no formulário de criar e editar tarefas. Lê uma tarefa complexa e gera 5 subtarefas automaticamente via Google Gemini.
- **Resumir Nota:** Botão no editor Quill de notas que resume o conteúdo num parágrafo curto.
- **API Key:** Configure a variável de ambiente `GEMINI_API_KEY` para ativar. Sem chave, o sistema usa respostas padrão.

### 🍅 Pomodoro Timer
- **Timer Foco/Descanso:** Cronômetro de 25 minutos de foco e 5 minutos de descanso fixo na barra lateral.
- **Iniciar/Pausar/Reset:** Controle completo do timer a qualquer momento.
- **Contador de Sessões:** Exibe quantos ciclos de foco foram concluídos.
- **Notificações:** Alerta no navegador ao final de cada ciclo.
- **Feedback Visual:** Timer muda de cor (verde = foco, azul = descanso).
- **Vinculado a Tarefas:** Selecione uma tarefa antes de iniciar. Cada ciclo completo é registrado no banco com histórico ("Tarefa X: 3 ciclos / 75 min").

### 📅 Calendário Integrado
- **Visão Unificada:** Exibe tarefas e transações financeiras num único calendário.
- **Navegação:** Alterna entre meses e visualizações (mês, semana, lista).
- **Links Rápidos:** Clique num evento para abrir detalhes.
- **Página Dedicada:** Aba "📅 Calendário" na sidebar.

### 💰 Controle Financeiro
- **Receitas e Despesas:** Registre entradas e saídas com descrição, valor, categoria e data.
- **Resumo Financeiro:** Cards com total de receitas, despesas e saldo.
- **Filtros Inteligentes:** Filtre por categoria e mês.
- **Categorias:** Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Salário, Investimento, Outros.
- **Formatação BRL:** Valores em formato monetário brasileiro (R$).
- **Link com Tarefas:** Tarefas com "Custo Estimado" exibem badge `R$ XX.XX` no card. Clique no badge para lançar a despesa diretamente no Financeiro. Ao concluir uma tarefa com custo, o sistema pergunta se deseja registrar a despesa.

### 📋 Gestão de Tarefas (Kanban)
- **Organização por Páginas:** Crie espaços de trabalho (Ex: Trabalho, Estudos, Faculdade, Pessoal, Casa).
- **Drag & Drop:** Arraste tarefas entre "A Fazer", "Em Andamento" e "Concluído".
- **Prazos Automáticos:** Data final calculada com base no Grau de Urgência.
- **Subtarefas (Checklists):** Passos menores dentro de uma tarefa principal.
- **Alertas Visuais:** Tarefas atrasadas piscam com etiqueta "⚠️ ATRASADA".
- **Confetes:** Animação ao concluir tarefas!

### 📝 Bloco de Notas Digital (Canvas)
- **Canvas Interativo:** Desenhe e escreva à mão (ideal para stylus/S-Pen).
- **Textos Editáveis:** Digite com ferramenta de texto flutuante. Altere fontes, tamanhos e cores.
- **Ferramentas:** Caneta, Marca-Texto, Borracha, Undo/Redo.
- **Múltiplas Páginas:** Cadernos inteiros dentro de uma única nota.
- **Tipos de Folha:** Em branco, pautada, quadriculada ou pontilhada.
- **Exportação:** Baixe a nota como `.png`.

### ⏳ Agenda Diária (Time Blocking)
- **Timeline Visual:** Grade de horários das 08:00 às 22:00 com slots de 30 minutos.
- **Adição Rápida:** Cada slot tem um campo de texto para criar uma nova tarefa diretamente naquele horário.
- **Visualização Diária:** Selecione qualquer data para ver/editar a programação do dia.
- **Remoção Rápida:** Clique no "×" para remover uma tarefa do bloco.
- **Detalhes da Tarefa:** Clique em uma tarefa agendada para ver seus detalhes.

### 🧠 Mapeamento Mental (Mind Maps)
- **Nós Interativos:** Duplo-clique no canvas para criar bolhas de texto.
- **Conexões Visuais:** Modo "Conectar" para ligar nós com setas direcionais.
- **Arrastar e Editar:** Mova nós livremente; duplo-clique em um nó para editar o texto.
- **Converter em Tarefa:** Selecione um nó e clique em "Criar Tarefa" para transformá-lo em uma tarefa real. Também disponível via **clique direito** no nó.
- **Ferramentas (🔧):** Botão que abre seletor de **formas de nó** (Arredondado, Circular, Reto, Pílula) e **tipos de conexão** (Reta, Curva, Tracejada, Pontilhada), cada um com descrição.
- **Exportar como PNG:** Baixe o mapa mental como imagem (respeitando formas e tipos de conexão).
- **Ajuda Integrada:** Botão "❓" com tutorial rápido de uso.

### 📱 Interface e Experiência (UI/UX)
- **Design Responsivo:** Adapta-se a telemóveis, tablets e computadores.
- **Modo Escuro (Dark Mode):** Interface adaptada para ambientes de pouca luz.
- **Tooltips:** Botões com balões flutuantes descritivos.
- **Menu Lateral Retrátil:** Em mobile, o menu vira uma "gaveta" oculta.
- **Pesquisa em Tempo Real:** Filtra tarefas instantaneamente.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- [Bootstrap 5](https://getbootstrap.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [FullCalendar 6](https://fullcalendar.io/)
- [Quill.js 2](https://quilljs.com/) (Editor de Texto Rico)
- [Highlight.js](https://highlightjs.org/) (Realce de Sintaxe)
- [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- HTML `<canvas>` API (Contexto 2D)
- SVG API (Mapas Mentais)
- Notification API (Pomodoro)

**Backend:**
- C# .NET 10 (Minimal APIs)
- Entity Framework Core 10 (ORM)
- SQLite (Base de Dados Embutida)
- Google Gemini API (Assistente IA)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Navegador web moderno

### Passos

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd workspace-todo-app
   ```

2. **Execute a API:**
   ```bash
   cd TodoApi
   dotnet run
   ```
   A API inicia em `http://localhost:5152`

3. **Abra o frontend:**
   - A API serve o frontend automaticamente em `http://localhost:5152`

4. **(Opcional) Ativar Assistente IA:**
   Para usar as funcionalidades de IA (Dividir Tarefa e Resumir Nota), defina a variável de ambiente:

   **Windows (PowerShell):**
   ```powershell
   $env:GEMINI_API_KEY = "sua-chave-api-gemini"
   dotnet run
   ```

   **Linux/macOS:**
   ```bash
   export GEMINI_API_KEY="sua-chave-api-gemini"
   dotnet run
   ```

   Obtenha uma chave gratuita em [Google AI Studio](https://aistudio.google.com/).

---

## 📂 Estrutura do Projeto

```
workspace-todo-app/
├── README.md
├── TodoApi/
│   ├── Program.cs                # Minimal API endpoints
│   ├── AppDbContext.cs            # EF Core DbContext + seed data
│   ├── Tarefa.cs                  # Task model
│   ├── Subtarefa.cs               # Subtask model
│   ├── Urgencia.cs                # Urgency model
│   ├── Tag.cs                     # Pages/Tags (kanban/financeiro)
│   ├── Anotacao.cs                # Notes (canvas + richtext)
│   ├── TransacaoFinanceira.cs     # Financial transaction model
│   ├── Habito.cs                  # Habit model
│   ├── RegistroHabito.cs          # Daily habit records
│   ├── TimeBlock.cs               # Time blocking model
│   ├── MindMap.cs                 # Mind map model
│   ├── RegistroPomodoro.cs        # Pomodoro history model
│   ├── GeminiModels.cs            # Gemini API response models
│   ├── TodoApi.csproj
│   ├── appsettings.json
│   ├── Migrations/
│   ├── todo.db                    # SQLite database (auto-created)
│   └── wwwroot/
│       ├── index.html             # Frontend SPA
│       ├── todo2.js               # All frontend logic
│       └── content/
│           ├── CSS/
│           │   └── style.css
│           └── JS/
│               ├── bootstrap.bundle.min.js
│               └── sweetalert2.js
```

---

## 🧠 Como Funciona

### API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/urgencias` | Lista os graus de urgência |
| GET | `/tags` | Lista as páginas/tags |
| POST | `/tags` | Cria nova página |
| PUT | `/tags/{id}` | Atualiza página |
| DELETE | `/tags/{id}` | Remove página |
| GET | `/tarefas` | Lista todas as tarefas |
| POST | `/tarefas` | Cria nova tarefa |
| PUT | `/tarefas/{id}` | Atualiza tarefa |
| DELETE | `/tarefas/{id}` | Remove tarefa |
| DELETE | `/tarefas/todas` | Remove todas as tarefas |
| POST | `/subtarefas` | Cria subtarefa |
| PUT | `/subtarefas/{id}` | Atualiza subtarefa |
| DELETE | `/subtarefas/{id}` | Remove subtarefa |
| GET | `/anotacoes/{tagId}` | Lista notas por página |
| POST | `/anotacoes` | Cria nova nota |
| PUT | `/anotacoes/{id}` | Atualiza nota |
| DELETE | `/anotacoes/{id}` | Remove nota |
| GET | `/habitos/{tagId}` | Lista hábitos por página |
| POST | `/habitos` | Cria novo hábito |
| PUT | `/habitos/{id}` | Atualiza hábito |
| DELETE | `/habitos/{id}` | Remove hábito |
| GET | `/registros-habitos/{habitoId}` | Lista registros de um hábito |
| POST | `/registros-habitos` | Cria/atualiza registro diário |
| GET | `/transacoes/{tagId}` | Lista transações por página |
| POST | `/transacoes` | Cria transação |
| PUT | `/transacoes/{id}` | Atualiza transação |
| DELETE | `/transacoes/{id}` | Remove transação |
| DELETE | `/transacoes/todas/{tagId}` | Remove todas da página |
| GET | `/calendario` | Eventos unificados (tarefas + transações) |
| POST | `/ia/dividir-tarefa` | IA divide tarefa em subtarefas |
| POST | `/ia/resumir-nota` | IA resume conteúdo de nota |
| GET | `/timeblocks/{data}/{tagId}` | Blocos de agenda por data e página |
| POST | `/timeblocks` | Cria bloco de agenda |
| PUT | `/timeblocks/{id}` | Atualiza bloco de agenda |
| DELETE | `/timeblocks/{id}` | Remove bloco de agenda |
| DELETE | `/timeblocks/limpar/{tagId}` | Remove todos os blocos da página |
| GET | `/mindmaps/{tagId}` | Lista mapas mentais por página |
| POST | `/mindmaps` | Cria novo mapa mental |
| PUT | `/mindmaps/{id}` | Atualiza mapa mental |
| DELETE | `/mindmaps/{id}` | Remove mapa mental |
| GET | `/pomodoro/registros/{tarefaId}` | Histórico Pomodoro de uma tarefa |
| POST | `/pomodoro/registros` | Salva registro de ciclo Pomodoro |

### Fluxo de Dados

1. Frontend (JS Vanilla) faz `fetch()` para a API em `http://localhost:5152`
2. Backend Minimal API processa a requisição com Entity Framework Core
3. EF Core traduz para SQL e persiste no SQLite (`todo.db`)
4. Migrations são aplicadas automaticamente na inicialização

---

## 📸 Preview das Funcionalidades

- **Kanban com Drag & Drop** — Arraste tarefas entre colunas
- **Nota de Texto** — Duas abas: Quill.js (texto rico) e Block Editor (blocos estilo Notion)
- **Gráfico de Hábitos** — Mapa de contribuição agregado estilo GitHub
- **Canvas Digital** — Desenho à mão livre com múltiplas páginas
- **Pomodoro Timer** — Foco/descanso fixo na sidebar
- **Calendário** — Visão mensal com tarefas e transações
- **Financeiro** — Controle de receitas/despesas com filtros
- **IA Gemini** — Divisão de tarefas e resumo de notas
- **Agenda Diária** — Time blocking com drag & drop do Kanban
- **Mapas Mentais** — Nós, conexões e conversão em tarefas
- **Dark Mode** — Alternância clara/escuro
