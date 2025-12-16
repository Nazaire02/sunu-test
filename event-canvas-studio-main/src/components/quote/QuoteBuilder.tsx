import { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Send, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const eventTypes = [
  { id: 'anniversaire', label: 'Anniversaire', icon: '🎂' },
  { id: 'mariage', label: 'Mariage Civil', icon: '💒' },
  { id: 'dot', label: 'Dot', icon: '🎊' },
  { id: 'gala', label: 'Dîner Gala', icon: '✨' },
];

const additionalServices = [
  'Décoration florale',
  'Traiteur',
  'Animation / DJ',
  'Photographe / Vidéaste',
  'Location de matériel',
  'Coordination jour J',
];

const steps = ['Type d\'événement', 'Détails', 'Services', 'Contact'];

const QuoteBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    guestCount: '',
    location: '',
    services: [] as string[],
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleEventTypeSelect = (type: string) => {
    setFormData({ ...formData, eventType: type });
  };

  const handleServiceToggle = (service: string) => {
    const services = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service];
    setFormData({ ...formData, services });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.eventType !== '';
      case 1:
        return formData.date !== '' && formData.guestCount !== '';
      case 2:
        return true;
      case 3:
        return formData.name !== '' && formData.email !== '' && formData.phone !== '';
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const message = `Bonjour, je souhaite un devis pour:\n\n` +
      `📌 Type: ${eventTypes.find(e => e.id === formData.eventType)?.label}\n` +
      `📅 Date: ${formData.date}\n` +
      `👥 Invités: ${formData.guestCount}\n` +
      `📍 Lieu: ${formData.location || 'Non précisé'}\n` +
      `🎯 Services: ${formData.services.join(', ') || 'Non précisé'}\n\n` +
      `👤 ${formData.name}\n` +
      `📧 ${formData.email}\n` +
      `📞 ${formData.phone}\n\n` +
      `💬 ${formData.message || 'Pas de message supplémentaire'}`;

    const whatsappUrl = `https://wa.me/22500000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Demande envoyée!",
      description: "Vous allez être redirigé vers WhatsApp.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium transition-all',
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {index < currentStep ? <Check size={18} /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-xs hidden sm:block',
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl p-8 border border-border shadow-sm min-h-[400px]">
        {/* Step 1: Event Type */}
        {currentStep === 0 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">
              Quel type d'événement organisez-vous?
            </h3>
            <p className="text-muted-foreground mb-8">
              Sélectionnez le type d'événement pour lequel vous souhaitez un devis.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleEventTypeSelect(type.id)}
                  className={cn(
                    'p-6 rounded-xl border-2 transition-all duration-300 text-left hover-lift',
                    formData.eventType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-3xl mb-3 block">{type.icon}</span>
                  <span className="font-medium text-foreground">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 1 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">
              Détails de l'événement
            </h3>
            <p className="text-muted-foreground mb-8">
              Parlez-nous un peu plus de votre projet.
            </p>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground">
                  <Calendar size={16} className="text-primary" />
                  Date prévue
                </label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground">
                  <Users size={16} className="text-primary" />
                  Nombre d'invités estimé
                </label>
                <Input
                  type="number"
                  name="guestCount"
                  placeholder="Ex: 100"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground">
                  <MapPin size={16} className="text-primary" />
                  Lieu (optionnel)
                </label>
                <Input
                  type="text"
                  name="location"
                  placeholder="Ex: Abidjan, Cocody"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {currentStep === 2 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">
              Services souhaités
            </h3>
            <p className="text-muted-foreground mb-8">
              Sélectionnez les services qui vous intéressent (optionnel).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {additionalServices.map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all duration-300 text-left flex items-center gap-3',
                    formData.services.includes(service)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                      formData.services.includes(service)
                        ? 'bg-primary text-primary-foreground'
                        : 'border-2 border-border'
                    )}
                  >
                    {formData.services.includes(service) && <Check size={14} />}
                  </div>
                  <span className="text-sm text-foreground">{service}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Contact */}
        {currentStep === 3 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">
              Vos coordonnées
            </h3>
            <p className="text-muted-foreground mb-8">
              Comment pouvons-nous vous contacter?
            </p>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Nom complet *</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Email *</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Téléphone *</label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+225 00 00 00 00 00"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Message (optionnel)</label>
                <Textarea
                  name="message"
                  placeholder="Décrivez votre vision..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Retour
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-6"
          >
            Suivant
            <ArrowRight size={18} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="px-6 bg-green-600 hover:bg-green-700"
          >
            <Send size={18} className="mr-2" />
            Envoyer via WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuoteBuilder;
