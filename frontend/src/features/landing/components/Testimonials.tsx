'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Adventure Photographer',
    comment: "The real-time tracking feature saved me during a complex transit in Tokyo. I've never felt more in control while traveling.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG0oBkhQSV7SLvQGPyyZUeD7IFKWsAH64vuE6IsfTBrJgm4chwVUc_6TENJSgSpVl52s6l9-7BDE9uF8FNuK3ynIyN4j3lhTtEa5T_Mli6CS3FnJkzfS6jNZRUoXdtdvPmBYNSVKFko9a3bQ_DPh3K7htnTQHKyJhl4tavNpCdASOgY2Lw1Edhe5e-UPuf5gJeErs2hg2c1z0fqGgllDRoTXmy3tRBsaTgYxQAaT0JC37UlILmOtOdcWrlBw1CVd5QX-BZyvS6CYIx',
    stars: 5,
  },
  {
    name: 'Mark Lewiston',
    role: 'Business Traveler',
    comment: "Ethereal Voyager isn't just a booking tool, it's a safety net. The emergency support team responded within seconds.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx3f_qLlGE5s2puB-NpUYdcn_nJrXojWKrGMGDOCiTIOvMIHL-xT_J9VFEGV4rMblachuYBJbeE0ukiTDe2Gk6OsMXhl3aj7jxNqjFQQe3k9T3EL_Z-KH1fV7ye6rZdCsA47kIO7qaveUrU0Rorc3Gw_g8A18RzEftdc3nury_ePrb4jOv7e70y2Z4R7R7IcbCVcmoGAmEoQzY89l7-cOFETSbohY6ud7JcO_UCaSYiG4qJxAcCAv0QyFUeroqlX36HRcpGnKzkUyq',
    stars: 5,
    featured: true,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Digital Nomad',
    comment: "Finally, a platform that understands that travel is about peace of mind. The flexible cancellation is a game changer.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMcWutV44_heFe04eH_CRxSvJ6Cz1eKf4SLxzsoC28wiG76DacO9dpMJnCmrkn6WH1WczSLDmHUgvc3qJ8RKxh1bFNgZbgqs97YxLY_xOyeB5dmJABnIQqW7aRHtwQv9ytKVI1QlkxyP6L8_bqMdR14M2b5ntnPADHBBg41HEMk9eRBwYgVYrWZSBQjrgPjeQopKCpiBG5cmfozKPDMnhUkPxK5ZMsnDx4YD75dH__RgmW6SzBhACYU2FN-Yck6N3FbSfJFzlolvdG',
    stars: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-4xl font-extrabold text-on-surface mb-16 text-center"
      >
        Voyager Voices
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`p-10 rounded-[2rem] relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                t.featured ? 'border-t-4 border-primary' : ''
              }`}
            >
              <span className="absolute top-4 right-8 text-8xl text-outline-variant/10 font-serif leading-none italic select-none">
                &quot;
              </span>

              <div className="flex gap-1 mb-6 text-tertiary">
                {[...Array(t.stars)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>

              <p className="text-on-surface italic leading-relaxed mb-8 relative z-10">
                &quot;{t.comment}&quot;
              </p>

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest">
                    {t.role}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
