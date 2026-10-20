import { createServerFn } from '@tanstack/react-start'
import { contactSchema } from './contactSchema'

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char)
}

// SMTP secrets are evaluated only in a server function, never exposed to the browser.
export const sendContact = createServerFn({ method: 'POST' })
  .validator(contactSchema)
  .handler(async ({ data }) => {
    if (data.website) return { delivered: false, reason: 'invalid' as const }
    const host = process.env.SMTP_HOST
    const user = process.env.SMTP_USER
    const password = process.env.SMTP_PASSWORD
    const from = process.env.SMTP_FROM
    if (!host || !user || !password || !from) {
      return { delivered: false, reason: 'not_configured' as const }
    }
    const nodemailer = (await import('nodemailer')).default
    const renderMjml = (await import('mjml')).default
    const clean = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, escapeHtml(String(value ?? ''))]))
    const mjml = `<mjml><mj-body background-color="#f1f7fb"><mj-section background-color="#ffffff" padding="32px"><mj-column><mj-text font-size="23px" color="#002e5f" font-weight="bold">New dreamora-tech inquiry</mj-text><mj-text font-size="15px">Name: ${clean.first} ${clean.last}<br/>Email: ${clean.email}<br/>Company: ${clean.company}<br/>Interest: ${clean.interest}</mj-text><mj-text font-size="15px">${clean.message.replace(/\n/g, '<br/>')}</mj-text></mj-column></mj-section></mj-body></mjml>`
    const { html } = renderMjml(mjml)
    const transport = nodemailer.createTransport({
      host, port: Number(process.env.SMTP_PORT ?? '587'), secure: Number(process.env.SMTP_PORT ?? '587') === 465,
      auth: { user, pass: password },
    })
    await transport.sendMail({
      from, to: process.env.CONTACT_TO ?? 'contact@zorqiva.org',
      replyTo: data.email,
      subject: `dreamora-tech inquiry — ${data.interest}`,
      text: `Name: ${data.first} ${data.last}\nEmail: ${data.email}\nCompany: ${data.company}\nInterest: ${data.interest}\n\n${data.message}`,
      html,
    })
    return { delivered: true, reason: 'sent' as const }
  })
