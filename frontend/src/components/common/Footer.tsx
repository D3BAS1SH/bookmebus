import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export function Footer() {
  const sections = [
    {
      title: 'Explore',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Booking', href: '#' },
        { name: 'Sustainability Report', href: '#' },
        { name: 'Partner Program', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Emergency Support', href: '#' },
        { name: 'Cancellation Policy', href: '#' },
        { name: 'Travel Insurance', href: '#' },
        { name: 'Help Center', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
      ],
    },
  ]

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full py-16 px-8 mt-auto font-body text-sm leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <div className="col-span-1">
          <span className="text-lg font-bold text-slate-900 dark:text-white mb-4 block font-display">
            Ethereal Voyager
          </span>
          <p className="text-slate-500 dark:text-slate-500 mb-6 max-w-xs">
            Redefining travel through technology and empathy. Experience the weightless journey today.
          </p>
          <div className="flex gap-4">
            <Link 
              href="#" 
              className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-secondary-container hover:bg-primary-container hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </Link>
            <Link 
              href="#" 
              className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-secondary-container hover:bg-primary-container hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">public</span>
            </Link>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[10px]">
              {section.title}
            </h5>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-500 dark:text-slate-500 hover:text-primary transition-all underline-offset-4 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {section.title === 'Company' && (
                <li className="flex items-center gap-2 text-slate-500 pt-2 font-medium">
                  <span className="material-symbols-outlined text-xs">call</span>
                  +1 (800) VOYAGER
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-16 pt-8 border-t border-outline-variant/10 text-center max-w-7xl mx-auto">
        <p className="text-slate-500 dark:text-slate-500 font-medium">
          © {new Date().getFullYear()} Ethereal Voyager. The Weightless Journey.
        </p>
      </div>
    </footer>
  )
}
