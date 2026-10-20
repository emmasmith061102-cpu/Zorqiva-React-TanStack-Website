import type { ReactNode } from 'react'
import { useState } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SiteHeader, SiteFooter } from '../components/SiteLayout'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#002e5f' },
      { title: 'dreamora-tech — Technology Consulting & Software Engineering' },
    ],
    links: [{ rel: 'icon', type: 'image/png', href: '/images/dreamora-tech-logo-light.png' }],
  }),
  component: Root,
  notFoundComponent: NotFound,
})

function Root() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <Document>
      <QueryClientProvider client={queryClient}>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </QueryClientProvider>
    </Document>
  )
}

function NotFound() {
  return <main id="main" className="tw:min-h-[60vh] tw:flex tw:items-center tw:justify-center"><div className="container tw:text-center tw:py-28"><h1>Page not found</h1><p>We couldn't find the page you requested.</p><a className="btn btn-primary" href="/">Go home →</a></div></main>
}

function Document({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>
}
