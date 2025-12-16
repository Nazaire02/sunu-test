import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import QuoteBuilder from '@/components/quote/QuoteBuilder';
import { Mail, Phone } from 'lucide-react';

const Quote = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-secondary/30">
          <div className="container mx-auto px-6 text-center">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">Contact</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mt-3 text-foreground">
              Demander un Devis
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement avec une offre personnalisée.
            </p>
          </div>
        </section>

        {/* Quote Builder */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <QuoteBuilder />
          </div>
        </section>

        {/* Alternative Contact */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">
              Vous préférez nous contacter directement?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="mailto:contact@ariaevent.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-card border border-border hover:border-primary transition-colors text-foreground"
              >
                <Mail size={20} className="text-primary" />
                contact@ariaevent.com
              </a>
              <a
                href="tel:+22500000000"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-card border border-border hover:border-primary transition-colors text-foreground"
              >
                <Phone size={20} className="text-primary" />
                +225 00 00 00 00 00
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Quote;
