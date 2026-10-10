import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@ikizlerbaharatcilik.com',
    pass: process.env.SMTP_PASS || '', 
  },
})

export async function sendOrderEmails(order: any, customerEmail: string, customerName: string) {
  // Check if SMTP is configured
  if (!process.env.SMTP_PASS) {
    console.warn("SMTP_PASS is not set. Emails will not be sent.")
    return
  }

  const storeName = "İkizler Baharatçılık"
  const storeEmail = process.env.SMTP_USER || 'info@ikizlerbaharatcilik.com'
  const logoUrl = "https://ikizlerbaharatcilik.com/images/logo.png" // Placeholder

  const orderItemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br>
        <small>${item.variantName || ''}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} ₺</td>
    </tr>
  `).join('')

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa; border-radius: 8px 8px 0 0;">
        <h1 style="color: #d97706; margin: 0;">Siparişiniz Alındı!</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
        <p>Merhaba <strong>${customerName}</strong>,</p>
        <p>Siparişiniz başarıyla alınmıştır. Sipariş detaylarınızı aşağıda bulabilirsiniz. Ürünleriniz kargoya verildiğinde size tekrar haber vereceğiz.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Sipariş No:</strong> #${order.orderNumber}</p>
          <p style="margin: 5px 0 0 0;"><strong>Tarih:</strong> ${new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Ürün</th>
              <th style="padding: 10px; text-align: center;">Adet</th>
              <th style="padding: 10px; text-align: right;">Tutar</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Ara Toplam:</strong></td>
              <td style="padding: 10px; text-align: right;">${order.subTotal} ₺</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Kargo:</strong></td>
              <td style="padding: 10px; text-align: right;">${order.shippingCost} ₺</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; color: #d97706; font-size: 1.1em;"><strong>Genel Toplam:</strong></td>
              <td style="padding: 10px; text-align: right; color: #d97706; font-size: 1.1em;"><strong>${order.grandTotal} ₺</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Saygılarımızla,<br><strong>${storeName}</strong> Ekibi</p>
      </div>
    </div>
  `

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="padding: 20px; background-color: #f8f9fa; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #059669; margin-top: 0;">Yeni Sipariş Geldi! 🎉</h2>
        <p><strong>Müşteri:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Sipariş No:</strong> #${order.orderNumber}</p>
        <p><strong>Tutar:</strong> ${order.grandTotal} ₺</p>
        <p style="margin-bottom: 0;">Lütfen detayları görüntülemek ve kargolamak için <a href="https://ikizlerbaharatcilik.com/admin-hoppo-twin/siparisler">Admin Paneline</a> giriş yapın.</p>
      </div>
    </div>
  `

  try {
    // 1. Send email to customer
    await transporter.sendMail({
      from: `"${storeName}" <${storeEmail}>`,
      to: customerEmail,
      subject: `Siparişiniz Alındı #${order.orderNumber} - ${storeName}`,
      html: customerHtml,
    })

    // 2. Send email to admin
    await transporter.sendMail({
      from: `"${storeName} Sistem" <${storeEmail}>`,
      to: storeEmail, // Sending to itself (info@ikizler...)
      subject: `YENİ SİPARİŞ: #${order.orderNumber} - ${order.grandTotal} ₺`,
      html: adminHtml,
    })
    
    console.log(`Order emails sent successfully for order #${order.orderNumber}`)
  } catch (error) {
    console.error("Error sending order emails:", error)
  }
}
