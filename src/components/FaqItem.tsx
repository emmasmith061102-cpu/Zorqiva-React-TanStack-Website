import * as Accordion from '@radix-ui/react-accordion'
import type { ReactNode } from 'react'

// Details groups stay independently expandable, matching the template's behavior.
export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return <Accordion.Root type="single" collapsible className="faq-root"><Accordion.Item value="answer" className="faq-item"><Accordion.Header><Accordion.Trigger className="faq-trigger">{question}<span className="faq-plus" aria-hidden="true">+</span></Accordion.Trigger></Accordion.Header><Accordion.Content className="faq-answer">{children}</Accordion.Content></Accordion.Item></Accordion.Root>
}
