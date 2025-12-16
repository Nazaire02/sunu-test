import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '22500000000'; // Replace with actual number
  const message = encodeURIComponent('Bonjour, je souhaite avoir plus d\'informations sur vos services.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Écrivez-nous
      </span>
    </a>
  );
};

export default WhatsAppButton;
