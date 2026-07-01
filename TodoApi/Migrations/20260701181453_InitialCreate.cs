using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Cor = table.Column<string>(type: "TEXT", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Urgencias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Descricao = table.Column<string>(type: "TEXT", nullable: false),
                    Prazo = table.Column<string>(type: "TEXT", nullable: false),
                    Cor = table.Column<string>(type: "TEXT", nullable: false),
                    Classe = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Urgencias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Anotacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Titulo = table.Column<string>(type: "TEXT", nullable: false),
                    ImagemBase64 = table.Column<string>(type: "TEXT", nullable: false),
                    Conteudo = table.Column<string>(type: "TEXT", nullable: false),
                    TipoFolha = table.Column<string>(type: "TEXT", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: false),
                    TagId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anotacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Anotacoes_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Habitos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Cor = table.Column<string>(type: "TEXT", nullable: false),
                    TagId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Habitos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Habitos_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransacoesFinanceiras",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Descricao = table.Column<string>(type: "TEXT", nullable: false),
                    Valor = table.Column<decimal>(type: "TEXT", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: false),
                    Categoria = table.Column<string>(type: "TEXT", nullable: false),
                    Data = table.Column<string>(type: "TEXT", nullable: false),
                    TagId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransacoesFinanceiras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransacoesFinanceiras_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Texto = table.Column<string>(type: "TEXT", nullable: false),
                    Concluida = table.Column<bool>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    DataInicio = table.Column<string>(type: "TEXT", nullable: false),
                    DataFim = table.Column<string>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: false),
                    UrgenciaId = table.Column<int>(type: "INTEGER", nullable: true),
                    TagId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarefas_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tarefas_Urgencias_UrgenciaId",
                        column: x => x.UrgenciaId,
                        principalTable: "Urgencias",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RegistroHabitos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Data = table.Column<string>(type: "TEXT", nullable: false),
                    Concluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    HabitoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistroHabitos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistroHabitos_Habitos_HabitoId",
                        column: x => x.HabitoId,
                        principalTable: "Habitos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subtarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Texto = table.Column<string>(type: "TEXT", nullable: false),
                    Concluida = table.Column<bool>(type: "INTEGER", nullable: false),
                    TarefaId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subtarefas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subtarefas_Tarefas_TarefaId",
                        column: x => x.TarefaId,
                        principalTable: "Tarefas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "Cor", "Nome", "Tipo" },
                values: new object[,]
                {
                    { 1, "#6366f1", "Trabalho", "kanban" },
                    { 2, "#a855f7", "Estudos", "kanban" },
                    { 3, "#3b82f6", "Faculdade", "kanban" },
                    { 4, "#ec4899", "Pessoal", "kanban" },
                    { 5, "#14b8a6", "Casa", "kanban" },
                    { 6, "#22c55e", "Financeiro", "financeiro" }
                });

            migrationBuilder.InsertData(
                table: "Urgencias",
                columns: new[] { "Id", "Classe", "Cor", "Descricao", "Prazo" },
                values: new object[,]
                {
                    { 1, "bg-primary", "#007bff", "Não Urgente", "24 dias" },
                    { 2, "bg-success", "#198754", "Pouco Urgente", "12 dias" },
                    { 3, "bg-warning", "#ffc107", "Urgente", "6 dias" },
                    { 4, "bg-orange", "#fd7e14", "Muito Urgente", "1 dia" },
                    { 5, "bg-danger", "#dc3545", "Imediato", "Imediato" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Anotacoes_TagId",
                table: "Anotacoes",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Habitos_TagId",
                table: "Habitos",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistroHabitos_HabitoId",
                table: "RegistroHabitos",
                column: "HabitoId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtarefas_TarefaId",
                table: "Subtarefas",
                column: "TarefaId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_TagId",
                table: "Tarefas",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_UrgenciaId",
                table: "Tarefas",
                column: "UrgenciaId");

            migrationBuilder.CreateIndex(
                name: "IX_TransacoesFinanceiras_TagId",
                table: "TransacoesFinanceiras",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Anotacoes");

            migrationBuilder.DropTable(
                name: "RegistroHabitos");

            migrationBuilder.DropTable(
                name: "Subtarefas");

            migrationBuilder.DropTable(
                name: "TransacoesFinanceiras");

            migrationBuilder.DropTable(
                name: "Habitos");

            migrationBuilder.DropTable(
                name: "Tarefas");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Urgencias");
        }
    }
}
