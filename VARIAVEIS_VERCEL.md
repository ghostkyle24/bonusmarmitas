# 🔑 Variáveis de Ambiente - Vercel

## ✅ Variáveis OBRIGATÓRIAS

Adicione estas variáveis em **Settings** > **Environment Variables** na Vercel:

### 1. META_PIXEL_ID
```
Nome: META_PIXEL_ID
Valor: 1923146491602931
Ambientes: Production, Preview, Development
```

### 2. META_ACCESS_TOKEN
```
Nome: META_ACCESS_TOKEN
Valor: EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
Ambientes: Production, Preview, Development
```

## 🔧 Variáveis OPCIONAIS (Recomendadas)

### 3. KV_REST_API_URL (Para controle de IP/Email em produção)
```
Nome: KV_REST_API_URL
Valor: [URL do seu Vercel KV - obtenha em Storage > KV > Settings]
Ambientes: Production, Preview, Development
```

### 4. KV_REST_API_TOKEN (Para controle de IP/Email em produção)
```
Nome: KV_REST_API_TOKEN
Valor: [Token do seu Vercel KV - obtenha em Storage > KV > Settings]
Ambientes: Production, Preview, Development
```

### 5. META_TEST_EVENT_CODE (Apenas para testes)
```
Nome: META_TEST_EVENT_CODE
Valor: [Código de teste do Meta Events Manager - opcional]
Ambientes: Development (ou deixe vazio em produção)
```

## 📋 Resumo Rápido

**Mínimo necessário:**
- ✅ `META_PIXEL_ID`
- ✅ `META_ACCESS_TOKEN`

**Recomendado para produção:**
- ✅ `META_PIXEL_ID`
- ✅ `META_ACCESS_TOKEN`
- ✅ `KV_REST_API_URL`
- ✅ `KV_REST_API_TOKEN`

## 🎯 Como Adicionar na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Clique em **Add New**
4. Preencha:
   - **Key**: Nome da variável (ex: `META_PIXEL_ID`)
   - **Value**: Valor da variável
   - **Environment**: Selecione Production, Preview e Development
5. Clique em **Save**
6. Repita para cada variável
7. **Importante**: Após adicionar, faça um **Redeploy**

## ⚠️ Importante

- **NUNCA** commite essas variáveis no GitHub
- O `.gitignore` já está configurado para proteger arquivos `.env`
- Essas variáveis são seguras na Vercel (criptografadas)
- Sem o `META_ACCESS_TOKEN`, a API não funcionará

## 🔍 Verificar se Está Funcionando

Após configurar e fazer redeploy:
1. Acesse sua URL da Vercel
2. Preencha o formulário
3. Verifique no Meta Events Manager se o evento apareceu

