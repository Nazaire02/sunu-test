import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <span className="text-gold text-sm tracking-[0.2em] uppercase mb-4 block">
          Prêt à commencer ?
        </span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
          Créons votre événement
          <br />
          <span className="text-gold">ensemble</span>
        </h2>
        <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
          Contactez-nous dès aujourd'hui pour discuter de votre projet et recevoir un devis personnalisé.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base group"
        >
          <Link to="/devis">
            Demander un devis gratuit
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
