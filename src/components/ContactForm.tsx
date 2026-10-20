import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactValues } from '../lib/contactSchema'
import type { z } from 'zod'
import { sendContact } from '../lib/sendContact'

function mailtoDraft(values: ContactValues) {
  const subject = `dreamora-tech inquiry — ${values.interest}`
  const body = `Name: ${values.first} ${values.last}\nEmail: ${values.email}\nCompany: ${values.company || 'Not specified'}\nInterest: ${values.interest}\n\n${values.message}`
  return `mailto:contact@zorqiva.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function ContactForm() {
  const [status, setStatus] = useState('Secure SMTP delivery is optional. If not configured, your email app will open a draft.')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactValues, unknown, z.output<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { first: '', last: '', email: '', company: '', interest: 'New project', message: '', website: '' },
  })
  const submit = handleSubmit(async values => {
    try {
      const result = await sendContact({ data: contactSchema.parse(values) })
      if (result.delivered) {
        setStatus('Message sent. Thanks for contacting dreamora-tech.')
        reset()
        return
      }
      if (result.reason === 'invalid') { setStatus('Unable to send the message.'); return }
    } catch {
      // Do not claim an email was sent if SMTP delivery failed.
    }
    setStatus('SMTP delivery is unavailable. Your email app should open with a draft; review and send it there.')
    window.location.href = mailtoDraft(values)
  })
  return <form id="contact-form" onSubmit={submit} noValidate>
    <div className="form-row">
      <label>First name<input autoComplete="given-name" placeholder="Jane" aria-invalid={!!errors.first} {...register('first')} /></label>
      <label>Last name<input autoComplete="family-name" placeholder="Smith" aria-invalid={!!errors.last} {...register('last')} /></label>
    </div>
    {errors.first && <span className="form-error">{errors.first.message}</span>}{errors.last && <span className="form-error">{errors.last.message}</span>}
    <div className="form-row">
      <label>Work email<input type="email" autoComplete="email" placeholder="jane@company.com" aria-invalid={!!errors.email} {...register('email')} /></label>
      <label>Company<input autoComplete="organization" placeholder="Company (optional)" {...register('company')} /></label>
    </div>
    {errors.email && <span className="form-error">{errors.email.message}</span>}
    <label>What can we help with?<select {...register('interest')}><option>New project</option><option>Staff augmentation</option><option>Support &amp; maintenance</option><option>Partnerships</option></select></label>
    <label>Tell us a little more<textarea rows={6} placeholder="Goals, timeline, scope, and anything else you would like us to know." aria-invalid={!!errors.message} {...register('message')} /></label>
    {errors.message && <span className="form-error">{errors.message.message}</span>}
    <div className="tw:hidden" aria-hidden="true"><label>Leave this field empty<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>
    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send inquiry'} <span aria-hidden="true">→</span></button>
    <p className="form-note" id="form-status" role="status" aria-live="polite">{status}</p>
  </form>
}
