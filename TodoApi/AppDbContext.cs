using Microsoft.EntityFrameworkCore;

namespace TodoApi
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<Urgencia> Urgencias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Urgencia>().HasData(
                new Urgencia { Id = 1, Descricao = "Não Urgente", Prazo = "24 dias", Cor = "#007bff" },
                new Urgencia { Id = 2, Descricao = "Pouco Urgente", Prazo = "12 dias", Cor = "#198754" },
                new Urgencia { Id = 3, Descricao = "Urgente", Prazo = "6 dias", Cor = "#ffc107" },
                new Urgencia { Id = 4, Descricao = "Muito Urgente", Prazo = "1 dia", Cor = "#fd7e14" },
                new Urgencia { Id = 5, Descricao = "Imediato", Prazo = "Imediato", Cor = "#dc3545" }
            );
        }
    }
}