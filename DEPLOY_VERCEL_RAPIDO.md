# 🚀 Deploy Rápido na Vercel

## ✅ Checklist Antes de Subir

- [x] Código completo e funcionando
- [x] `.gitignore` configurado (não commita `.env.local`)
- [x] Token e Pixel já documentados
- [x] Arquivo `VARIAVEIS_AMBIENTE.txt` criado com variáveis de teste
- [x] Pronto para deploy!

**📝 Nota:** As variáveis de ambiente são de teste e podem ser configuradas diretamente na Vercel. Veja o arquivo `VARIAVEIS_AMBIENTE.txt` para copiar os valores rapidamente.

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

### 2.3. Configurar Variáveis de Ambiente ⚡

**IMPORTANTE:** Configure as variáveis ANTES do primeiro deploy para evitar erros!

**💡 Dica Rápida:** Abra o arquivo `VARIAVEIS_AMBIENTE.txt` para copiar os valores rapidamente!

1. Após importar o projeto, **NÃO clique em Deploy ainda**
2. Vá em **Settings** > **Environment Variables**
3. Adicione as variáveis uma por uma:

**Variável 1:**
- **Key**: `META_PIXEL_ID`
- **Value**: `1923146491602931` (copie do arquivo `VARIAVEIS_AMBIENTE.txt`)
- **Environment**: Marque ✅ Production, ✅ Preview, ✅ Development
- Clique em **Save**

**Variável 2:**
- **Key**: `META_ACCESS_TOKEN`
- **Value**: `EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD` (copie do arquivo `VARIAVEIS_AMBIENTE.txt`)
- **Environment**: Marque ✅ Production, ✅ Preview, ✅ Development
- Clique em **Save**

4. **Agora sim**, volte em **Deployments** e clique em **Deploy** (ou faça um novo commit)

### 2.4. Fazer Novo Deploy (se necessário)

Se você já configurou as variáveis antes do primeiro deploy, pule esta etapa.

Caso contrário:
1. Vá em **Deployments**
2. Clique nos 3 pontos (⋯) do último deploy
3. Clique em **Redeploy**
4. Ou faça um novo commit e push (deploy automático)

**💡 Dica:** Se você configurou as variáveis ANTES do deploy, não precisa fazer redeploy!

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

