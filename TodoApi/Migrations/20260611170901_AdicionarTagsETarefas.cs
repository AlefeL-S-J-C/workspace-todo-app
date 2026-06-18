using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarTagsETarefas : Migration
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
                    Cor = table.Column<string>(type: "TEXT", nullable: false)
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
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Texto = table.Column<string>(type: "TEXT", nullable: false),
                    Concluida = table.Column<bool>(type: "INTEGER", nullable: false),
                    DataInicio = table.Column<string>(type: "TEXT", nullable: false),
                    DataFim = table.Column<string>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
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

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "Cor", "Nome" },
                values: new object[,]
                {
                    { 1, "#6366f1", "Trabalho" },
                    { 2, "#a855f7", "Estudos" },
                    { 3, "#ec4899", "Pessoal" },
                    { 4, "#14b8a6", "Casa" }
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
                name: "IX_Tarefas_TagId",
                table: "Tarefas",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_UrgenciaId",
                table: "Tarefas",
                column: "UrgenciaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tarefas");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Urgencias");
        }
    }
}
