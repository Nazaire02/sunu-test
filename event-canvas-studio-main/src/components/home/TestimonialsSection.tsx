import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Marie-Claire A.',
    event: 'Mariage Civil',
    text: 'ARIAEVENT a transformé notre mariage en un véritable conte de fées. Chaque détail était parfait, de la décoration florale à la coordination du jour J. Je recommande à 100%!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Jean-Baptiste K.',
    event: 'Dîner de Gala',
    text: 'Un professionnalisme remarquable! Notre gala d\'entreprise a été un succès total grâce à l\'équipe d\'ARIAEVENT. Les invités n\'ont cessé de nous complimenter sur l\'organisation.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    name: 'Fatou D.',
    event: 'Dot Traditionnelle',
    text: 'Ils ont su mélanger tradition et modernité avec une élégance rare. Notre dot était exactement ce que nous avions imaginé, et même plus. Merci infiniment!',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm tracking-[0.2em] uppercase">Témoignages</span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-3 text-foreground">
            Ce qu'ils disent de nous
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border">
            <Quote className="text-primary/20 w-16 h-16 mb-6" />
            
            <div className="min-h-[200px] flex flex-col justify-between">
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                {testimonials[activeIndex].text}
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[activeIndex].event}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === activeIndex ? 'w-8 bg-primary' : 'bg-border hover:bg-primary/50'
                  )}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
