# 🧪 Guia de Teste da API de Conversões

## 📋 Pré-requisitos

1. **Servidor rodando:**
   ```bash
   npm run dev
   ```

2. **Variáveis de ambiente configuradas:**
   - Crie `.env.local` com:
   ```env
   META_PIXEL_ID=1923146491602931
   META_ACCESS_TOKEN=EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
   ```

## 🧪 Teste com cURL (Linux/Mac)

### Teste Básico

```bash
curl -X POST http://localhost:3000/api/conversion \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{
    "email": "teste@example.com",
    "firstName": "João",
    "lastName": "Silva",
    "phone": "(11) 99999-9999",
    "gender": "m",
    "birthdate": "1990-01-15",
    "country": "BR",
    "state": "SP",
    "city": "São Paulo"
  }'
```

### Teste com Script Automatizado

```bash
# Dar permissão de execução
chmod +x test-api.sh

# Executar
./test-api.sh
```

## 🧪 Teste com PowerShell (Windows)

### Teste Básico

```powershell
$body = @{
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

$headers = @{
    "Content-Type" = "application/json"
    "X-Forwarded-For" = "192.168.1.100"
    "User-Agent" = "Mozilla/5.0"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/conversion" -Method POST -Headers $headers -Body $body
```

### Teste com Script Automatizado

```powershell
.\test-api.ps1
```

## 🧪 Teste com cURL (Windows)

```bash
curl -X POST http://localhost:3000/api/conversion ^
  -H "Content-Type: application/json" ^
  -H "X-Forwarded-For: 192.168.1.100" ^
  -H "User-Agent: Mozilla/5.0" ^
  -d "{\"email\":\"teste@example.com\",\"firstName\":\"João\",\"lastName\":\"Silva\",\"phone\":\"(11) 99999-9999\",\"gender\":\"m\",\"birthdate\":\"1990-01-15\",\"country\":\"BR\",\"state\":\"SP\",\"city\":\"São Paulo\"}"
```

## ✅ Resposta Esperada (Sucesso)

```json
{
  "success": true,
  "message": "Evento enviado com sucesso",
  "event_id": "uuid-gerado",
  "meta_response": {
    "events_received": 1
  },
  "events_received": 1
}
```

## ❌ Respostas de Erro

### Email já cadastrado:
```json
{
  "error": "Este email já foi cadastrado. Apenas um cadastro por pessoa é permitido."
}
```

### IP já usado:
```json
{
  "error": "Você já realizou o cadastro. Apenas uma submissão por IP é permitida."
}
```

### Campos obrigatórios faltando:
```json
{
  "error": "Campos obrigatórios não preenchidos"
}
```

### Token não configurado:
```json
{
  "error": "Configuração do servidor incompleta"
}
```

## 🔍 Verificar se Funcionou

### 1. Verificar Logs do Servidor

No terminal onde está rodando `npm run dev`, você verá:
- ✅ Requisição recebida
- ✅ Evento enviado para Meta
- ✅ Resposta da Meta

### 2. Verificar no Meta Events Manager

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione seu Pixel (ID: 1923146491602931)
3. Vá em **Test Events**
4. Você deve ver o evento **Purchase** aparecer em tempo real

### 3. Testar Duplicatas

Execute o mesmo comando duas vezes:

**Primeira vez:** ✅ Sucesso
**Segunda vez:** ❌ Erro "Este email já foi cadastrado"

## 📊 Exemplo Completo de Teste

```bash
# 1. Primeiro teste (deve funcionar)
curl -X POST http://localhost:3000/api/conversion \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -d '{"email":"teste1@example.com","firstName":"João","lastName":"Silva","phone":"11999999999","country":"BR"}'

# 2. Segundo teste com mesmo email (deve dar erro)
curl -X POST http://localhost:3000/api/conversion \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.200" \
  -d '{"email":"teste1@example.com","firstName":"Maria","lastName":"Santos","phone":"11888888888","country":"BR"}'

# 3. Terceiro teste com email diferente (deve funcionar)
curl -X POST http://localhost:3000/api/conversion \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -d '{"email":"teste2@example.com","firstName":"Pedro","lastName":"Costa","phone":"11777777777","country":"BR"}'
```

## 🐛 Troubleshooting

### Erro: "Cannot POST /api/conversion"
- ✅ Verifique se o servidor está rodando (`npm run dev`)
- ✅ Verifique se a URL está correta (`http://localhost:3000`)

### Erro: "Configuração do servidor incompleta"
- ✅ Verifique se o arquivo `.env.local` existe
- ✅ Verifique se `META_ACCESS_TOKEN` está configurado

### Evento não aparece no Meta Events Manager
- ✅ Verifique se o token está correto
- ✅ Verifique os logs do servidor para erros
- ✅ Use `META_TEST_EVENT_CODE` para testar sem afetar dados reais

### Erro de CORS
- ✅ Não deve acontecer em requisições server-side
- ✅ Se acontecer, verifique a configuração do Next.js

## 📝 Notas

- Os dados são armazenados por **24 horas** (depois pode tentar novamente)
- Em desenvolvimento, usa **memória** (limpa ao reiniciar)
- Em produção, usa **Vercel KV** (persistente)
- O email é armazenado como **hash SHA256** (não em texto plano)

