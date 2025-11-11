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
  // Formato esperado pela Meta: YYYYMMDD (sem hífens)
  const parts = birthdate.split('-')
  if (parts.length === 3) {
    return `${parts[0]}${parts[1]}${parts[2]}`
  }
  return birthdate.replace(/-/g, '')
}

// Função para formatar telefone (remover caracteres não numéricos antes de hashear)
function formatPhone(phone: string): string {
  if (!phone) return ''
  // Remover todos os caracteres não numéricos
  return phone.replace(/\D/g, '')
}

// Função para normalizar país (código ISO de 2 letras, NÃO hashear)
function normalizeCountry(country: string): string {
  if (!country) return ''
  // Retornar código de 2 letras em maiúsculas
  return country.toUpperCase().substring(0, 2)
}

// Função para normalizar estado (pode ser código de 2 letras ou hashear)
function normalizeState(state: string): string {
  if (!state) return ''
  // Se for código de 2 letras, retornar em maiúsculas
  // Caso contrário, hashear
  const cleaned = state.trim().toUpperCase()
  if (cleaned.length === 2) {
    return cleaned
  }
  // Se não for código de 2 letras, hashear
  return hashData(state)
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
    const customerData: any = {
      // Dados OBRIGATÓRIOS para matching (devem ser hasheados e em formato array)
      em: [hashData(data.email)], // Email - HASHEADO (SHA256) - formato array
      ph: [hashData(formatPhone(data.phone))], // Telefone - HASHEADO (SHA256) - formato array
      fn: [hashData(data.firstName)], // Nome - HASHEADO (SHA256) - formato array
      ln: [hashData(data.lastName)], // Sobrenome - HASHEADO (SHA256) - formato array
    }

    // Adicionar dados opcionais se disponíveis
    if (data.gender) {
      // Gênero: pode ser 'm' ou 'f' (não precisa hash, mas vamos normalizar)
      customerData.gd = normalizeGender(data.gender)
    }

    if (data.birthdate) {
      // Data de nascimento: formato YYYYMMDD (NÃO hashear)
      customerData.db = formatBirthdate(data.birthdate)
    }

    if (data.city) {
      // Cidade: HASHEADO (SHA256) - formato array
      customerData.ct = [hashData(data.city)]
    }

    if (data.state) {
      // Estado: código de 2 letras ou hasheado - formato array se hasheado
      const stateValue = normalizeState(data.state)
      customerData.st = stateValue.length === 2 ? stateValue : [stateValue]
    }

    if (data.country) {
      // País: código ISO de 2 letras (NÃO hashear)
      customerData.country = normalizeCountry(data.country)
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
    const eventData = {
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
        },
      ],
      access_token: accessToken,
      pixel_id: pixelId,
    }

    // Adicionar test_event_code se estiver em modo de teste
    if (testEventCode) {
      eventData.data[0].test_event_code = testEventCode
    }

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

    if (!metaResponse.ok) {
      console.error('Erro na Meta Conversions API:', metaData)
      return NextResponse.json(
        { error: 'Erro ao enviar evento para Meta', details: metaData },
        { status: 500 }
      )
    }

    // Marcar IP e Email como usados (controle de duplicatas)
    await markIPAsUsed(clientIP)
    await markEmailAsUsed(emailHash)

    // Retornar sucesso com event_id para uso no Pixel (deduplicação)
    return NextResponse.json({
      success: true,
      message: 'Evento enviado com sucesso',
      event_id: eventId, // Importante: retornar para usar no Pixel
      meta_response: metaData,
      events_received: metaData.events_received || 0,
    })
  } catch (error: any) {
    console.error('Erro ao processar conversão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

