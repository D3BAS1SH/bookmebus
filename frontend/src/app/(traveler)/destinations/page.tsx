'use client'

import React from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { Badge } from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { MapPin, Star } from 'lucide-react'

const destinations = [
  {
    id: 'odisha',
    name: 'Odisha',
    description: 'The soul of Incredible India, known for its ancient temples, pristine beaches, and vibrant culture.',
    image: 'https://images.unsplash.com/photo-1614088924160-589635f111dd?q=80&w=3540&auto=format&fit=crop',
    features: ['Jagannath Temple', 'Konark Sun Temple', 'Chilika Lake', 'Puri Beach'],
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    description: 'Devbhumi or "Land of the Gods", a Himalayan paradise offering spiritual retreats and adventure sports.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=3540&auto=format&fit=crop',
    features: ['Rishikesh Yoga', 'Nainital Lakes', 'Kedarnath Trek', 'Jim Corbett Safari'],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    description: 'God\'s Own Country, famous for its serene backwaters, lush tea gardens, and ayurvedic retreats.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=3540&auto=format&fit=crop',
    features: ['Alleppey Houseboats', 'Munnar Tea Estates', 'Wayanad Nature', 'Kochi Heritage'],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    description: 'The City of Dreams, a bustling metropolis blending colonial architecture with modern skyline.',
    image: 'https://images.unsplash.com/photo-1522256193796-0158a4358ce9?q=80&w=3540&auto=format&fit=crop',
    features: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Bollywood Tours'],
  },
  {
    id: 'pune',
    name: 'Pune',
    description: 'Oxford of the East, offering a mix of Maratha history and a vibrant contemporary lifestyle.',
    image: 'https://images.unsplash.com/photo-1558231908-16e6d1e4e3bd?q=80&w=3540&auto=format&fit=crop',
    features: ['Aga Khan Palace', 'Shaniwar Wada', 'Sinhagad Fort', 'Osho Ashram'],
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    description: 'The Cultural Capital of India, known for its grand colonial architecture, art galleries, and cultural festivals.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=3540&auto=format&fit=crop',
    features: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar Temple', 'College Street'],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    description: 'City of Pearls, where ancient Islamic architecture meets the high-tech industry.',
    image: 'https://images.unsplash.com/photo-1572986297380-4965eb1a4773?q=80&w=3540&auto=format&fit=crop',
    features: ['Charminar', 'Golconda Fort', 'Ramoji Film City', 'Hussain Sagar Lake'],
  },
]

export default function DestinationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-6 px-4 py-1.5 uppercase tracking-wider text-xs">
              EXPLORE INDIA
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-6">
              Incredible Destinations
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover the diverse landscapes, rich culture, and vibrant cities of India. Plan your perfect journey to these breathtaking locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-300 border-none bg-white dark:bg-slate-800 ambient-shadow">
                  <div className="relative h-64 w-full">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        India
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                      {destination.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-2">
                      {destination.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Highlights</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {destination.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-sm text-slate-700 dark:text-slate-200">
                            <Star className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
