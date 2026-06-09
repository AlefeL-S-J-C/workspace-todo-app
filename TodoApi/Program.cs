using Microsoft.EntityFrameworkCore;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=todo.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFront", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("PermitirFront");

app.MapGet("/urgencias", async (AppDbContext db) =>
    await db.Urgencias.ToListAsync());

app.MapGet("/tarefas", async (AppDbContext db) =>
    await db.Tarefas.Include(t => t.Urgencia).ToListAsync());

app.MapPost("/tarefas", async (Tarefa novaTarefa, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaTarefa.Texto))
    {
        return Results.BadRequest(new { mensagem = "O título da tarefa é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(novaTarefa.DataInicio) || string.IsNullOrWhiteSpace(novaTarefa.DataFim))
    {
        return Results.BadRequest(new { mensagem = "As datas de início e prazo são obrigatórias." });
    }

    DateTime dataHoje = DateTime.Today;
    DateTime dataInicio = DateTime.Parse(novaTarefa.DataInicio).Date;
    DateTime dataFim = DateTime.Parse(novaTarefa.DataFim).Date;

    if (dataInicio < dataHoje)
    {
        return Results.BadRequest(new { mensagem = "A data de início não pode ser inferior à data atual." });
    }

    if (dataFim < dataInicio)
    {
        return Results.BadRequest(new { mensagem = "O prazo final não pode ser menor que a data de início." });
    }

    db.Tarefas.Add(novaTarefa);

    await db.SaveChangesAsync();

    return Results.Created($"/tarefas/{novaTarefa.Id}", novaTarefa);
});

app.MapPut("/tarefas/{id}", async (int id, Tarefa tarefaAtualizada, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);

    if (tarefa is null) return Results.NotFound();

    // Valida se o título atualizado possui conteúdo de caracteres válido
    if (string.IsNullOrWhiteSpace(tarefaAtualizada.Texto))
    {
        return Results.BadRequest(new { mensagem = "O título da tarefa não pode ficar vazio." });
    }

    DateTime dataHoje = DateTime.Today;
    DateTime dataInicio = DateTime.Parse(tarefaAtualizada.DataInicio).Date;
    DateTime dataFim = DateTime.Parse(tarefaAtualizada.DataFim).Date;

    if (dataInicio < dataHoje)
    {
        return Results.BadRequest(new { mensagem = "A data de início não pode ser inferior à data atual." });
    }

    if (dataFim < dataInicio)
    {
        return Results.BadRequest(new { mensagem = "O prazo final não pode ser menor que a data de início." });
    }

    tarefa.Texto = tarefaAtualizada.Texto;
    tarefa.Concluida = tarefaAtualizada.Concluida;
    tarefa.DataInicio = tarefaAtualizada.DataInicio;
    tarefa.DataFim = tarefaAtualizada.DataFim;
    tarefa.Descricao = tarefaAtualizada.Descricao;
    tarefa.UrgenciaId = tarefaAtualizada.UrgenciaId;


    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/tarefas/{id}", async (int id, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa is null) return Results.NotFound();

    db.Tarefas.Remove(tarefa);

    await db.SaveChangesAsync();

    return Results.Ok();
});

app.MapDelete("/tarefas/todas", async (AppDbContext db) =>
{
    var todasAsTarefas = await db.Tarefas.ToListAsync();

    if (!todasAsTarefas.Any()) return Results.Ok();

    db.Tarefas.RemoveRange(todasAsTarefas);

    await db.SaveChangesAsync();
    return Results.Ok();
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    if (!db.Urgencias.Any())
    {
        db.Urgencias.AddRange(
            new Urgencia { Id = 1, Descricao = "Não Urgente", Prazo = "24 dias", Cor = "#007bff", Classe = "bg-primary" },
            new Urgencia { Id = 2, Descricao = "Pouco Urgente", Prazo = "12 dias", Cor = "#198754", Classe = "bg-success" },
            new Urgencia { Id = 3, Descricao = "Urgente", Prazo = "6 dias", Cor = "#ffc107", Classe = "bg-warning" },
            new Urgencia { Id = 4, Descricao = "Muito Urgente", Prazo = "1 dia", Cor = "#fd7e14", Classe = "bg-orange" },
            new Urgencia { Id = 5, Descricao = "Imediato", Prazo = "Imediato", Cor = "#dc3545", Classe = "bg-danger" }
        );
        db.SaveChanges();
    }
}
app.Run();