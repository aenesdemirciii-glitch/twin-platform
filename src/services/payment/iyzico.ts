import Iyzipay from 'iyzipay'

// Initialize Iyzico client with environment variables
export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-dummy-api-key',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-dummy-secret-key',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
})

// Abstraction for creating a payment checkout form (3D Secure compatible)
export const createCheckoutForm = (requestData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// Abstraction for retrieving payment result
export const retrievePaymentResult = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({
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
