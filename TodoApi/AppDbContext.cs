using Microsoft.EntityFrameworkCore;

namespace TodoApi
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<Urgencia> Urgencias { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Subtarefa> Subtarefas { get; set; }
        public DbSet<Anotacao> Anotacoes { get; set; }
        public DbSet<TransacaoFinanceira> TransacoesFinanceiras { get; set; }
        public DbSet<Habito> Habitos { get; set; }
        public DbSet<RegistroHabito> RegistroHabitos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Tarefa>()
                .HasOne(t => t.Urgencia)
                .WithMany()
                .HasForeignKey(t => t.UrgenciaId)
                .IsRequired(false);

            modelBuilder.Entity<Tarefa>()
                .HasOne(t => t.Tag)
                .WithMany()
                .HasForeignKey(t => t.TagId)
                .IsRequired(false);

            modelBuilder.Entity<Subtarefa>()
                .HasOne(s => s.Tarefa)
                .WithMany(t => t.Subtarefas)
                .HasForeignKey(s => s.TarefaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Anotacao>()
                .HasOne(a => a.Tag)
                .WithMany()
                .HasForeignKey(a => a.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TransacaoFinanceira>()
                .HasOne(t => t.Tag)
                .WithMany()
                .HasForeignKey(t => t.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Habito>()
                .HasOne(h => h.Tag)
                .WithMany()
                .HasForeignKey(h => h.TagId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RegistroHabito>()
                .HasOne(r => r.Habito)
                .WithMany(h => h.Registros)
                .HasForeignKey(r => r.HabitoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Urgencia>().HasData(
                new Urgencia { Id = 1, Descricao = "Não Urgente", Prazo = "24 dias", Cor = "#007bff", Classe = "bg-primary" },
                new Urgencia { Id = 2, Descricao = "Pouco Urgente", Prazo = "12 dias", Cor = "#198754", Classe = "bg-success" },
                new Urgencia { Id = 3, Descricao = "Urgente", Prazo = "6 dias", Cor = "#ffc107", Classe = "bg-warning" },
                new Urgencia { Id = 4, Descricao = "Muito Urgente", Prazo = "1 dia", Cor = "#fd7e14", Classe = "bg-orange" },
                new Urgencia { Id = 5, Descricao = "Imediato", Prazo = "Imediato", Cor = "#dc3545", Classe = "bg-danger" }
            );

            modelBuilder.Entity<Tag>().HasData(
                new Tag { Id = 1, Nome = "Trabalho", Cor = "#6366f1", Tipo = "kanban" },
                new Tag { Id = 2, Nome = "Estudos", Cor = "#a855f7", Tipo = "kanban" },
                new Tag { Id = 3, Nome = "Faculdade", Cor = "#3b82f6", Tipo = "kanban" },
                new Tag { Id = 4, Nome = "Pessoal", Cor = "#ec4899", Tipo = "kanban" },
                new Tag { Id = 5, Nome = "Casa", Cor = "#14b8a6", Tipo = "kanban" },
                new Tag { Id = 6, Nome = "Financeiro", Cor = "#22c55e", Tipo = "financeiro" }
            );
        }
    }
}
