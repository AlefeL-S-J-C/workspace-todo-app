# 🚀 Workspace To-Do & Digital Notes

Uma aplicação web completa para gestão de produtividade que combina um sistema de **Quadro Kanban** avançado com um **Bloco de Notas Digital** nativo, suportando múltiplas páginas e escrita à mão (com mouse, toque ou canetas digitais como a S-Pen).

## ✨ Funcionalidades Principais

### 📋 Gestão de Tarefas (Kanban)
* **Organização por Páginas/Tags:** Cria diferentes espaços de trabalho (ex: Faculdade, Trabalho, Casa).
* **Quadro Interativo:** Move as tarefas entre "A Fazer", "Em Andamento" e "Concluído".
* **Prazos Automáticos:** O sistema calcula automaticamente a data final com base no Grau de Urgência (Imediato, Muito Urgente, Urgente, Pouco Urgente, Não Urgente).
* **Subtarefas (Checklists):** Adiciona passos menores dentro de uma tarefa principal e acompanha o progresso.
* **Alertas Visuais:** As tarefas atrasadas ou a expirar no próprio dia piscam e recebem etiquetas de alerta automático.

### 📝 Bloco de Notas Digital (Estilo Samsung Notes/Notion)
* **Canvas Interativo:** Desenha e escreve à mão com suporte nativo a `PointerEvents` (ideal para ecrãs táteis e stylus/S-Pen).
* **Múltiplas Páginas:** Cria cadernos inteiros dentro de uma única nota.
* **Tipos de Folha:** Escolhe entre folha em branco, pautada, quadriculada ou pontilhada.
* **Personalização de Traço:** Altera a cor, espessura e utiliza borracha.
* **Visualização Ágil:** Visualiza as tuas notas através de uma galeria e navega pelas páginas sem precisar de as abrir para edição.

### 📱 Interface e Experiência (UI/UX)
* **Design Responsivo:** O layout adapta-se perfeitamente a telemóveis, tablets e computadores de secretária.
* **Menu Lateral Retrátil:** Num telemóvel, o menu transforma-se numa "gaveta" oculta para maximizar o espaço de ecrã.
* **Pesquisa em Tempo Real:** Encontra rapidamente tarefas pendentes ou concluídas.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* HTML5, CSS3, JavaScript (Vanilla)
* [Bootstrap 5](https://getbootstrap.com/) (Componentes e Sistema de Grelha)
* [SweetAlert2](https://sweetalert2.github.io/) (Pop-ups e Alertas bonitos)
* HTML `<canvas>` API

**Backend:**
* C# .NET 8 (Minimal APIs)
* Entity Framework Core (ORM)
* SQLite (Base de Dados Embutida)

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [.NET 8 SDK](https://dotnet.microsoft.com/download) instalado na tua máquina.
* Um navegador web moderno.

### Passos
1. Clona este repositório:
   ```bash
   git clone [https://github.com/teu-utilizador/nome-do-repositorio.git](https://github.com/teu-utilizador/nome-do-repositorio.git)