import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`font-bold text-xl ${isScrolled ? 'text-blue-800' : 'text-white'}`}>PID 050-2023</span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('about')} 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
            >
              Proyecto
            </button>
            <button 
              onClick={() => scrollToSection('gallery')} 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
            >
              Galería
            </button>
            <button 
              onClick={() => scrollToSection('benefits')} 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
            >
              Beneficios
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
            >
              Testimonios
            </button>
            <button 
              onClick={() => scrollToSection('team')} 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
            >
              Equipo
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
            >
              FAQ
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              variant={isScrolled ? 'primary' : 'outline'}
              size="sm"
            >
              Contacto
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white mt-2 py-4 px-2 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('about')} 
                className="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              >
                Proyecto
              </button>
              <button 
                onClick={() => scrollToSection('gallery')} 
                className="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              >
                Galería
              </button>
              <button 
                onClick={() => scrollToSection('benefits')} 
                className="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              >
                Beneficios
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              >
                Testimonios
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              >
                Equipo
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              >
                FAQ
              </button>
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="primary"
                className="w-full text-center"
              >
                Contacto
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;