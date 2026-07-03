using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPomodoroAndCustoEstimado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CustoEstimado",
                table: "Tarefas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RegistrosPomodoro",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TarefaId = table.Column<int>(type: "INTEGER", nullable: false),
                    Data = table.Column<string>(type: "TEXT", nullable: false),
                    CiclosCompletados = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalMinutos = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosPomodoro", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosPomodoro_Tarefas_TarefaId",
                        column: x => x.TarefaId,
                        principalTable: "Tarefas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosPomodoro_TarefaId",
                table: "RegistrosPomodoro",
                column: "TarefaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistrosPomodoro");

            migrationBuilder.DropColumn(
                name: "CustoEstimado",
                table: "Tarefas");
        }
    }
}
