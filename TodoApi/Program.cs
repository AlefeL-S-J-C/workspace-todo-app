using Microsoft.EntityFrameworkCore;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar Banco SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=todo.db"));

// 2. Liberar CORS para o Front-end conseguir acessar
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

// ==========================================
// ENDPOINTS / ROTAS DA API
// ==========================================

// GET: Buscar todas as tarefas
app.MapGet("/tarefas", async (AppDbContext db) =>
    await db.Tarefas.ToListAsync());

// POST: Criar uma nova tarefa
app.MapPost("/tarefas", async (Tarefa novaTarefa, AppDbContext db) =>
{
    db.Tarefas.Add(novaTarefa);
    await db.SaveChangesAsync();
    return Results.Created($"/tarefas/{novaTarefa.Id}", novaTarefa);
});

// PUT: Atualizar tarefa existente
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

// DELETE: Excluir uma tarefa
app.MapDelete("/tarefas/{id}", async (int id, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa is null) return Results.NotFound();

    db.Tarefas.Remove(tarefa);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();