import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'anniversaire', label: 'Anniversaire' },
  { id: 'mariage', label: 'Mariage Civil' },
  { id: 'dot', label: 'Dot' },
  { id: 'gala', label: 'Dîner Gala' },
];

const galleryItems = [
  { id: 1, category: 'mariage', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', title: 'Mariage élégant' },
  { id: 2, category: 'anniversaire', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', title: 'Anniversaire festif' },
  { id: 3, category: 'dot', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', title: 'Dot traditionnelle' },
  { id: 4, category: 'gala', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', title: 'Gala d\'entreprise' },
  { id: 5, category: 'mariage', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', title: 'Réception de mariage' },
  { id: 6, category: 'anniversaire', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800', title: 'Sweet 16' },
  { id: 7, category: 'dot', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', title: 'Cérémonie traditionnelle' },
  { id: 8, category: 'gala', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800', title: 'Soirée de gala' },
  { id: 9, category: 'mariage', image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800', title: 'Décoration florale' },
  { id: 10, category: 'anniversaire', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800', title: 'Fête d\'anniversaire' },
  { id: 11, category: 'gala', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', title: 'Dîner de prestige' },
  { id: 12, category: 'dot', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Célébration culturelle' },
];

const GalleryGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', filter);
    }
    setSearchParams(searchParams);
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };
  
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleFilterChange(category.id)}
            className={cn(
              'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              activeFilter === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer hover-lift"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-6 text-white/80 hover:text-white transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft size={40} />
          </button>
          
          <img
            src={filteredItems[lightboxIndex].image}
            alt={filteredItems[lightboxIndex].title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-6 text-white/80 hover:text-white transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight size={40} />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-center">
            <h3 className="font-serif text-xl font-semibold">{filteredItems[lightboxIndex].title}</h3>
            <p className="text-white/60 text-sm mt-1">
              {lightboxIndex + 1} / {filteredItems.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
