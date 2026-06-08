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

app.MapGet("/tarefas", async (AppDbContext db) =>
    await db.Tarefas.ToListAsync());

app.MapPost("/tarefas", async (Tarefa novaTarefa, AppDbContext db) =>
{
    db.Tarefas.Add(novaTarefa);
    await db.SaveChangesAsync();
    return Results.Created($"/tarefas/{novaTarefa.Id}", novaTarefa);
});

app.MapPut("/tarefas/{id}", async (int id, Tarefa tarefaAtualizada, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa is null) return Results.NotFound();

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
app.Run();