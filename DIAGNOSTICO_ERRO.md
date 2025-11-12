# 🔍 Diagnóstico de Erros - Meta Conversions API

## ⚠️ Erro: "Erro ao enviar evento para Meta"

Se você está recebendo este erro, siga estes passos para diagnosticar:

## 1️⃣ Verificar Variáveis de Ambiente na Vercel

### Passo a passo:
1. Acesse: https://vercel.com
2. Vá no seu projeto `bonusmarmitas`
3. Clique em **Settings** > **Environment Variables**
4. Verifique se existem estas 2 variáveis:

**Variável 1:**
- Key: `META_PIXEL_ID`
- Value: `1923146491602931`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**Variável 2:**
- Key: `META_ACCESS_TOKEN`
- Value: (o token completo)
- Environments: ✅ Production, ✅ Preview, ✅ Development

### ⚠️ Problemas Comuns:
- ❌ Variável não existe
- ❌ Variável existe mas não está marcada para Production
- ❌ Token expirado ou inválido
- ❌ Token sem permissões para o Pixel

## 2️⃣ Verificar Logs da Vercel

### Como ver os logs:
1. Na Vercel, vá em **Deployments**
2. Clique no último deploy
3. Vá em **Functions** > `/api/conversion`
4. Clique em **View Function Logs**
5. Procure por erros relacionados a:
   - `META_ACCESS_TOKEN não configurado`
   - `Erro na Meta Conversions API`
   - Detalhes do erro da Meta

## 3️⃣ Erros Comuns da Meta API

### Erro: "Invalid access token"
**Causa:** Token expirado ou inválido
**Solução:** 
- Gere um novo token no Meta Events Manager
- Atualize a variável `META_ACCESS_TOKEN` na Vercel
- Faça um redeploy

### Erro: "Invalid pixel_id"
**Causa:** Pixel ID incorreto
**Solução:**
- Verifique se o Pixel ID está correto: `1923146491602931`
- Verifique se o token tem acesso a este Pixel

### Erro: "Invalid parameter"
**Causa:** Dados do evento inválidos
**Solução:**
- Verifique os logs para ver qual parâmetro está inválido
- Pode ser formato de data, telefone, etc.

### Erro: "Permission denied"
**Causa:** Token sem permissões
**Solução:**
- Verifique se o token tem permissão para enviar eventos
- Gere um novo token com todas as permissões necessárias

## 4️⃣ Testar Token Manualmente

Você pode testar o token usando curl:

```bash
curl -X POST "https://graph.facebook.com/v18.0/1923146491602931/events" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{
      "event_name": "Purchase",
      "event_time": 1234567890,
      "user_data": {
        "em": ["hash_do_email"],
        "ph": ["hash_do_telefone"]
      },
      "custom_data": {
        "currency": "BRL",
        "value": 9.90
      }
    }],
    "access_token": "SEU_TOKEN_AQUI"
  }'
```

## 5️⃣ Verificar Permissões do Token

1. Acesse: https://developers.facebook.com/tools/explorer/
2. Selecione seu app
3. Cole o token em "Access Token"
4. Clique em "Debug"
5. Verifique se o token está válido e tem as permissões necessárias

## 6️⃣ Solução Rápida

Se nada funcionar, tente:

1. **Gerar novo token:**
   - Meta Events Manager > Settings > Conversions API
   - Gere um novo token de acesso

2. **Atualizar na Vercel:**
   - Settings > Environment Variables
   - Atualize `META_ACCESS_TOKEN` com o novo token
   - Marque todos os ambientes (Production, Preview, Development)

3. **Fazer redeploy:**
   - Deployments > 3 pontos > Redeploy

## 📞 Próximos Passos

Após melhorar o tratamento de erros, você verá mensagens mais detalhadas:
- Mensagem de erro específica da Meta
- Código do erro
- Tipo do erro

Isso facilitará muito o diagnóstico!

