# 🔄 Como Atualizar o Site na Vercel via GitHub

## 📋 Processo de Atualização

Quando você faz **push** no GitHub, a Vercel detecta automaticamente e faz o deploy! 🚀

## 🚀 Passo a Passo

### 1️⃣ Verificar Alterações

```bash
git status
```

Isso mostra quais arquivos foram modificados.

### 2️⃣ Adicionar Arquivos ao Stage

```bash
# Adicionar todos os arquivos modificados
git add .

# OU adicionar arquivos específicos:
git add app/page.tsx
git add app/api/conversion/route.ts
git add VALIDACAO_META.md
```

### 3️⃣ Fazer Commit

```bash
git commit -m "Descrição das alterações"

# Exemplo:
git commit -m "Melhorias no envio de eventos Purchase - adicionado delay e logs detalhados"
```

### 4️⃣ Fazer Push para o GitHub

```bash
git push origin main
```

**OU se for a primeira vez:**

```bash
git push -u origin main
```

### 5️⃣ Aguardar Deploy Automático na Vercel

Após o push:
1. ✅ A Vercel detecta automaticamente o novo commit
2. ✅ Inicia o build automaticamente
3. ✅ Faz deploy em alguns minutos
4. ✅ Site atualizado em: `https://bonusmarmitas.vercel.app`

## 📊 Verificar Status do Deploy

### No GitHub:
- Acesse: https://github.com/ghostkyle24/bonusmarmitas
- Veja os commits recentes

### Na Vercel:
1. Acesse: https://vercel.com
2. Entre no seu projeto `bonusmarmitas`
3. Vá em **Deployments**
4. Veja o status do deploy mais recente:
   - 🟢 **Ready** = Deploy concluído com sucesso
   - 🟡 **Building** = Ainda está fazendo build
   - 🔴 **Error** = Erro no deploy (verifique os logs)

## ⚡ Comandos Rápidos (Tudo de Uma Vez)

```bash
# Adicionar, commitar e fazer push em um comando:
git add . && git commit -m "Atualização: melhorias no envio de eventos" && git push origin main
```

## 🔍 Verificar se Funcionou

1. **Aguarde 2-5 minutos** após o push
2. Acesse: https://bonusmarmitas.vercel.app
3. Teste o formulário
4. Verifique os logs no console do navegador (F12)
5. Confirme no **Meta Events Manager** que os eventos estão chegando

## ⚠️ Importante

### ✅ O que É commitado:
- Código fonte (`.tsx`, `.ts`, `.css`, etc.)
- Arquivos de configuração (`package.json`, `tsconfig.json`, etc.)
- Documentação (`.md`)

### ❌ O que NÃO é commitado (já está no `.gitignore`):
- `.env.local` (variáveis de ambiente locais)
- `node_modules/` (dependências)
- `.next/` (build do Next.js)

## 🔧 Se o Deploy Falhar

1. **Verifique os logs na Vercel:**
   - Vá em **Deployments** > Clique no deploy com erro
   - Veja os logs de build

2. **Erros comuns:**
   - Variáveis de ambiente faltando → Configure em **Settings** > **Environment Variables**
   - Erro de build → Verifique os logs
   - Token expirado → Atualize `META_ACCESS_TOKEN` na Vercel

3. **Fazer Redeploy:**
   - Vá em **Deployments**
   - Clique nos 3 pontos (⋯) do último deploy
   - Clique em **Redeploy**

## 📝 Exemplo Completo

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar tudo
git add .

# 3. Fazer commit com mensagem descritiva
git commit -m "feat: melhorias no envio de eventos Purchase
- Adicionado delay de 300ms antes do redirect
- Logs detalhados para debug
- Garantia de envio do evento no Pixel antes do redirect"

# 4. Fazer push
git push origin main

# 5. Aguardar deploy automático na Vercel (2-5 minutos)
```

## 🎯 Resumo

1. ✅ `git add .` - Adiciona arquivos
2. ✅ `git commit -m "mensagem"` - Cria commit
3. ✅ `git push origin main` - Envia para GitHub
4. ✅ Vercel faz deploy automático
5. ✅ Site atualizado em minutos!

## 🔗 Links Úteis

- **GitHub:** https://github.com/ghostkyle24/bonusmarmitas
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Site:** https://bonusmarmitas.vercel.app
- **Meta Events Manager:** https://business.facebook.com/events_manager2

