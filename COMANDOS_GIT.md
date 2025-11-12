# 📦 Comandos Git - Subir para GitHub

## 🔄 Remover Git Existente (se necessário)

Se você já fez `git init` para outro repositório e quer começar do zero:

### Windows (PowerShell):
```powershell
# Verificar se existe repositório Git
git status

# Se existir, remover a pasta .git (isso remove TODA a configuração do Git)
Remove-Item -Recurse -Force .git

# Verificar se foi removido
git status  # Deve dar erro "not a git repository"
```

### Linux/Mac:
```bash
# Verificar se existe repositório Git
git status

# Se existir, remover a pasta .git
rm -rf .git

# Verificar se foi removido
git status  # Deve dar erro "not a git repository"
```

**⚠️ Atenção:** Isso remove TODA a história do Git. Use apenas se quiser começar do zero!

## 🚀 Comandos Rápidos

### 1. Inicializar Git (primeira vez ou após remover)

```bash
git init
git add .
git commit -m "Initial commit - API Conversões Receitas com Meta Pixel"
```

### 2. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `api-conversoes-receitas` (ou outro)
3. **NÃO** marque "Add README" (já temos)
4. Clique em **Create repository**

### 3. Conectar e Fazer Push

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## ✅ Verificar o que será commitado

```bash
git status
```

Você deve ver apenas arquivos do projeto (sem `.env.local` ou `node_modules`)

## 📋 Arquivos que NÃO serão commitados (seguro!)

- ✅ `.env.local` (token não vai para o GitHub)
- ✅ `node_modules/`
- ✅ `.next/`
- ✅ `.vercel/`

## 🔄 Atualizações Futuras

```bash
git add .
git commit -m "Descrição da alteração"
git push
```

## ⚠️ Importante

- **NUNCA** commite arquivos `.env` ou `.env.local`
- O token deve ser configurado apenas na **Vercel** (variáveis de ambiente)
- O `.gitignore` já está configurado corretamente

