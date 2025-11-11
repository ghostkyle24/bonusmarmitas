# 🚀 Guia de Deploy - Vercel

## Passo a Passo Completo

### 1. Preparar o Código

Certifique-se de que todos os arquivos estão commitados:

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Criar Repositório no GitHub

1. Crie um novo repositório no GitHub
2. Conecte seu repositório local:

```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

### 3. Conectar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **Add New Project**
4. Importe seu repositório
5. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - Clique em **Deploy**

### 4. Configurar Variáveis de Ambiente

Após o primeiro deploy, configure as variáveis:

1. Vá em **Settings** > **Environment Variables**
2. Adicione as seguintes variáveis:

#### Obrigatórias:
```
META_PIXEL_ID = 1923146491602931
META_ACCESS_TOKEN = EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
```

#### Opcionais:
```
META_TEST_EVENT_CODE = seu_codigo_de_teste (para testes)
KV_REST_API_URL = (para controle de IP em produção)
KV_REST_API_TOKEN = (para controle de IP em produção)
```

### 5. Configurar Vercel KV (Recomendado)

Para controle de IP funcionar corretamente em produção:

1. No dashboard da Vercel, vá em **Storage**
2. Clique em **Create Database**
3. Selecione **KV** (Key-Value)
4. Dê um nome ao banco (ex: `ip-control`)
5. Após criar, vá em **Settings** do banco
6. Copie as credenciais:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
7. Adicione como variáveis de ambiente no projeto

### 6. Obter Access Token da Meta

1. Acesse [Meta Business Manager](https://business.facebook.com/)
2. Vá em **Configurações** > **Eventos**
3. Selecione seu Pixel (ID: 1923146491602931)
4. Vá em **Configurações** > **Conversions API**
5. Clique em **Configurar** ou **Gerenciar Integrações**
6. Selecione **Criar Token de Acesso**
7. Copie o token gerado
8. Adicione como `META_ACCESS_TOKEN` na Vercel

### 7. Testar

1. Após configurar tudo, faça um novo deploy
2. Acesse sua URL da Vercel
3. Preencha o formulário
4. Verifique no **Meta Events Manager** se o evento chegou:
   - Acesse [Events Manager](https://business.facebook.com/events_manager2)
   - Selecione seu Pixel
   - Vá em **Test Events** para ver eventos em tempo real

### 8. Modo de Teste (Opcional)

Para testar sem afetar dados reais:

1. No Meta Events Manager, vá em **Test Events**
2. Copie o **Test Event Code**
3. Adicione como `META_TEST_EVENT_CODE` na Vercel
4. Faça um novo deploy
5. Os eventos aparecerão como "Test Events"

## ✅ Checklist de Deploy

- [ ] Código commitado e no GitHub
- [ ] Projeto conectado na Vercel
- [ ] `META_PIXEL_ID` configurado
- [ ] `META_ACCESS_TOKEN` configurado
- [ ] Vercel KV criado e configurado (recomendado)
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy realizado com sucesso
- [ ] Teste do formulário funcionando
- [ ] Evento aparecendo no Meta Events Manager

## 🔧 Troubleshooting

### Eventos não aparecem no Meta
- Verifique se o `META_ACCESS_TOKEN` está correto
- Confira os logs da Vercel em **Deployments** > **Functions**
- Verifique se não está em modo de teste (remova `META_TEST_EVENT_CODE`)

### Controle de IP não funciona
- Configure o Vercel KV (passo 5)
- Verifique se as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` estão corretas
- Em desenvolvimento local, funciona com memória (normal)

### Erro 500 no formulário
- Verifique os logs da Vercel
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o Access Token tem permissões corretas

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs da Vercel
2. Verifique o console do navegador
3. Confirme todas as variáveis de ambiente
4. Teste localmente primeiro (`npm run dev`)

