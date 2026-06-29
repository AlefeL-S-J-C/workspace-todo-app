# 🚀 Workspace To-Do, Digital Notes & Finance

Uma aplicação web completa para produtividade e finanças pessoais que combina **Quadro Kanban**, **Bloco de Notas Digital** e **Controle Financeiro**, suportando múltiplas páginas e escrita à mão.

## ✨ Funcionalidades Principais

### 🍅 Pomodoro Timer (Novo)
* **Timer Foco/Descanso:** Cronômetro de 25 minutos de foco e 5 minutos de descanso fixo na barra lateral.
* **Iniciar/Pausar/Reset:** Controle completo do timer a qualquer momento.
* **Contador de Sessões:** Exibe quantos ciclos de foco foram concluídos (`🍅 N`).
* **Notificações:** Alerta no navegador ao final de cada ciclo de foco ou descanso.
* **Feedback Visual:** Timer muda de cor (verde = foco, azul = descanso) enquanto está rodando.

### 📅 Calendário Integrado (Novo)
* **Visão Unificada:** Exibe tarefas e transações financeiras em um único calendário mensal.
* **Navegação:** Alterna entre meses e visualiza os eventos do dia.
* **Links Rápidos:** Clique em uma tarefa ou transação no calendário para abrir seus detalhes.
* **Página Dedicada:** Aba "📅 Calendário" na sidebar alterna para a visão completa do calendário.

### 💰 Controle Financeiro
* **Receitas e Despesas:** Registre entradas e saídas com descrição, valor, categoria e data.
* **Resumo Financeiro:** Cards com total de receitas, despesas e saldo atual.
* **Filtros Inteligentes:** Filtre transações por categoria (Alimentação, Transporte, Salário, etc.) e por mês.
* **Categorias Pré-definidas:** Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Salário, Investimento, Outros.
* **Formatação BRL:** Valores exibidos no formato monetário brasileiro (R$).
* **Página Dedicada:** A aba "💰 Financeiro" na sidebar alterna automaticamente para a visão financeira.

### 📋 Gestão de Tarefas (Kanban)
* **Organização por Páginas/Tags:** Cria diferentes espaços de trabalho (ex: Faculdade, Trabalho, Casa).
* **Quadro Interativo:** Move as tarefas entre "A Fazer", "Em Andamento" e "Concluído" facilmente arrastando e soltando (Drag & Drop).
* **Prazos Automáticos:** O sistema calcula automaticamente a data final com base no Grau de Urgência (Imediato, Muito Urgente, Urgente, Pouco Urgente, Não Urgente).
* **Subtarefas (Checklists):** Adiciona passos menores dentro de uma tarefa principal e acompanha o progresso.
* **Alertas Visuais:** As tarefas atrasadas ou a expirar no próprio dia piscam e recebem etiquetas de alerta automático.
* **Efeito de Celebração:** Animação de confetes na tela ao concluir tarefas!

### 📝 Bloco de Notas Digital (Estilo Samsung Notes/Notion)
* **Canvas Interativo:** Desenha e escreve à mão com suporte nativo a `PointerEvents` (ideal para ecrãs táteis e stylus/S-Pen).
* **Textos Editáveis:** Digite pelo teclado utilizando uma ferramenta de texto flutuante. Altere fontes, tamanhos e cores.
* **Ferramentas de Escrita:**
  * **Caneta:** Traços dinâmicos com espessura e cores variáveis.
  * **Marca-Texto:** Traço chanfrado e translúcido que passa por trás dos textos sem borrar.
  * **Borracha:** Apaga com precisão os traços feitos.
* **Desfazer/Refazer (Undo/Redo):** Controle total com botões ou atalhos (`Ctrl+Z` / `Ctrl+Y`).
* **Múltiplas Páginas:** Cria cadernos inteiros dentro de uma única nota.
* **Tipos de Folha:** Em branco, pautada, quadriculada ou pontilhada.
* **Exportação:** Baixa a nota como imagem `.png` mesclando fundo, desenhos e textos.

### 📱 Interface e Experiência (UI/UX)
* **Design Responsivo:** Adapta-se a telemóveis, tablets e computadores.
* **Tooltips nativos:** Botões com balões flutuantes descritivos.
* **Modo Escuro (Dark Mode):** Interface adaptada para ambientes de pouca luz.
* **Menu Lateral Retrátil:** Em mobile, o menu vira uma "gaveta" oculta.
* **Pesquisa em Tempo Real:** Filtra tarefas instantaneamente.
* **Integração Total:** Calendário une tarefas e finanças; Pomodoro sempre acessível na sidebar.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* HTML5, CSS3, JavaScript (Vanilla)
* [Bootstrap 5](https://getbootstrap.com/)
* [SweetAlert2](https://sweetalert2.github.io/)
* [FullCalendar 6](https://fullcalendar.io/) (Calendário Integrado)
* [Canvas Confetti](https://github.com/catdad/canvas-confetti)
* HTML `<canvas>` API (Contexto 2D)
* Notification API (Pomodoro Timer)

**Backend:**
* C# .NET 10 (Minimal APIs)
* Entity Framework Core (ORM)
* SQLite (Base de Dados Embutida)

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* Navegador web moderno

### Passos
1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd workspace-todo-app
```

2. Execute a API:
```bash
cd TodoApi
dotnet run
```

3. Abra o frontend:
   - Use o Live Server no VS Code para abrir `TodoApi/wwwroot/indexx.html`
   - Ou acesse diretamente pelo navegador o arquivo

4. A API roda em `http://localhost:5152`

## 📊 Estrutura do Projeto

```
TodoApi/
├── Program.cs              # Minimal API endpoints
├── AppDbContext.cs          # EF Core DbContext + seed data
├── Models/
│   ├── Tarefa.cs
│   ├── Subtarefa.cs
│   ├── Urgencia.cs
│   ├── Tag.cs              # Páginas com tipo (kanban/financeiro)
│   ├── Anotacao.cs
│   └── TransacaoFinanceira.cs
├── Migrations/
└── wwwroot/
    ├── indexx.html          # Frontend SPA
    ├── todo2.js             # Lógica JavaScript
    └── content/CSS/style.css
```
