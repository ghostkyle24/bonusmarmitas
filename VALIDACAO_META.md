# ✅ Validação e Conformidade com Meta Conversions API

## 🔒 Dados Hasheados (SHA256) - Conforme Especificação Meta

### ✅ Dados que DEVEM ser hasheados:

1. **Email (em)** - ✅ HASHEADO
   - Normalizado: lowercase, trim, espaços normalizados
   - Hash: SHA256

2. **Telefone (ph)** - ✅ HASHEADO
   - Normalizado: apenas números (removidos caracteres especiais)
   - Hash: SHA256

3. **Nome (fn)** - ✅ HASHEADO
   - Normalizado: lowercase, trim, espaços normalizados
   - Hash: SHA256

4. **Sobrenome (ln)** - ✅ HASHEADO
   - Normalizado: lowercase, trim, espaços normalizados
   - Hash: SHA256

5. **Cidade (ct)** - ✅ HASHEADO
   - Normalizado: lowercase, trim, espaços normalizados
   - Hash: SHA256

6. **Estado (st)** - ✅ HASHEADO (se não for código de 2 letras)
   - Se for código de 2 letras (ex: "SP"), enviado sem hash
   - Se for nome completo (ex: "São Paulo"), hasheado SHA256

7. **External ID (external_id)** - ✅ HASHEADO
   - Usa hash do email para melhor matching
   - Hash: SHA256

### ❌ Dados que NÃO devem ser hasheados:

1. **IP do Cliente (client_ip_address)** - ✅ NÃO HASHEADO
   - Enviado em texto plano (conforme especificação Meta)

2. **User Agent (client_user_agent)** - ✅ NÃO HASHEADO
   - Enviado em texto plano (conforme especificação Meta)

3. **Facebook Browser ID (fbp)** - ✅ NÃO HASHEADO
   - Cookie `_fbp` enviado em texto plano

4. **Facebook Click ID (fbc)** - ✅ NÃO HASHEADO
   - Cookie `_fbc` enviado em texto plano

5. **País (country)** - ✅ NÃO HASHEADO
   - Código ISO de 2 letras (ex: "BR", "US")
   - Enviado em maiúsculas

6. **Data de Nascimento (db)** - ✅ NÃO HASHEADO
   - Formato: YYYYMMDD (ex: "19900115")
   - Enviado sem hífens

7. **Gênero (gd)** - ✅ NÃO HASHEADO (normalizado)
   - Valores: "m" ou "f"
   - Normalizado automaticamente

## 📊 Estrutura do Evento Purchase

### Parâmetros Obrigatórios:
- ✅ `event_name`: "Purchase"
- ✅ `event_time`: Timestamp Unix (segundos)
- ✅ `event_id`: UUID único (para deduplicação)
- ✅ `event_source_url`: URL de origem
- ✅ `action_source`: "website"
- ✅ `user_data`: Objeto com dados do usuário
- ✅ `custom_data`: Objeto com dados do evento (valor, moeda)

### Dados Customizados (custom_data):
- ✅ `currency`: "BRL"
- ✅ `value`: 9.90
- ✅ `content_name`: "Receitas Exclusivas"
- ✅ `content_category`: "Digital Product"

## 🔄 Deduplicação de Eventos

### Implementação Correta:
1. **Server-side (Conversions API)**:
   - Gera `event_id` único (UUID)
   - Envia evento para Meta Conversions API
   - Retorna `event_id` na resposta

2. **Client-side (Meta Pixel)**:
   - Recebe `event_id` do servidor
   - Dispara evento Purchase no Pixel com o **mesmo** `event_id`
   - Meta deduplica automaticamente usando o `event_id`

### Código de Deduplicação:
```typescript
// Server-side
const eventId = crypto.randomUUID()
// ... envia para Conversions API com event_id

// Client-side
window.fbq('track', 'Purchase', {
  value: 9.90,
  currency: 'BRL',
  eventID: data.event_id // MESMO ID do servidor
})
```

## ✅ Garantias de Otimização do Pixel

### 1. Dados Completos para Matching:
- ✅ Email hasheado
- ✅ Telefone hasheado
- ✅ Nome e sobrenome hasheados
- ✅ IP do cliente
- ✅ User Agent
- ✅ Cookies fbp e fbc (quando disponíveis)
- ✅ External ID (hash do email)

### 2. Qualidade dos Dados:
- ✅ Normalização correta (lowercase, trim)
- ✅ Formatação adequada (telefone apenas números)
- ✅ Validação de campos obrigatórios
- ✅ Tratamento de dados opcionais

### 3. Eventos Enviados Corretamente:
- ✅ Evento Purchase com valor correto (R$ 9,90)
- ✅ Moeda correta (BRL)
- ✅ Timestamp correto (Unix)
- ✅ URL de origem correta
- ✅ Fonte da ação correta (website)

### 4. Controle de Duplicatas:
- ✅ Controle de IP (uma submissão por IP)
- ✅ Deduplicação Pixel + Conversions API (mesmo event_id)
- ✅ Validação de campos obrigatórios

## 🧪 Como Verificar se Está Funcionando

### 1. Meta Events Manager:
- Acesse: https://business.facebook.com/events_manager2
- Selecione seu Pixel (ID: 1923146491602931)
- Vá em **Test Events** para ver eventos em tempo real
- Verifique se o evento Purchase aparece

### 2. Verificar Dados Hasheados:
- No Events Manager, clique no evento
- Verifique se os dados estão hasheados (em, ph, fn, ln, ct)
- Verifique se IP e User Agent estão em texto plano

### 3. Verificar Deduplicação:
- Preencha o formulário
- Verifique no Events Manager se aparece apenas 1 evento
- Se aparecer 2 eventos (Pixel + Conversions API), a deduplicação não está funcionando

### 4. Test Event Code:
- Use `META_TEST_EVENT_CODE` para testar sem afetar dados reais
- Eventos aparecerão como "Test Events" no Events Manager

## 📋 Checklist de Conformidade

- [x] Email hasheado (SHA256)
- [x] Telefone hasheado (SHA256)
- [x] Nome hasheado (SHA256)
- [x] Sobrenome hasheado (SHA256)
- [x] Cidade hasheada (SHA256)
- [x] Estado hasheado ou código (conforme necessário)
- [x] País não hasheado (código ISO)
- [x] Data de nascimento não hasheada (formato YYYYMMDD)
- [x] IP não hasheado
- [x] User Agent não hasheado
- [x] fbp e fbc não hasheados
- [x] Event ID único para deduplicação
- [x] Evento Purchase com valor correto
- [x] Moeda BRL
- [x] Timestamp correto
- [x] URL de origem correta
- [x] Controle de IP implementado
- [x] Deduplicação Pixel + Conversions API

## 🎯 Resultado Esperado

Com essas implementações, seu pixel será **otimizado** porque:

1. **Matching Melhorado**: Mais dados para corresponder eventos a usuários
2. **Qualidade dos Dados**: Dados normalizados e formatados corretamente
3. **Sem Duplicatas**: Eventos deduplicados corretamente
4. **Dados Completos**: Todos os parâmetros enviados conforme especificação
5. **Conformidade Total**: Todos os dados sensíveis hasheados corretamente

## ⚠️ Importante

- **Nunca** envie dados pessoais sem hash (exceto IP, User Agent, fbp, fbc)
- **Sempre** use o mesmo `event_id` no Pixel e Conversions API
- **Sempre** normalize dados antes de hashear (lowercase, trim)
- **Sempre** valide campos obrigatórios antes de enviar

