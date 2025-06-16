import React, { useState } from 'react';
import { galleryImages } from '../data/gallery';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  
  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);
  
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setCurrentImageIndex(null);
    document.body.style.overflow = 'auto';
  };
  
  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentImageIndex === null) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? filteredImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === filteredImages.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">Galería del Proyecto</h2>
        <div className="w-20 h-1 bg-teal-600 mx-auto mb-10"></div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === 'all' ? 'bg-white shadow-sm text-blue-800' : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveCategory('maqueta')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === 'maqueta' ? 'bg-white shadow-sm text-blue-800' : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Maqueta Física
            </button>
            <button
              onClick={() => setActiveCategory('simulacion')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === 'simulacion' ? 'bg-white shadow-sm text-blue-800' : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Simulaciones
            </button>
            <button
              onClick={() => setActiveCategory('colaboracion')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === 'colaboracion' ? 'bg-white shadow-sm text-blue-800' : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Trabajo Colaborativo
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="overflow-hidden rounded-lg shadow-md bg-white cursor-pointer transform transition-transform hover:scale-[1.02]"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-700">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {currentImageIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={closeLightbox}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={() => navigateImage('prev')}
            >
              <ChevronLeft size={40} />
            </button>
            
            <img 
              src={filteredImages[currentImageIndex].url} 
              alt={filteredImages[currentImageIndex].alt} 
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={() => navigateImage('next')}
            >
              <ChevronRight size={40} />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p>{filteredImages[currentImageIndex].alt}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;