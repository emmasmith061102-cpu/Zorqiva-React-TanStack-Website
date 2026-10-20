import { z } from 'zod'

export const contactSchema = z.object({
  first: z.string().trim().min(1, 'First name is required').max(70),
  last: z.string().trim().min(1, 'Last name is required').max(70),
  email: z.string().trim().email('Enter a valid work email').max(180),
  company: z.string().trim().max(120).optional().default(''),
  interest: z.enum(['New project', 'Staff augmentation', 'Support & maintenance', 'Partnerships']),
  message: z.string().trim().min(10, 'Please share at least 10 characters').max(3000),
  website: z.string().max(0).optional().default(''), // honeypot field
})
export type ContactValues = z.input<typeof contactSchema>
