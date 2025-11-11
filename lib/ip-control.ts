// Sistema de controle de IP e Email para evitar duplicatas
// Suporta Vercel KV (produção) ou armazenamento em memória (desenvolvimento)

// Armazenamento em memória para desenvolvimento
const memoryStore = new Map<string, number>()
const emailStore = new Map<string, number>() // Armazenamento de emails

// Limpar IPs/emails antigos (mais de 24 horas)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000 // 24 horas em ms

// Função para limpar IPs/emails antigos (chamada sob demanda)
function cleanupOldEntries() {
  const now = Date.now()
  for (const [key, timestamp] of memoryStore.entries()) {
    if (now - timestamp > CLEANUP_INTERVAL) {
      memoryStore.delete(key)
    }
  }
  for (const [key, timestamp] of emailStore.entries()) {
    if (now - timestamp > CLEANUP_INTERVAL) {
      emailStore.delete(key)
    }
  }
}

/**
 * Verifica se um IP já foi usado
 */
export async function isIPUsed(ip: string): Promise<boolean> {
  // Tentar usar Vercel KV se disponível
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const kv = await import('@vercel/kv')
      const key = `ip:${ip}`
      const exists = await kv.default.exists(key)
      return exists === 1
    } catch (error) {
      console.warn('Erro ao acessar Vercel KV, usando memória:', error)
    }
  }

  // Fallback para armazenamento em memória
  cleanupOldEntries() // Limpar entradas antigas antes de verificar
  return memoryStore.has(ip)
}

/**
 * Marca um IP como usado
 */
export async function markIPAsUsed(ip: string): Promise<void> {
  // Tentar usar Vercel KV se disponível
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const kv = await import('@vercel/kv')
      const key = `ip:${ip}`
      // Armazenar por 24 horas
      await kv.default.setex(key, 86400, Date.now().toString())
      return
    } catch (error) {
      console.warn('Erro ao salvar no Vercel KV, usando memória:', error)
    }
  }

  // Fallback para armazenamento em memória
  cleanupOldEntries() // Limpar entradas antigas antes de adicionar
  memoryStore.set(ip, Date.now())
}

/**
 * Verifica se um email (hasheado) já foi usado
 */
export async function isEmailUsed(emailHash: string): Promise<boolean> {
  // Tentar usar Vercel KV se disponível
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const kv = await import('@vercel/kv')
      const key = `email:${emailHash}`
      const exists = await kv.default.exists(key)
      return exists === 1
    } catch (error) {
      console.warn('Erro ao acessar Vercel KV, usando memória:', error)
    }
  }

  // Fallback para armazenamento em memória
  cleanupOldEntries() // Limpar entradas antigas antes de verificar
  return emailStore.has(emailHash)
}

/**
 * Marca um email (hasheado) como usado
 */
export async function markEmailAsUsed(emailHash: string): Promise<void> {
  // Tentar usar Vercel KV se disponível
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const kv = await import('@vercel/kv')
      const key = `email:${emailHash}`
      // Armazenar por 24 horas
      await kv.default.setex(key, 86400, Date.now().toString())
      return
    } catch (error) {
      console.warn('Erro ao salvar no Vercel KV, usando memória:', error)
    }
  }

  // Fallback para armazenamento em memória
  cleanupOldEntries() // Limpar entradas antigas antes de adicionar
  emailStore.set(emailHash, Date.now())
}

