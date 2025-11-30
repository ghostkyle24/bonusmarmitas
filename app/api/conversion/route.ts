import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { isIPUsed, markIPAsUsed, isEmailUsed, markEmailAsUsed } from '@/lib/ip-control'

// Interface para os dados do evento
interface ConversionData {
  email: string
  firstName: string
  lastName: string
  phone: string
  gender?: string
  birthdate?: string
  country: string
  state?: string
  city?: string
}

// Função para obter IP do cliente
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Função para obter User Agent
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || ''
}

// Função para hash SHA256 (conforme especificação Meta)
// IMPORTANTE: Dados devem ser normalizados (lowercase, trim) antes do hash
function hashData(data: string): string {
  if (!data) return ''
  // Normalizar: lowercase, trim, remover espaços extras
  const normalized = data.toLowerCase().trim().replace(/\s+/g, ' ')
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

// Função para formatar data de nascimento (NÃO hashear - formato YYYYMMDD)
function formatBirthdate(birthdate: string): string {
  if (!birthdate) return ''
  
  // Tentar formato YYYY-MM-DD (com hífens)
  const partsDash = birthdate.split('-')
  if (partsDash.length === 3 && partsDash[0].length === 4) {
    // Formato YYYY-MM-DD
    return `${partsDash[0]}${partsDash[1]}${partsDash[2]}`
  }
  
  // Tentar formato DD/MM/YYYY (com barras)
  const partsSlash = birthdate.split('/')
  if (partsSlash.length === 3) {
    // Se o primeiro tem 2 dígitos, assume DD/MM/YYYY
    if (partsSlash[0].length <= 2 && partsSlash[2].length === 4) {
      // Formato DD/MM/YYYY -> converter para YYYYMMDD
      const day = partsSlash[0].padStart(2, '0')
      const month = partsSlash[1].padStart(2, '0')
      const year = partsSlash[2]
      return `${year}${month}${day}`
    }
    // Se o primeiro tem 4 dígitos, assume YYYY/MM/DD
    if (partsSlash[0].length === 4) {
      return `${partsSlash[0]}${partsSlash[1].padStart(2, '0')}${partsSlash[2].padStart(2, '0')}`
    }
  }
  
  // Tentar remover todos os separadores e verificar formato
  const cleaned = birthdate.replace(/[-\/]/g, '')
  if (cleaned.length === 8) {
    // Se começar com 4 dígitos, assume YYYYMMDD
    if (/^\d{4}/.test(cleaned)) {
      return cleaned
    }
    // Se terminar com 4 dígitos, assume DDMMYYYY -> converter para YYYYMMDD
    if (/\d{4}$/.test(cleaned)) {
      return cleaned.slice(4) + cleaned.slice(0, 4)
    }
  }
  
  // Fallback: remover separadores
  return birthdate.replace(/[-\/]/g, '')
}

// Função para formatar telefone (remover caracteres não numéricos antes de hashear)
function formatPhone(phone: string): string {
  if (!phone) return ''
  // Remover todos os caracteres não numéricos
  return phone.replace(/\D/g, '')
}

// Função para normalizar país (código ISO de 2 letras em lowercase - será hasheado)
function normalizeCountry(country: string): string {
  if (!country) return ''
  // Retornar código de 2 letras em lowercase (conforme documentação Meta)
  // A documentação requer: código ISO 3166-1 alpha-2 em lowercase antes de hashear
  return country.toLowerCase().substring(0, 2)
}

// Função para normalizar estado (sempre hashear - conforme documentação Meta)
function normalizeState(state: string): string {
  if (!state) return ''
  // Conforme documentação Meta: Hashing required
  // - Código ANSI de 2 caracteres em lowercase (ex: "az", "ca")
  // - Estados fora dos EUA: lowercase, sem pontuação, sem espaços
  // - SEMPRE hashear, mesmo códigos de 2 letras
  const cleaned = state.trim().toLowerCase()
  // Remover pontuação e espaços
  const normalized = cleaned.replace(/[^a-z0-9]/g, '')
  return normalized
}

// Função para normalizar gênero (opcional - pode enviar como 'm' ou 'f' ou hashear)
function normalizeGender(gender: string): string {
  if (!gender) return ''
  const normalized = gender.toLowerCase().trim()
  // Mapear para formato esperado
  if (normalized === 'm' || normalized === 'masculino' || normalized === 'male') {
    return 'm'
  }
  if (normalized === 'f' || normalized === 'feminino' || normalized === 'female') {
    return 'f'
  }
  // Para outros valores, hashear
  return hashData(gender)
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const userAgent = getUserAgent(request)
    
    // Verificar se este IP já fez uma submissão
    if (await isIPUsed(clientIP)) {
      return NextResponse.json(
        { error: 'Você já realizou o cadastro. Apenas uma submissão por IP é permitida.' },
        { status: 400 }
      )
    }

    const data: ConversionData = await request.json()

    // Validações básicas
    if (!data.email || !data.firstName || !data.lastName || !data.phone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    // Hash do email para verificação de duplicatas
    const emailHash = hashData(data.email)

    // Verificar se este email já foi usado (controle por pessoa)
    if (await isEmailUsed(emailHash)) {
      return NextResponse.json(
        { error: 'Este email já foi cadastrado. Apenas um cadastro por pessoa é permitido.' },
        { status: 400 }
      )
    }

    // Obter variáveis de ambiente
    // Pixel ID: 1923146491602931
    // Token: Configure em .env.local ou variáveis de ambiente da Vercel
    const pixelId = process.env.META_PIXEL_ID || '1923146491602931'
    const accessToken = process.env.META_ACCESS_TOKEN
    const testEventCode = process.env.META_TEST_EVENT_CODE

    if (!accessToken) {
      console.error('META_ACCESS_TOKEN não configurado')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Preparar dados do cliente conforme especificação Meta Conversions API
    // IMPORTANTE: Apenas dados pessoais identificáveis devem ser hasheados (SHA256)
    // A Meta aceita arrays para melhor matching (formato recomendado)
    console.log('📋 Dados recebidos do formulário:', JSON.stringify(data, null, 2))
    
    const phoneFormatted = formatPhone(data.phone)
    console.log('📞 Telefone formatado:', phoneFormatted)
    
    const customerData: any = {
      // Dados OBRIGATÓRIOS para matching (devem ser hasheados e em formato array)
      em: [hashData(data.email)], // Email - HASHEADO (SHA256) - formato array
      ph: [hashData(phoneFormatted)], // Telefone - HASHEADO (SHA256) - formato array
      fn: [hashData(data.firstName)], // Nome - HASHEADO (SHA256) - formato array
      ln: [hashData(data.lastName)], // Sobrenome - HASHEADO (SHA256) - formato array
    }
    
    console.log('👤 Dados do cliente preparados (sem opcionais):', {
      em: customerData.em[0].substring(0, 10) + '...',
      ph: customerData.ph[0].substring(0, 10) + '...',
      fn: customerData.fn[0].substring(0, 10) + '...',
      ln: customerData.ln[0].substring(0, 10) + '...',
    })

    // Adicionar dados opcionais se disponíveis e válidos
    // IMPORTANTE: Segundo a documentação Meta, estes campos REQUEREM hashing:
    // ge (gender), db (date of birth), st (state), country - todos requerem hash!
    if (data.gender && data.gender.trim()) {
      // Gênero: REQUER hashing (formato array)
      // Normalizar primeiro, depois hashear
      const genderValue = normalizeGender(data.gender)
      if (genderValue) {
        // Meta requer ge (não gd) e deve ser hasheado em array
        customerData.ge = [hashData(genderValue)]
      }
    }

    if (data.birthdate && data.birthdate.trim()) {
      // Data de nascimento: REQUER hashing (formato array)
      // Formato: YYYYMMDD antes de hashear
      const birthdateValue = formatBirthdate(data.birthdate)
      console.log('📅 Data de nascimento:', {
        original: data.birthdate,
        formatada: birthdateValue,
        valida: birthdateValue && birthdateValue.length === 8
      })
      if (birthdateValue && birthdateValue.length === 8) {
        // Meta requer db hasheado em array
        customerData.db = [hashData(birthdateValue)]
      } else {
        console.warn('⚠️ Data de nascimento inválida, não será enviada')
      }
    }

    if (data.city && data.city.trim()) {
      // Cidade: HASHEADO (SHA256) - formato array
      customerData.ct = [hashData(data.city)]
    }

    if (data.state && data.state.trim()) {
      // Estado: REQUER hashing (formato array)
      // Conforme documentação Meta: sempre hashear, mesmo códigos de 2 letras
      const stateValue = normalizeState(data.state)
      console.log('🗺️ Estado:', {
        original: data.state,
        normalizado: stateValue,
        tipo: stateValue.length === 2 ? 'código ANSI' : 'nome completo'
      })
      if (stateValue) {
        // Meta requer st hasheado em array (sempre, mesmo códigos)
        customerData.st = [hashData(stateValue)]
      }
    }

    if (data.country && data.country.trim()) {
      // País: REQUER hashing (formato array)
      // Mesmo códigos ISO devem ser hasheados
      const countryValue = normalizeCountry(data.country)
      if (countryValue) {
        // Meta requer country hasheado em array
        customerData.country = [hashData(countryValue)]
      }
    }

    // External ID (opcional - útil para matching adicional) - formato array
    if (data.email) {
      // Usar hash do email como external_id para melhor matching
      customerData.external_id = [hashData(data.email)]
    }

    // Gerar event_id único para deduplicação entre Pixel e Conversions API
    // IMPORTANTE: Este mesmo ID deve ser usado no Pixel client-side
    const eventId = crypto.randomUUID()
    
    // Obter URL de origem (melhorar detecção)
    const origin = request.headers.get('origin') || 
                   request.headers.get('referer') || 
                   'https://seu-site.com'
    
    // Preparar evento para Conversions API conforme especificação Meta
    const eventData: any = {
      data: [
        {
          // Nome do evento (Standard Event)
          event_name: 'Purchase',
          
          // Timestamp Unix (segundos desde 1970)
          event_time: Math.floor(Date.now() / 1000),
          
          // ID único para deduplicação (deve ser o mesmo no Pixel)
          event_id: eventId,
          
          // URL de origem do evento
          event_source_url: origin,
          
          // Fonte da ação (website, app, phone_call, etc)
          action_source: 'website',
          
          // Dados do usuário (alguns hasheados, outros não)
          user_data: {
            ...customerData,
            // Dados que NÃO devem ser hasheados:
            client_ip_address: clientIP, // IP do cliente (NÃO hashear)
            client_user_agent: userAgent, // User Agent (NÃO hashear)
            fbp: request.cookies.get('_fbp')?.value || '', // Facebook Browser ID (NÃO hashear)
            fbc: request.cookies.get('_fbc')?.value || '', // Facebook Click ID (NÃO hashear)
          },
          
          // Dados customizados do evento
          custom_data: {
            currency: 'BRL',
            value: 9.90, // Valor numérico (não string)
            // Adicionar mais dados se necessário para otimização
            content_name: 'Receitas Exclusivas',
            content_category: 'Digital Product',
          },
          
          // Adicionar test_event_code se estiver em modo de teste
          ...(testEventCode && { test_event_code: testEventCode }),
        },
      ],
      access_token: accessToken,
      pixel_id: pixelId,
    }
    
    console.log('📤 Evento preparado para Meta:', JSON.stringify({
      ...eventData,
      access_token: '***OCULTO***',
      data: eventData.data.map((d: any) => ({
        ...d,
        user_data: {
          ...d.user_data,
          em: d.user_data.em ? ['***HASH***'] : undefined,
          ph: d.user_data.ph ? ['***HASH***'] : undefined,
          fn: d.user_data.fn ? ['***HASH***'] : undefined,
          ln: d.user_data.ln ? ['***HASH***'] : undefined,
          ct: d.user_data.ct ? ['***HASH***'] : undefined,
          st: d.user_data.st ? ['***HASH***'] : undefined,
          db: d.user_data.db ? ['***HASH***'] : undefined,
          ge: d.user_data.ge ? ['***HASH***'] : undefined,
          country: d.user_data.country ? ['***HASH***'] : undefined,
          external_id: d.user_data.external_id ? ['***HASH***'] : undefined,
        }
      }))
    }, null, 2))

    // Enviar para Meta Conversions API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    )

    const metaData = await metaResponse.json()
    
    console.log('📥 Resposta da Meta API:', {
      status: metaResponse.status,
      statusText: metaResponse.statusText,
      ok: metaResponse.ok,
      response: metaData,
    })

    if (!metaResponse.ok) {
      console.error('❌ Erro na Meta Conversions API:', {
        status: metaResponse.status,
        statusText: metaResponse.statusText,
        response: metaData,
        pixelId,
        hasToken: !!accessToken,
        errorDetails: metaData.error,
      })
      
      // Extrair mensagem de erro mais amigável
      let errorMessage = 'Erro ao enviar evento para Meta'
      if (metaData.error) {
        if (metaData.error.message) {
          errorMessage = metaData.error.message
        } else if (typeof metaData.error === 'string') {
          errorMessage = metaData.error
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: metaData,
          code: metaData.error?.code,
          type: metaData.error?.type,
        },
        { status: 500 }
      )
    }

    // Marcar IP e Email como usados (controle de duplicatas)
    await markIPAsUsed(clientIP)
    await markEmailAsUsed(emailHash)

    console.log('✅ Evento Purchase enviado com sucesso para Meta Conversions API:', {
      event_id: eventId,
      events_received: metaData.events_received || 0,
      events_dropped: metaData.events_dropped || 0,
      messages: metaData.messages || [],
    })

    // Retornar sucesso com event_id para uso no Pixel (deduplicação)
    return NextResponse.json({
      success: true,
      message: 'Evento Purchase enviado com sucesso para Meta Conversions API',
      event_id: eventId, // Importante: retornar para usar no Pixel
      meta_response: metaData,
      events_received: metaData.events_received || 0,
      events_dropped: metaData.events_dropped || 0,
    })
  } catch (error: any) {
    console.error('Erro ao processar conversão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

