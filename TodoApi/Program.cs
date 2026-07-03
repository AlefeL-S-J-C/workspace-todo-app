using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=todo.db"));

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

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

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("PermitirFront");

app.MapGet("/urgencias", async (AppDbContext db) =>
    await db.Urgencias.ToListAsync());

app.MapGet("/tags", async (AppDbContext db) =>
    await db.Tags.ToListAsync());

app.MapPost("/tags", async (Tag novaTag, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaTag.Nome))
        return Results.BadRequest(new { mensagem = "O nome da p\u00e1gina \u00e9 obrigat\u00f3rio." });

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

app.MapDelete("/tags/{id}", async (int id, AppDbContext db) =>
{
    var tag = await db.Tags.FindAsync(id);
    if (tag is null) return Results.NotFound();

    db.Tags.Remove(tag);
    await db.SaveChangesAsync();
    return Results.Ok();
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
        return Results.BadRequest(new { mensagem = "O t\u00edtulo da tarefa \u00e9 obrigat\u00f3rio." });

    if (string.IsNullOrWhiteSpace(novaTarefa.DataInicio) || string.IsNullOrWhiteSpace(novaTarefa.DataFim))
        return Results.BadRequest(new { mensagem = "As datas s\u00e3o obrigat\u00f3rias." });

    if (string.IsNullOrWhiteSpace(novaTarefa.Status))
        novaTarefa.Status = "A Fazer";

    db.Tarefas.Add(novaTarefa);
    await db.SaveChangesAsync();
    return Results.Created($"/tarefas/{novaTarefa.Id}", novaTarefa);
});

app.MapPut("/tarefas/{id}", async (int id, Tarefa tarefaAtualizada, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa is null) return Results.NotFound();

    if (string.IsNullOrWhiteSpace(tarefaAtualizada.Texto))
        return Results.BadRequest(new { mensagem = "O t\u00edtulo n\u00e3o pode ficar vazio." });

    tarefa.Texto = tarefaAtualizada.Texto;
    tarefa.Concluida = tarefaAtualizada.Status == "Conclu\u00eddo";
    tarefa.Status = tarefaAtualizada.Status;
    tarefa.DataInicio = tarefaAtualizada.DataInicio;
    tarefa.DataFim = tarefaAtualizada.DataFim;
    tarefa.Descricao = tarefaAtualizada.Descricao;
    tarefa.UrgenciaId = tarefaAtualizada.UrgenciaId;
    tarefa.TagId = tarefaAtualizada.TagId;
    tarefa.CustoEstimado = tarefaAtualizada.CustoEstimado;

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
        return Results.BadRequest(new { mensagem = "O t\u00edtulo da nota \u00e9 obrigat\u00f3rio." });

    db.Anotacoes.Add(novaAnotacao);
    await db.SaveChangesAsync();
    return Results.Created($"/anotacoes/{novaAnotacao.Id}", novaAnotacao);
});

app.MapPut("/anotacoes/{id}", async (int id, Anotacao notaAtualizada, AppDbContext db) =>
{
    var nota = await db.Anotacoes.FindAsync(id);
    if (nota is null) return Results.NotFound();

    nota.Titulo = notaAtualizada.Titulo ?? nota.Titulo;
    nota.ImagemBase64 = notaAtualizada.ImagemBase64 ?? nota.ImagemBase64;
    nota.Conteudo = notaAtualizada.Conteudo ?? nota.Conteudo;
    nota.TipoFolha = notaAtualizada.TipoFolha ?? nota.TipoFolha;
    nota.Tipo = notaAtualizada.Tipo ?? nota.Tipo;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/anotacoes/{id}", async (int id, AppDbContext db) =>
{
    var nota = await db.Anotacoes.FindAsync(id);
    if (nota is null) return Results.NotFound();

    db.Anotacoes.Remove(nota);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/habitos", async (AppDbContext db) =>
{
    var habitos = await db.Habitos
        .Include(h => h.Registros)
        .ToListAsync();
    return Results.Ok(habitos);
});

app.MapGet("/habitos/{tagId}", async (int tagId, AppDbContext db) =>
{
    var habitos = await db.Habitos
        .Include(h => h.Registros)
        .Where(h => h.TagId == tagId)
        .ToListAsync();
    return Results.Ok(habitos);
});

app.MapPost("/habitos", async (Habito novoHabito, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novoHabito.Nome))
        return Results.BadRequest(new { mensagem = "O nome do h\u00e1bito \u00e9 obrigat\u00f3rio." });

    db.Habitos.Add(novoHabito);
    await db.SaveChangesAsync();
    return Results.Created($"/habitos/{novoHabito.Id}", novoHabito);
});

