/**
 * Utilidades para realizar llamadas a la API de Moffin
 * Centraliza la lógica común de autenticación y manejo de errores
 */

interface MoffinApiConfig {
  apiUrl: string
  apiKey: string
}

interface ApiCallOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  body?: any
  headers?: Record<string, string>
  apiKey?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    status: number
    details?: string
  }
}

/**
 * Configuración por defecto para las llamadas a Moffin
 */
function getMoffinConfig(): MoffinApiConfig {
  return {
    apiUrl: process.env.MOFFIN_API_URL!,
    apiKey: process.env.MOFFIN_API_KEY!,
  }
}

/**
 * Realiza una llamada a la API de Moffin con manejo de errores centralizado
 */
export async function moffinApiCall<T = any>(
  options: ApiCallOptions,
): Promise<ApiResponse<T>> {
  try {
    const config = getMoffinConfig()
    const { method, endpoint, body, headers = {}, apiKey } = options

    // Usar la API key proporcionada o la por defecto
    const keyToUse = apiKey || config.apiKey

    // Headers por defecto
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Token ${keyToUse}`,
    }

    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: {
          message: `Error en API de Moffin: ${response.status}`,
          status: response.status,
          details: errorText,
        },
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Error de conexión con API de Moffin',
        status: 0,
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
    }
  }
}
