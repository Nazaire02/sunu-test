import { Check } from 'lucide-react';

const features = [
  'Plus de 200 événements réalisés',
  'Une équipe passionnée et créative',
  'Un accompagnement personnalisé',
  'Des partenaires de confiance',
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
                alt="Événement ARIAEVENT"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden border-4 border-background shadow-xl hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400"
                alt="Décoration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="text-primary text-sm tracking-[0.2em] uppercase">À propos</span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-3 mb-6 text-foreground">
              L'art de créer des moments magiques
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Depuis notre création, ARIAEVENT s'est donné pour mission de transformer vos idées 
              en expériences inoubliables. Notre équipe de professionnels passionnés met tout son 
              savoir-faire à votre service pour créer des événements qui vous ressemblent.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Que ce soit pour un mariage, un anniversaire, une dot ou un dîner de gala, 
              nous vous accompagnons à chaque étape pour garantir la perfection de votre événement.
            </p>
            
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check size={12} className="text-primary" />
                  </span>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