app.MapPut("/habitos/{id}", async (int id, Habito habitoAtualizado, AppDbContext db) =>
{
    var habito = await db.Habitos.FindAsync(id);
    if (habito is null) return Results.NotFound();

    habito.Nome = habitoAtualizado.Nome ?? habito.Nome;
    habito.Cor = habitoAtualizado.Cor ?? habito.Cor;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/habitos/{id}", async (int id, AppDbContext db) =>
{
    var habito = await db.Habitos.FindAsync(id);
    if (habito is null) return Results.NotFound();

    db.Habitos.Remove(habito);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/registros-habitos/{habitoId}", async (int habitoId, AppDbContext db) =>
{
    var registros = await db.RegistroHabitos
        .Where(r => r.HabitoId == habitoId)
        .ToListAsync();
    return Results.Ok(registros);
});

app.MapPost("/registros-habitos", async (RegistroHabito novoRegistro, AppDbContext db) =>
{
    var existente = await db.RegistroHabitos
        .FirstOrDefaultAsync(r => r.HabitoId == novoRegistro.HabitoId && r.Data == novoRegistro.Data);

    if (existente != null)
    {
        existente.Concluido = novoRegistro.Concluido;
        await db.SaveChangesAsync();
        return Results.Ok(existente);
    }

    db.RegistroHabitos.Add(novoRegistro);
    await db.SaveChangesAsync();
    return Results.Created($"/registros-habitos/{novoRegistro.Id}", novoRegistro);
});

app.MapPost("/ia/dividir-tarefa", async (HttpContext http, AppDbContext db) =>
{
    var body = await http.Request.ReadFromJsonAsync<Dictionary<string, string>>();
    if (body == null || !body.ContainsKey("texto"))
        return Results.BadRequest(new { mensagem = "Texto da tarefa \u00e9 obrigat\u00f3rio." });

    string texto = body["texto"];
    string apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? "";
    if (string.IsNullOrWhiteSpace(apiKey))
        return Results.Ok(new { subtarefas = new[] { "Pesquisar sobre o assunto", "Planejar as etapas", "Executar a tarefa principal", "Revisar o resultado", "Finalizar e documentar" } });

    try
    {
        using var client = new HttpClient();
        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = $"Divida a seguinte tarefa em 5 subtarefas menores e detalhadas. Responda apenas com as 5 subtarefas, uma por linha, sem numera\u00e7\u00e3o:\n\n{texto}" }
                    }
                }
            }
        };

        var response = await client.PostAsJsonAsync(
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}",
            requestBody);

        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();

        if (result?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text is string resposta)
        {
            var subtarefas = resposta.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Where(s => s.Length > 0 && !s.StartsWith("-") && !char.IsDigit(s[0]))
                .Take(5)
                .ToArray();

            if (subtarefas.Length == 0)
            {
                subtarefas = resposta.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(s => s.TrimStart('-', ' ', '.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'))
                    .Where(s => s.Length > 0)
                    .Take(5)
                    .ToArray();
            }

            return Results.Ok(new { subtarefas = subtarefas.Length > 0 ? subtarefas : new[] { resposta } });
        }

        return Results.Ok(new { subtarefas = new[] { "Pesquisar sobre o assunto", "Planejar as etapas", "Executar a tarefa principal", "Revisar o resultado", "Finalizar e documentar" } });
    }
    catch
    {
        return Results.Ok(new { subtarefas = new[] { "Pesquisar sobre o assunto", "Planejar as etapas", "Executar a tarefa principal", "Revisar o resultado", "Finalizar e documentar" } });
    }
});

app.MapPost("/ia/resumir-nota", async (HttpContext http, AppDbContext db) =>
{
    var body = await http.Request.ReadFromJsonAsync<Dictionary<string, string>>();
    if (body == null || !body.ContainsKey("conteudo"))
        return Results.BadRequest(new { mensagem = "Conte\u00fado da nota \u00e9 obrigat\u00f3rio." });

    string conteudo = body["conteudo"];
    string apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? "";
    if (string.IsNullOrWhiteSpace(apiKey))
        return Results.Ok(new { resumo = "Resumo n\u00e3o dispon\u00edvel (chave de API n\u00e3o configurada)." });

    try
    {
        using var client = new HttpClient();
        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = $"Resuma o seguinte texto em um par\u00e1grafo curto e objetivo:\n\n{conteudo}" }
                    }
                }
            }
        };

        var response = await client.PostAsJsonAsync(
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}",
            requestBody);

        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();

        var resumo = result?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text ?? "N\u00e3o foi poss\u00edvel gerar resumo.";
        return Results.Ok(new { resumo });
    }
    catch
    {
        return Results.Ok(new { resumo = "Erro ao contactar a IA. Verifique a chave de API." });
    }
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
        return Results.BadRequest(new { mensagem = "A descri\u00e7\u00e3o \u00e9 obrigat\u00f3ria." });

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
        return Results.BadRequest(new { mensagem = "A descri\u00e7\u00e3o n\u00e3o pode ficar vazia." });

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

