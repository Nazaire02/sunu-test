import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">
              ARIA<span className="text-gold">EVENT</span>
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Créateurs d'événements inoubliables. Nous transformons vos rêves en réalité avec élégance et passion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                Accueil
              </Link>
              <Link to="/galerie" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                Galerie
              </Link>
              <Link to="/devis" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                Demander un devis
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="tel:+22500000000" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone size={16} />
                +225 00 00 00 00 00
              </a>
              <a href="mailto:contact@ariaevent.com" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail size={16} />
                contact@ariaevent.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Abidjan, Côte d'Ivoire
              </span>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-foreground/70 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} ARIAEVENT. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
