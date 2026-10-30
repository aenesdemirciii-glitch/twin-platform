import Iyzipay from 'iyzipay'
import prisma from '@/lib/prisma'

// Fallback default client with environment variables
export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-dummy-api-key',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-dummy-secret-key',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
})

// Dynamically resolve credentials: first checks admin Settings in DB, falls back to .env
export async function getIyzicoClient(): Promise<any> {
  let apiKey = process.env.IYZICO_API_KEY
  let secretKey = process.env.IYZICO_SECRET_KEY
  let uri = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: { in: ['iyzico_api_key', 'iyzico_secret_key', 'iyzico_base_url'] }
      }
    })

    const map = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)

    if (map['iyzico_api_key'] && map['iyzico_api_key'].trim()) {
      apiKey = map['iyzico_api_key'].trim()
    }
    if (map['iyzico_secret_key'] && map['iyzico_secret_key'].trim()) {
      secretKey = map['iyzico_secret_key'].trim()
    }
    if (map['iyzico_base_url'] && map['iyzico_base_url'].trim()) {
      uri = map['iyzico_base_url'].trim()
    }
  } catch (err) {
    // If database read fails, seamlessly fall back to environment variables
    console.warn("Could not read iyzico settings from database, using env:", err)
  }

  return new Iyzipay({
    apiKey: apiKey || 'sandbox-dummy-api-key',
    secretKey: secretKey || 'sandbox-dummy-secret-key',
    uri: uri || 'https://sandbox-api.iyzipay.com'
  })
}

// Abstraction for creating a payment checkout form (3D Secure compatible)
export const createCheckoutForm = async (requestData: any): Promise<any> => {
  const client = await getIyzicoClient()
  return new Promise((resolve, reject) => {
    client.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// Abstraction for retrieving payment result
export const retrievePaymentResult = async (token: string): Promise<any> => {
  const client = await getIyzicoClient()
  return new Promise((resolve, reject) => {
    client.checkoutForm.retrieve({
      locale: Iyzipay.LOCALE.TR,
      token
    }, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
