import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import GalleryGrid from '@/components/gallery/GalleryGrid';

const Gallery = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-secondary/30">
          <div className="container mx-auto px-6 text-center">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">Portfolio</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mt-3 text-foreground">
              Notre Galerie
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Découvrez nos réalisations et laissez-vous inspirer pour votre prochain événement.
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <GalleryGrid />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Gallery;
