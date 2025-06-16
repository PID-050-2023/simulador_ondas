import React from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Dynamic background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="absolute bottom-0 w-full">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
        </div>

        {/* Animated bubbles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              '--left': `${Math.random() * 100}%`,
              '--size': `${Math.random() * 30 + 10}px`,
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${Math.random() * 5 + 5}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
            Potenciar el Aprendizaje Significativo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Integrando tecnologías innovadoras para revolucionar la enseñanza en el Departamento de Tecnologías Industriales
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="border-2 backdrop-blur-sm bg-white bg-opacity-10 hover:bg-opacity-20"
            >
              Descubrir Proyecto
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <button 
          onClick={() => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="animate-bounce p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff22'/%3E%3C/svg%3E");
          background-size: 1600px 100px;
          animation: wave 7s linear infinite;
          transform: translateZ(0);
        }

        .wave1 {
          opacity: 0.3;
          animation: wave 7s linear infinite;
        }

        .wave2 {
          opacity: 0.2;
          animation: wave 10s linear infinite;
        }

        .wave3 {
          opacity: 0.1;
          animation: wave 13s linear infinite;
        }

        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 1600px; }
        }

        .bubble {
          position: absolute;
          left: var(--left);
          bottom: -20px;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: bubble var(--duration) ease-in infinite;
          animation-delay: var(--delay);
        }

        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-50vh) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;