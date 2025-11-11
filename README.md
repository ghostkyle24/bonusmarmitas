# API Conversões Receitas - Meta Conversions API

Projeto Next.js para captura de leads com integração completa com Meta Conversions API.

## 🚀 Funcionalidades

- ✅ Formulário completo com validação
- ✅ Integração com Meta Pixel (client-side)
- ✅ Integração com Meta Conversions API (server-side)
- ✅ Controle de IP para evitar duplicatas
- ✅ Envio de evento Purchase (R$ 9,90)
- ✅ Envio de todos os dados do cliente para otimização
- ✅ Página de sucesso com download

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Meta Business com Pixel configurado
- Access Token da Meta Conversions API

## 🔧 Configuração

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
META_PIXEL_ID=1923146491602931
META_ACCESS_TOKEN=EAALfoaF9C9UBP8jZBr8Dn3MVB1a5VVmiBPv9rgLxic3V2ZBlXCdPAikulkcDp33uKoZCLk7ZCAGOaHEBQsXYaAzMlsqsLBilRd4CtmqZCZAgEvL23sCLfTFoh2MRLcE70zfZAnbkby7qPgQ0bgftz8WrrDCCnuRUtlnTCt56RC72X9JdBsFvCylEx6Ydhwq8wZDZD
META_TEST_EVENT_CODE=

# Vercel KV (opcional - para controle de IP em produção)
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```

> 📄 **Veja `CONFIGURACAO_TOKEN.md` para instruções detalhadas de configuração**

### ⚠️ Importante sobre o Token:

- O token fornecido já está configurado acima
- **NUNCA** commite o arquivo `.env.local` no Git (já está no `.gitignore`)
- Se o token expirar, gere um novo no Meta Business Manager
- Para produção na Vercel, adicione o token nas variáveis de ambiente do projeto

## 🎯 Parâmetros Enviados

### Evento Purchase:
- **Nome do evento**: Purchase
- **Valor**: R$ 9,90
- **Moeda**: BRL
- **Hora do evento**: Timestamp Unix atual
- **URL de origem**: URL da página
- **Fonte da ação**: website
- **ID do evento**: UUID único (para deduplicação)

### Dados do Cliente:

#### ✅ Hasheados (SHA256) - Conforme Especificação Meta:
- **Email** (em) - Hasheado SHA256
- **Telefone** (ph) - Hasheado SHA256 (apenas números)
- **Nome** (fn) - Hasheado SHA256
- **Sobrenome** (ln) - Hasheado SHA256
- **Cidade** (ct) - Hasheado SHA256
- **Estado** (st) - Hasheado SHA256 (ou código de 2 letras)
- **External ID** - Hasheado SHA256 (hash do email)

#### ❌ NÃO Hasheados (Conforme Especificação Meta):
- **IP do cliente** (client_ip_address) - Texto plano
- **User Agent** (client_user_agent) - Texto plano
- **Facebook Browser ID** (fbp) - Cookie em texto plano
- **Facebook Click ID** (fbc) - Cookie em texto plano
- **País** (country) - Código ISO de 2 letras (ex: "BR")
- **Data de nascimento** (db) - Formato YYYYMMDD
- **Gênero** (gd) - "m" ou "f" (normalizado)

### 🔄 Deduplicação:
- **Event ID único** usado tanto no Pixel quanto na Conversions API
- Meta deduplica automaticamente eventos duplicados
- Garante que cada conversão seja contada apenas uma vez

## 🚀 Deploy na Vercel

1. **Conecte seu repositório:**
   - Faça push do código para GitHub/GitLab
   - Conecte na Vercel

2. **Configure as variáveis de ambiente:**
   - Vá em **Settings** > **Environment Variables**
   - Adicione:
     - `META_PIXEL_ID`
     - `META_ACCESS_TOKEN`
     - `META_TEST_EVENT_CODE` (opcional)
     - `KV_REST_API_URL` e `KV_REST_API_TOKEN` (opcional, para controle de IP em produção)

3. **Configurar Vercel KV (Recomendado para produção):**
   - No dashboard da Vercel, vá em **Storage** > **Create Database** > **KV**
   - Após criar, copie as credenciais e adicione como variáveis de ambiente
   - Isso garante que o controle de IP funcione corretamente em produção

4. **Deploy:**
   - A Vercel fará o deploy automaticamente

## 📝 Notas Importantes

### 🔒 Conformidade com Meta Conversions API:
- ✅ **Todos os dados sensíveis são hasheados** (SHA256) conforme especificação Meta
- ✅ **Dados não sensíveis não são hasheados** (IP, User Agent, fbp, fbc)
- ✅ **Deduplicação implementada** (mesmo event_id no Pixel e Conversions API)
- ✅ **Normalização correta** (lowercase, trim antes de hashear)
- 📄 Veja `VALIDACAO_META.md` para detalhes completos de conformidade

### Controle de IP:
- **Desenvolvimento**: Usa armazenamento em memória (funciona localmente)
- **Produção**: Recomenda-se usar **Vercel KV** (já configurado no código)
  - O sistema detecta automaticamente se Vercel KV está disponível
  - Se não estiver configurado, usa memória como fallback
  - IPs são armazenados por 24 horas

### Testes:
- Use `META_TEST_EVENT_CODE` para testar sem afetar dados reais
- Remova ou deixe vazio em produção
- Verifique eventos no Meta Events Manager em tempo real

### Segurança:
- Todos os dados pessoais são hasheados (SHA256) antes de enviar
- IP e User Agent são enviados sem hash (conforme especificação Meta)

## 🔍 Verificação

Após o deploy, verifique se os eventos estão chegando:

1. **Meta Events Manager:**
   - Acesse [Events Manager](https://business.facebook.com/events_manager2)
   - Selecione seu Pixel
   - Verifique eventos em tempo real

2. **Test Event Tool:**
   - Use o Test Event Code para verificar eventos de teste

## 📦 Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── conversion/
│   │       └── route.ts      # API route para Conversions API
│   ├── sucesso/
│   │   └── page.tsx          # Página de sucesso
│   ├── layout.tsx             # Layout com Meta Pixel
│   ├── page.tsx               # Página principal (formulário)
│   └── globals.css            # Estilos globais
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🛠️ Desenvolvimento

```bash
# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção local
npm start
```

## 📄 Licença

MIT

