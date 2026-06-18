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

app.MapGet("/tags", async (AppDbContext db) =>
    await db.Tags.ToListAsync());

app.MapGet("/tarefas", async (AppDbContext db) =>
{
    var lista = await db.Tarefas
        .Include(t => t.Urgencia)
        .Include(t => t.Tag)
        .Include(t => t.Subtarefas)
        .ToListAsync();
    return Results.Ok(lista);
});

app.MapPost("/tarefas", async (Tarefa novaTarefa, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaTarefa.Texto))
    {
        return Results.BadRequest(new { mensagem = "O título da tarefa é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(novaTarefa.DataInicio) || string.IsNullOrWhiteSpace(novaTarefa.DataFim))
    {
        return Results.BadRequest(new { message = "As datas são obrigatórias." });
    }

    if (string.IsNullOrWhiteSpace(novaTarefa.Status))
    {
        novaTarefa.Status = "A Fazer";
    }

    TimeZoneInfo fusoBrasil = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
    DateTime dataHoje = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, fusoBrasil).Date;

    DateTime dataInicio = DateTime.Parse(novaTarefa.DataInicio).Date;
    DateTime dataFim = DateTime.Parse(novaTarefa.DataFim);

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

    if (string.IsNullOrWhiteSpace(tarefaAtualizada.Texto))
    {
        return Results.BadRequest(new { mensagem = "O título não pode ficar vazio." });
    }

    TimeZoneInfo fusoBrasil = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
    DateTime dataHoje = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, fusoBrasil).Date;

    DateTime dataInicio = DateTime.Parse(tarefaAtualizada.DataInicio).Date;
    DateTime dataFim = DateTime.Parse(tarefaAtualizada.DataFim);

    if (dataInicio < dataHoje && dataInicio != DateTime.Parse(tarefa.DataInicio).Date)
    {
        return Results.BadRequest(new { mensagem = "A data de início não pode ser inferior à data atual." });
    }

    if (dataFim < dataInicio)
    {
        return Results.BadRequest(new { mensagem = "O prazo final não pode ser menor que a data de início." });
    }

    tarefa.Texto = tarefaAtualizada.Texto;
    tarefa.Concluida = tarefaAtualizada.Status == "Concluído";
    tarefa.Status = tarefaAtualizada.Status;
    tarefa.DataInicio = tarefaAtualizada.DataInicio;
    tarefa.DataFim = tarefaAtualizada.DataFim;
    tarefa.Descricao = tarefaAtualizada.Descricao;
    tarefa.UrgenciaId = tarefaAtualizada.UrgenciaId;
    tarefa.TagId = tarefaAtualizada.TagId;

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

app.MapPost("/subtarefas", async (Subtarefa novaSub, AppDbContext db) =>
{
    db.Subtarefas.Add(novaSub);
    await db.SaveChangesAsync();
    return Results.Created($"/subtarefas/{novaSub.Id}", novaSub);
});

app.MapPut("/subtarefas/{id}", async (int id, Subtarefa subAtualizada, AppDbContext db) =>
{
    var sub = await db.Subtarefas.FindAsync(id);
    if (sub is null) return Results.NotFound();

    sub.Texto = subAtualizada.Texto;
    sub.Concluida = subAtualizada.Concluida;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/subtarefas/{id}", async (int id, AppDbContext db) =>
{
    var sub = await db.Subtarefas.FindAsync(id);
    if (sub is null) return Results.NotFound();

    db.Subtarefas.Remove(sub);
    await db.SaveChangesAsync();
    return Results.NoContent();
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
app.MapGet("/anotacoes/{tagId}", async (int tagId, AppDbContext db) =>
{
    var anotacoes = await db.Anotacoes.Where(a => a.TagId == tagId).ToListAsync();
    return Results.Ok(anotacoes);
});

app.MapPost("/anotacoes", async (Anotacao novaAnotacao, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaAnotacao.Titulo))
        return Results.BadRequest(new { mensagem = "O título da nota é obrigatório." });

    db.Anotacoes.Add(novaAnotacao);
    await db.SaveChangesAsync();
    return Results.Created($"/anotacoes/{novaAnotacao.Id}", novaAnotacao);
});

app.MapDelete("/anotacoes/{id}", async (int id, AppDbContext db) =>
{
    var nota = await db.Anotacoes.FindAsync(id);
    if (nota is null) return Results.NotFound();

    db.Anotacoes.Remove(nota);
    await db.SaveChangesAsync();
    return Results.Ok();
});
app.Run();