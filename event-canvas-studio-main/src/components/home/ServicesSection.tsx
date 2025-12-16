import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Anniversaire',
    description: 'Célébrez chaque année avec style et originalité.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
    filter: 'anniversaire',
  },
  {
    title: 'Mariage Civil',
    description: 'Un moment unique dans un cadre élégant et raffiné.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    filter: 'mariage',
  },
  {
    title: 'Dot',
    description: 'Honorez vos traditions avec une touche moderne.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
    filter: 'dot',
  },
  {
    title: 'Dîner Gala',
    description: 'Des soirées prestigieuses et mémorables.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    filter: 'gala',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm tracking-[0.2em] uppercase">Nos Services</span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-3 text-foreground">
            Ce que nous créons
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={`/galerie?filter=${service.filter}`}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-serif text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-white/70 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-gold text-sm font-medium">
                  Découvrir
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
