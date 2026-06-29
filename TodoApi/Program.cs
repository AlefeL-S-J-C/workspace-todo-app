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

app.MapPost("/tags", async (Tag novaTag, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaTag.Nome))
        return Results.BadRequest(new { mensagem = "O nome da página é obrigatório." });

    if (string.IsNullOrWhiteSpace(novaTag.Tipo))
        novaTag.Tipo = "kanban";

    db.Tags.Add(novaTag);
    await db.SaveChangesAsync();
    return Results.Created($"/tags/{novaTag.Id}", novaTag);
});

app.MapPut("/tags/{id}", async (int id, Tag tagAtualizada, AppDbContext db) =>
{
    var tag = await db.Tags.FindAsync(id);
    if (tag is null) return Results.NotFound();

    tag.Nome = tagAtualizada.Nome ?? tag.Nome;
    tag.Cor = tagAtualizada.Cor ?? tag.Cor;
    tag.Tipo = tagAtualizada.Tipo ?? tag.Tipo;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

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
    db.Database.Migrate();
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

app.MapGet("/transacoes/{tagId}", async (int tagId, AppDbContext db) =>
{
    var transacoes = await db.TransacoesFinanceiras
        .Where(t => t.TagId == tagId)
        .OrderByDescending(t => t.Data)
        .ToListAsync();
    return Results.Ok(transacoes);
});

app.MapPost("/transacoes", async (TransacaoFinanceira nova, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(nova.Descricao))
        return Results.BadRequest(new { mensagem = "A descrição é obrigatória." });

    if (nova.Valor <= 0)
        return Results.BadRequest(new { mensagem = "O valor deve ser maior que zero." });

    if (string.IsNullOrWhiteSpace(nova.Data))
        nova.Data = DateTime.Now.ToString("yyyy-MM-dd");

    db.TransacoesFinanceiras.Add(nova);
    await db.SaveChangesAsync();
    return Results.Created($"/transacoes/{nova.Id}", nova);
});

app.MapPut("/transacoes/{id}", async (int id, TransacaoFinanceira atualizada, AppDbContext db) =>
{
    var transacao = await db.TransacoesFinanceiras.FindAsync(id);
    if (transacao is null) return Results.NotFound();

    if (string.IsNullOrWhiteSpace(atualizada.Descricao))
        return Results.BadRequest(new { mensagem = "A descrição não pode ficar vazia." });

    if (atualizada.Valor <= 0)
        return Results.BadRequest(new { mensagem = "O valor deve ser maior que zero." });

    transacao.Descricao = atualizada.Descricao;
    transacao.Valor = atualizada.Valor;
    transacao.Tipo = atualizada.Tipo;
    transacao.Categoria = atualizada.Categoria;
    transacao.Data = atualizada.Data;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/transacoes/{id}", async (int id, AppDbContext db) =>
{
    var transacao = await db.TransacoesFinanceiras.FindAsync(id);
    if (transacao is null) return Results.NotFound();

    db.TransacoesFinanceiras.Remove(transacao);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/transacoes/todas/{tagId}", async (int tagId, AppDbContext db) =>
{
    var todas = await db.TransacoesFinanceiras
        .Where(t => t.TagId == tagId)
        .ToListAsync();

    if (!todas.Any()) return Results.Ok();

    db.TransacoesFinanceiras.RemoveRange(todas);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/calendario", async (AppDbContext db) =>
{
    var tarefas = await db.Tarefas
        .Include(t => t.Urgencia)
        .Include(t => t.Tag)
        .ToListAsync();

    var transacoes = await db.TransacoesFinanceiras
        .Include(t => t.Tag)
        .ToListAsync();

    var eventos = new List<object>();

    foreach (var t in tarefas)
    {
        var cor = t.Concluida ? "#6c757d" : (t.Urgencia?.Cor ?? "#6c757d");
        eventos.Add(new
        {
            id = $"task-{t.Id}",
            title = t.Texto,
            start = t.DataInicio,
            end = t.DataFim,
            color = cor,
            textColor = "#ffffff",
            type = "tarefa",
            status = t.Status ?? "A Fazer",
            concluida = t.Concluida,
            tagNome = t.Tag?.Nome ?? "",
            tagCor = t.Tag?.Cor ?? ""
        });
    }

    foreach (var tr in transacoes)
    {
        var cor = tr.Tipo == "Receita" ? "#22c55e" : "#ef4444";
        eventos.Add(new
        {
            id = $"trans-{tr.Id}",
            title = $"{tr.Tipo}: {tr.Descricao}",
            start = tr.Data,
            color = cor,
            textColor = "#ffffff",
            type = "transacao",
            valor = tr.Valor,
            categoria = tr.Categoria,
            tipo = tr.Tipo,
            tagNome = tr.Tag?.Nome ?? "",
            tagCor = tr.Tag?.Cor ?? ""
        });
    }

    return Results.Ok(eventos);
});

app.Run();