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

6. **Estado (st)** - ✅ HASHEADO
   - **Hashing required** conforme documentação oficial Meta
   - Usar código ANSI de 2 caracteres em lowercase (ex: "az", "ca")
   - Estados fora dos EUA: lowercase, sem pontuação, sem espaços
   - Hash: SHA256

7. **Data de Nascimento (db)** - ✅ HASHEADO
   - **Hashing required** conforme documentação oficial Meta
   - Formato: YYYYMMDD (ex: "19970216")
   - Hash: SHA256

8. **Gênero (ge)** - ✅ HASHEADO
   - **Hashing required** conforme documentação oficial Meta
   - Valores normalizados: "m" (male) ou "f" (female) em lowercase
   - Hash: SHA256

9. **País (country)** - ✅ HASHEADO
   - **Hashing required** conforme documentação oficial Meta
   - Código ISO 3166-1 alpha-2 em lowercase (ex: "br", "us")
   - Hash: SHA256

10. **External ID (external_id)** - ✅ HASHEADO (recomendado)
    - Usa hash do email para melhor matching
    - Hash: SHA256

### ❌ Dados que NÃO devem ser hasheados (Do not hash):

1. **IP do Cliente (client_ip_address)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - Enviado em texto plano (IPv4 ou IPv6)
   - Exemplo: `168.212.226.204` ou `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

2. **User Agent (client_user_agent)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - Enviado em texto plano
   - Exemplo: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...`

3. **Facebook Browser ID (fbp)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - Cookie `_fbp` enviado em texto plano
   - Formato: `fb.${subdomain_index}.${creation_time}.${random_number}`
   - Exemplo: `fb.1.1596403881668.1116446470`

4. **Facebook Click ID (fbc)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - Cookie `_fbc` enviado em texto plano
   - Formato: `fb.${subdomain_index}.${creation_time}.${fbclid}`
   - Exemplo: `fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`

5. **Subscription ID (subscription_id)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - ID de assinatura do usuário na transação

6. **Facebook Login ID (fb_login_id)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - ID emitido pela Meta quando pessoa faz login no app (App-Scoped ID)

7. **Lead ID (lead_id)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - ID associado a lead gerado por Meta Lead Ads

8. **Anon ID (anon_id)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - ID de instalação único (apenas para eventos de app)

9. **Page ID (page_id)** - ✅ NÃO HASHEADO
   - **Do not hash** - conforme documentação oficial Meta
   - ID da página do Facebook associada ao evento

10. **Page Scoped User ID (page_scoped_user_id)** - ✅ NÃO HASHEADO
    - **Do not hash** - conforme documentação oficial Meta
    - ID de usuário com escopo de página associado ao bot do messenger

11. **CTWA Click ID (ctwa_clid)** - ✅ NÃO HASHEADO
    - **Do not hash** - conforme documentação oficial Meta
    - Click ID gerado pela Meta para anúncios que clicam no WhatsApp

12. **Instagram Account ID (ig_account_id)** - ✅ NÃO HASHEADO
    - **Do not hash** - conforme documentação oficial Meta
    - ID da conta do Instagram associada ao negócio

13. **Instagram SID (ig_sid)** - ✅ NÃO HASHEADO
    - **Do not hash** - conforme documentação oficial Meta
    - Instagram-Scoped User ID (IGSID) de usuários que interagem com Instagram

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

### Dados Hasheados (Hashing Required):
- [x] Email (em) hasheado (SHA256)
- [x] Telefone (ph) hasheado (SHA256)
- [x] Nome (fn) hasheado (SHA256)
- [x] Sobrenome (ln) hasheado (SHA256)
- [x] Cidade (ct) hasheada (SHA256)
- [x] Estado (st) hasheado (SHA256)
- [x] País (country) hasheado (SHA256) - código ISO lowercase
- [x] Data de nascimento (db) hasheada (SHA256) - formato YYYYMMDD
- [x] Gênero (ge) hasheado (SHA256) - valores "m" ou "f"
- [x] External ID (external_id) hasheado (SHA256) - recomendado

### Dados NÃO Hasheados (Do not hash):
- [x] IP do cliente (client_ip_address) - texto plano
- [x] User Agent (client_user_agent) - texto plano
- [x] Facebook Browser ID (fbp) - texto plano
- [x] Facebook Click ID (fbc) - texto plano

### Evento e Configuração:
- [x] Event ID único para deduplicação
- [x] Evento Purchase com valor correto (9.90)
- [x] Moeda BRL
- [x] Timestamp correto (Unix)
- [x] URL de origem correta
- [x] Action source: "website"
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

### Regras de Hashing:
- **SEMPRE hashear**: em, ph, fn, ln, ct, st, db, ge, country, external_id
- **NUNCA hashear**: client_ip_address, client_user_agent, fbp, fbc, subscription_id, fb_login_id, lead_id, anon_id, page_id, page_scoped_user_id, ctwa_clid, ig_account_id, ig_sid
- **Sempre** normalize dados antes de hashear (lowercase, trim, remover caracteres especiais)
- **Sempre** use o mesmo `event_id` no Pixel e Conversions API para deduplicação
- **Sempre** valide campos obrigatórios antes de enviar

### Referência Oficial:
📖 Documentação completa: [Meta Conversions API - Customer Information Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters)

