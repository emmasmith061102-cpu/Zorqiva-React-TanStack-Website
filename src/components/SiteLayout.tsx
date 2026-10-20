import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ArrowUp, ArrowUpRight } from 'lucide-react'

const nav = [
  { to: '/', label: 'Home' }, { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' }, { to: '/case-studies', label: 'Portfolio' },
  { to: '/industries', label: 'Industries' }, { to: '/engagement', label: 'Engagement' },
  { to: '/careers', label: 'Careers' }, { to: '/contact', label: 'Contact' },
] as const

function Logo() {
  return <Link to="/" className="logo" aria-label="dreamora-tech home"><img src="/images/dreamora-tech-logo-light.png" alt="dreamora-tech" /></Link>
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [])
  return <>
    <div className="top-strip"><div className="container"><span><span className="status-dot" /> Open to new projects · Alaska &amp; Hong Kong</span><Link to="/careers">We're hiring <ArrowUpRight size={12} aria-hidden="true" className="tw:inline" /></Link></div></div>
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`} id="site-header">
      <div className="nav-inner container"><Logo />
        <button type="button" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(x => !x)}><span /><span /><span /></button>
        <nav className={`navbar${open ? ' is-open' : ''}`} id="site-nav" aria-label="Main navigation"><ul>{nav.map(item => <li key={item.to}><Link to={item.to} aria-current={pathname === item.to ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link></li>)}</ul></nav>
      </div>
    </header>
  </>
}

export function SiteFooter() {
  const { pathname } = useLocation()
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 350)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])
  return <>
    <footer className="footer"><div className="container"><div className="footer-grid">
      <div className="footer-brand"><Logo /><p>Technology consulting and software engineering for ambitious teams worldwide. Built with care from Alaska to Hong Kong.</p><a className="footer-email" href="mailto:contact@zorqiva.org">contact@zorqiva.org ↗</a></div>
      <div><h3>Explore</h3><Link to="/services">Our services</Link><Link to="/case-studies">Case studies</Link><Link to="/industries">Industries</Link><Link to="/engagement">Engagement models</Link></div>
      <div><h3>Company</h3><Link to="/about">About us</Link><Link to="/careers">Careers</Link><Link to="/contact">Contact</Link><Link to="/faq">FAQ</Link></div>
      <div><h3>Offices</h3><p><strong>Anchorage</strong><br />5535 E 43rd Ave<br />Anchorage, AK 99504</p><p><strong>Hong Kong</strong><br />Room 1417, 15/F, Kowloon Commerce Centre<br />51 Kwai Cheong Road, Kwai Chung</p></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} dreamora-tech. All rights reserved.</span><div><Link to="/security">Security</Link><a href="https://zorqiva.vercel.app/privacy" target="_blank" rel="noopener noreferrer">Privacy ↗</a><a href="https://zorqiva.vercel.app/terms" target="_blank" rel="noopener noreferrer">Terms ↗</a><a href="https://zorqiva.vercel.app/cookies" target="_blank" rel="noopener noreferrer">Cookies ↗</a></div></div></div></footer>
    <a className={`back-to-top${showTop ? ' visible' : ''}`} href="#main" aria-label="Back to top"><ArrowUp size={18} aria-hidden="true" /></a>
  </>
}
