# 🔑 Configuração do Token de Acesso

## ✅ Seu Token de Acesso

Você já possui um token de acesso da Meta Conversions API. Configure-o nas variáveis de ambiente.

## 📋 Configuração Local (.env.local)

Crie um arquivo `.env.local` na raiz do projeto com:

```env
META_PIXEL_ID=1923146491602931
META_ACCESS_TOKEN=EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
META_TEST_EVENT_CODE=
```

## 🚀 Configuração na Vercel

1. Acesse o dashboard da Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

### Variáveis Obrigatórias:
- **META_PIXEL_ID**: `1923146491602931`
- **META_ACCESS_TOKEN**: `EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD`

### Variáveis Opcionais:
- **META_TEST_EVENT_CODE**: (deixe vazio em produção ou adicione código de teste)
- **KV_REST_API_URL**: (para controle de IP em produção)
- **KV_REST_API_TOKEN**: (para controle de IP em produção)

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env.local` no Git
- O token está no arquivo `.gitignore` para segurança
- Se o token expirar, gere um novo no Meta Business Manager
- Mantenha o token seguro e não compartilhe publicamente

## 🔍 Verificar se Está Funcionando

Após configurar:

1. Preencha o formulário no site
2. Acesse [Meta Events Manager](https://business.facebook.com/events_manager2)
3. Selecione seu Pixel (ID: 1923146491602931)
4. Vá em **Test Events** para ver eventos em tempo real
5. Verifique se o evento Purchase aparece

## 📞 Suporte

Se os eventos não aparecerem:
- Verifique se o token está correto
- Confirme que o Pixel ID está correto
- Verifique os logs da Vercel em **Deployments** > **Functions**
- Teste localmente primeiro com `npm run dev`

