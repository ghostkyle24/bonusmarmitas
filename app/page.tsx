'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    fbq: any
  }
}

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    birthdate: '',
    country: 'BR',
    state: '',
    city: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Log dos dados que serão enviados
      console.log('📤 [1/3] Enviando dados do formulário para Conversions API:', formData)
      
      // PASSO 1: Enviar evento Purchase para Meta Conversions API (server-side)
      const response = await fetch('/api/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('📥 [1/3] Status da resposta da Conversions API:', response.status, response.statusText)
      
      const data = await response.json()
      console.log('📥 [1/3] Resposta completa da Conversions API:', data)

      if (!response.ok) {
        // Mostrar erro mais detalhado se disponível
        let errorMsg = data.error || 'Erro ao processar formulário'
        if (data.details?.error?.message) {
          errorMsg = `${errorMsg}: ${data.details.error.message}`
        }
        console.error('❌ Erro na resposta:', {
          error: errorMsg,
          details: data.details,
          code: data.code,
          type: data.type,
        })
        throw new Error(errorMsg)
      }

      // PASSO 2: Disparar evento Purchase no Pixel (client-side) com o MESMO event_id
      // Isso garante deduplicação correta entre Pixel e Conversions API
      // O evento Purchase deve ser disparado ANTES do redirecionamento
      console.log('🎯 [2/3] Preparando para disparar evento Purchase no Pixel...')
      
      if (typeof window !== 'undefined' && window.fbq) {
        const purchaseData = {
          value: 9.90,
          currency: 'BRL',
          eventID: data.event_id, // Usar o mesmo event_id do servidor para deduplicação
        }
        
        console.log('🎯 [2/3] Disparando evento Purchase no Pixel:', purchaseData)
        
        // Disparar evento Purchase no Pixel
        window.fbq('track', 'Purchase', purchaseData)
        
        console.log('✅ [2/3] Evento Purchase disparado no Pixel com sucesso')
        console.log('📊 [2/3] Event ID usado para deduplicação:', data.event_id)
        
        // Aguardar um pequeno delay para garantir que o Pixel tenha tempo de enviar o evento
        // antes do redirecionamento (300ms é suficiente para a maioria dos casos)
        console.log('⏳ [2/3] Aguardando 300ms para garantir envio do Pixel...')
        await new Promise(resolve => setTimeout(resolve, 300))
        console.log('✅ [2/3] Delay concluído, Pixel teve tempo de enviar o evento')
      } else {
        console.warn('⚠️ [2/3] Meta Pixel (fbq) não está disponível - evento não será disparado no client-side')
        console.warn('⚠️ [2/3] Apenas o evento da Conversions API será enviado')
      }

      // PASSO 3: Redirecionar para página de sucesso APÓS disparar ambos os eventos
      console.log('🔄 [3/3] Redirecionando para página de sucesso...')
      router.push(`/sucesso?email=${encodeURIComponent(formData.email)}`)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🍰 Receitas Exclusivas</h1>
      <p className="subtitle">Preencha seus dados abaixo para acessar o conteúdo exclusivo</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seu@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">Nome *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Seu nome"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Sobrenome *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Seu sobrenome"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gênero</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="m">Masculino</option>
            <option value="f">Feminino</option>
            <option value="o">Outro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="birthdate">Data de Nascimento</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">País *</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="BR">Brasil</option>
            <option value="US">Estados Unidos</option>
            <option value="PT">Portugal</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="state">Estado</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="São Paulo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Cidade</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="São Paulo"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading && <span className="loading"></span>}
          {loading ? 'Processando...' : 'Acessar Receitas'}
        </button>
      </form>
    </div>
  )
}

