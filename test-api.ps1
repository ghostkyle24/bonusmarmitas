# Script de teste para API de Conversões (PowerShell)
# Use: .\test-api.ps1

Write-Host "🧪 Testando API de Conversões..." -ForegroundColor Cyan
Write-Host ""

# URL da API (ajuste conforme necessário)
$apiUrl = "http://localhost:3000/api/conversion"

# Dados de teste
$data = @{
    email = "teste@example.com"
    firstName = "João"
    lastName = "Silva"
    phone = "(11) 99999-9999"
    gender = "m"
    birthdate = "1990-01-15"
    country = "BR"
    state = "SP"
    city = "São Paulo"
} | ConvertTo-Json

Write-Host "📤 Enviando requisição para: $apiUrl" -ForegroundColor Yellow
Write-Host "📋 Dados de teste:"
Write-Host $data
Write-Host ""
Write-Host "⏳ Aguardando resposta..." -ForegroundColor Yellow
Write-Host ""

# Headers
$headers = @{
    "Content-Type" = "application/json"
    "X-Forwarded-For" = "192.168.1.100"
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

try {
    # Fazer a requisição
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Headers $headers -Body $data -ErrorAction Stop
    
    Write-Host "✅ Sucesso! Evento enviado para Meta." -ForegroundColor Green
    Write-Host ""
    Write-Host "📥 Resposta:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Erro na requisição!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    
    # Tentar ler o corpo da resposta de erro
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "Corpo da resposta:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}

