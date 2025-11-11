'use client'

import { useSearchParams } from 'next/navigation'

export default function Sucesso() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const handleWhatsApp = () => {
    // Número do WhatsApp: 31 91001-6904
    const phoneNumber = '5531910016904' // Formato internacional sem espaços e caracteres especiais
    const message = encodeURIComponent('Quero acesso ao bônus Marmitas fitness')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="container success-container">
      <div className="success-icon">🎉</div>
      <h1 className="success-title">Parabéns!</h1>
      <p className="success-message">
        Você ganhou acesso ao curso de <strong>Marmitas Fitness</strong>!
        <br />
        <br />
        Clique no botão abaixo para receber seu bônus no WhatsApp.
      </p>
      <button
        className="whatsapp-button"
        onClick={handleWhatsApp}
      >
        <span className="whatsapp-icon">💬</span>
        Falar no WhatsApp
      </button>
    </div>
  )
}

