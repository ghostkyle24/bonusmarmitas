# 🚀 Deploy Rápido na Vercel

## ✅ Checklist Antes de Subir

- [x] Código completo e funcionando
- [x] `.gitignore` configurado (não commita `.env.local`)
- [x] Token e Pixel já documentados
- [x] Pronto para deploy!

## 📦 Passo 1: Subir no GitHub

### 1.1. Inicializar Git (se ainda não fez)

```bash
git init
git add .
git commit -m "Initial commit - API Conversões Receitas"
```

### 1.2. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `api-conversoes-receitas` (ou outro nome)
3. **NÃO** marque "Add a README file" (já temos)
4. Clique em **Create repository**

### 1.3. Conectar e Fazer Push

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## 🚀 Passo 2: Deploy na Vercel

### 2.1. Conectar Repositório

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **Add New Project**
4. Selecione seu repositório
5. Clique em **Import**

### 2.2. Configurar Projeto

- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)

**Clique em Deploy!** ⚡

### 2.3. Configurar Variáveis de Ambiente

Após o primeiro deploy (pode falhar sem as variáveis):

1. Vá em **Settings** > **Environment Variables**
2. Adicione:

```
META_PIXEL_ID = 1923146491602931
```

```
META_ACCESS_TOKEN = EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
```

3. Selecione **Production**, **Preview** e **Development**
4. Clique em **Save**

### 2.4. Fazer Novo Deploy

1. Vá em **Deployments**
2. Clique nos 3 pontos do último deploy
3. Clique em **Redeploy**
4. Ou faça um novo commit e push (deploy automático)

## 🎯 Passo 3: Configurar Vercel KV (Opcional mas Recomendado)

Para controle de IP/Email funcionar em produção:

1. No dashboard da Vercel, vá em **Storage**
2. Clique em **Create Database**
3. Selecione **KV**
4. Dê um nome: `ip-control`
5. Após criar, vá em **Settings**
6. Copie as credenciais:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
7. Adicione como variáveis de ambiente no projeto

## ✅ Verificar se Funcionou

1. Acesse sua URL da Vercel (ex: `https://seu-projeto.vercel.app`)
2. Preencha o formulário
3. Verifique no **Meta Events Manager**:
   - https://business.facebook.com/events_manager2
   - Pixel: 1923146491602931
   - Test Events → deve aparecer o evento Purchase

## 🔧 Troubleshooting

### Deploy falha
- Verifique os logs em **Deployments** > **Functions**
- Confirme que todas as dependências estão no `package.json`

### Eventos não aparecem
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que o token está correto
- Verifique os logs da Vercel

### Erro 500
- Verifique os logs em **Deployments** > **Functions**
- Confirme que `META_ACCESS_TOKEN` está configurado

## 📝 Próximos Passos

- ✅ Deploy feito
- ✅ Variáveis configuradas
- ✅ Testar formulário
- ✅ Verificar eventos no Meta Events Manager
- ✅ Compartilhar URL com clientes!

## 🎉 Pronto!

Seu projeto está no ar! 🚀

