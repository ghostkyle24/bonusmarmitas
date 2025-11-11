# 🚀 Teste Rápido da API

## 1️⃣ Iniciar o Servidor

```bash
npm run dev
```

O servidor deve iniciar em: `http://localhost:3000`

## 2️⃣ Testar com cURL (Windows CMD)

Abra um **novo terminal** (CMD) e execute:

```cmd
curl -X POST http://localhost:3000/api/conversion -H "Content-Type: application/json" -H "X-Forwarded-For: 192.168.1.100" -H "User-Agent: Mozilla/5.0" -d "{\"email\":\"teste@example.com\",\"firstName\":\"João\",\"lastName\":\"Silva\",\"phone\":\"11999999999\",\"country\":\"BR\"}"
```

## 3️⃣ Testar com PowerShell

Abra o **PowerShell** e execute:

```powershell
$body = @{
    email = "teste@example.com"
    firstName = "João"
    lastName = "Silva"
    phone = "11999999999"
    country = "BR"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Forwarded-For" = "192.168.1.100"
    "User-Agent" = "Mozilla/5.0"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/conversion" -Method POST -Headers $headers -Body $body
```

## ✅ Resposta Esperada

```json
{
  "success": true,
  "message": "Evento enviado com sucesso",
  "event_id": "algum-uuid",
  "meta_response": {
    "events_received": 1
  },
  "events_received": 1
}
```

## 🔄 Testar Duplicata

Execute o mesmo comando novamente. Deve retornar:

```json
{
  "error": "Este email já foi cadastrado. Apenas um cadastro por pessoa é permitido."
}
```

## 📊 Verificar no Meta Events Manager

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione Pixel: **1923146491602931**
3. Vá em **Test Events**
4. Você deve ver o evento **Purchase** aparecer!

## ⚠️ Se Der Erro

### "Cannot POST /api/conversion"
- Verifique se o servidor está rodando (`npm run dev`)

### "Configuração do servidor incompleta"
- Crie o arquivo `.env.local` com:
```env
META_PIXEL_ID=1923146491602931
META_ACCESS_TOKEN=EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
```

### Evento não aparece no Meta
- Verifique os logs do servidor
- Confirme que o token está correto
- Aguarde alguns segundos (pode ter delay)

