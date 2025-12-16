import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-elegant-wedding-table-decoration-4809-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="inline-block text-gold-light text-sm tracking-[0.3em] uppercase mb-6 animate-fade-up opacity-0">
          Organisateur d'événements
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-white mb-6 animate-fade-up opacity-0 animation-delay-200">
          Créons ensemble
          <br />
          <span className="text-gold">vos moments</span>
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up opacity-0 animation-delay-400">
          Des événements sur mesure qui reflètent votre personnalité et créent des souvenirs inoubliables.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 animation-delay-600">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base"
          >
            <Link to="/devis">Demander un devis</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 text-gold hover:bg-white/10 px-8 py-6 text-base"
          >
            <Link to="/galerie">Voir nos réalisations</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-white/60" size={24} />
      </div>
    </section>
  );
};

export default HeroSection;
