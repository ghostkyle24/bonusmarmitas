#!/bin/bash

# Script de teste para API de Conversões
# Use: ./test-api.sh

echo "🧪 Testando API de Conversões..."
echo ""

# URL da API (ajuste conforme necessário)
API_URL="http://localhost:3000/api/conversion"

# Dados de teste
DATA='{
  "email": "teste@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "phone": "(11) 99999-9999",
  "gender": "m",
  "birthdate": "1990-01-15",
  "country": "BR",
  "state": "SP",
  "city": "São Paulo"
}'

echo "📤 Enviando requisição para: $API_URL"
echo "📋 Dados de teste:"
echo "$DATA" | jq '.' 2>/dev/null || echo "$DATA"
echo ""
echo "⏳ Aguardando resposta..."
echo ""

# Fazer a requisição
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -d "$DATA")

# Separar corpo da resposta e código HTTP
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 Status HTTP: $HTTP_CODE"
echo ""
echo "📥 Resposta:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Sucesso! Evento enviado para Meta."
else
  echo "❌ Erro! Verifique a resposta acima."
fi