// ===== TimeBlock (Agenda Diária) =====
app.MapGet("/timeblocks/{data}/{tagId}", async (string data, int tagId, AppDbContext db) =>
{
    var blocks = await db.TimeBlocks
        .Include(t => t.Tarefa)
            .ThenInclude(t => t.Urgencia)
        .Where(t => t.Data == data && t.TagId == tagId)
        .OrderBy(t => t.HoraInicio)
        .ToListAsync();
    return Results.Ok(blocks);
});

app.MapPost("/timeblocks", async (TimeBlock novo, AppDbContext db) =>
{
    if (novo.TarefaId == 0 || string.IsNullOrWhiteSpace(novo.Data) || string.IsNullOrWhiteSpace(novo.HoraInicio))
        return Results.BadRequest(new { mensagem = "Dados incompletos." });

    db.TimeBlocks.Add(novo);
    await db.SaveChangesAsync();
    return Results.Created($"/timeblocks/{novo.Id}", novo);
});

app.MapPut("/timeblocks/{id}", async (int id, TimeBlock atualizado, AppDbContext db) =>
{
    var block = await db.TimeBlocks.FindAsync(id);
    if (block is null) return Results.NotFound();

    block.HoraInicio = atualizado.HoraInicio;
    block.HoraFim = atualizado.HoraFim;
    block.Data = atualizado.Data;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/timeblocks/{id}", async (int id, AppDbContext db) =>
{
    var block = await db.TimeBlocks.FindAsync(id);
    if (block is null) return Results.NotFound();

    db.TimeBlocks.Remove(block);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapDelete("/timeblocks/limpar/{tagId}", async (int tagId, AppDbContext db) =>
{
    var blocks = await db.TimeBlocks.Where(t => t.TagId == tagId).ToListAsync();
    if (!blocks.Any()) return Results.Ok();
    db.TimeBlocks.RemoveRange(blocks);
    await db.SaveChangesAsync();
    return Results.Ok();
});

// ===== MindMap (Mapeamento Mental) =====
app.MapGet("/mindmaps/{tagId}", async (int tagId, AppDbContext db) =>
{
    var maps = await db.MindMaps.Where(m => m.TagId == tagId).ToListAsync();
    return Results.Ok(maps);
});

app.MapPost("/mindmaps", async (MindMap novo, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novo.Titulo))
        return Results.BadRequest(new { mensagem = "O título é obrigatório." });

    if (string.IsNullOrWhiteSpace(novo.Dados))
        novo.Dados = "{\"nodes\":[],\"connections\":[]}";

    db.MindMaps.Add(novo);
    await db.SaveChangesAsync();
    return Results.Created($"/mindmaps/{novo.Id}", novo);
});

app.MapPut("/mindmaps/{id}", async (int id, MindMap atualizado, AppDbContext db) =>
{
    var map = await db.MindMaps.FindAsync(id);
    if (map is null) return Results.NotFound();

    map.Titulo = atualizado.Titulo ?? map.Titulo;
    map.Dados = atualizado.Dados ?? map.Dados;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/mindmaps/{id}", async (int id, AppDbContext db) =>
{
    var map = await db.MindMaps.FindAsync(id);
    if (map is null) return Results.NotFound();

    db.MindMaps.Remove(map);
    await db.SaveChangesAsync();
    return Results.Ok();
});

// ===== Pomodoro History =====
app.MapGet("/pomodoro/registros/{tarefaId}", async (int tarefaId, AppDbContext db) =>
{
    var registros = await db.RegistrosPomodoro
        .Where(r => r.TarefaId == tarefaId)
        .OrderByDescending(r => r.Data)
        .ToListAsync();
    return Results.Ok(registros);
});

app.MapPost("/pomodoro/registros", async (RegistroPomodoro novo, AppDbContext db) =>
{
    if (novo.TarefaId == 0)
        return Results.BadRequest(new { mensagem = "Tarefa é obrigatória." });

    if (novo.CiclosCompletados <= 0)
        return Results.BadRequest(new { mensagem = "Ciclos deve ser maior que zero." });

    db.RegistrosPomodoro.Add(novo);
    await db.SaveChangesAsync();
    return Results.Created($"/pomodoro/registros/{novo.Id}", novo);
});

app.Run();
