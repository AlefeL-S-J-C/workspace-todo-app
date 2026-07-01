Set-Location 'C:\Users\alefe\Documents\c#\workspace-todo-app\TodoApi'
$process = Start-Process dotnet -Argument 'run' -NoNewWindow -PassThru
Start-Sleep 8
try {
    $urgencias = Invoke-RestMethod -Uri 'http://localhost:5152/urgencias' -ErrorAction Stop
    Write-Host "✅ /urgencias OK - Count: $($urgencias.Length)"
    $tags = Invoke-RestMethod -Uri 'http://localhost:5152/tags' -ErrorAction Stop
    Write-Host "✅ /tags OK - Count: $($tags.Length)"
    $tarefas = Invoke-RestMethod -Uri 'http://localhost:5152/tarefas' -ErrorAction Stop
    Write-Host "✅ /tarefas OK - Count: $($tarefas.Length)"
    $habitos = Invoke-RestMethod -Uri 'http://localhost:5152/habitos' -ErrorAction Stop
    Write-Host "✅ /habitos OK - Count: $($habitos.Length)"
    Write-Host "`n🎉 TODOS OS ENDPOINTS FUNCIONANDO!"
} catch {
    Write-Host "❌ ERRO: $_"
}
$process | Stop-Process -Force
