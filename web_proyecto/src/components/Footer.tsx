import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">PID 050-2023</h3>
            <p className="text-gray-400 max-w-sm">
              Potenciar el Aprendizaje Significativo en el Departamento de Tecnologías Industriales.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-300">Enlaces</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#about" 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById('about');
                      if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Proyecto
                  </a>
                </li>
                <li>
                  <a 
                    href="#benefits" 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById('benefits');
                      if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Beneficios
                  </a>
                </li>
                <li>
                  <a 
                    href="#gallery" 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById('gallery');
                      if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Galería
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-300">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/PID-050-2023/simulador_ondas" className="text-gray-400 hover:text-white transition-colors">
                    Repositorio
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-blue-300">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Facultad Tecnológica, Universidad de Santiago de Chile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="mb-4 md:mb-0 flex items-center">
            <div className="flex space-x-4">
              <img src="/Usach S1.png" alt="Logo Universidad" className="h-10" />
              <img src="/vra.png" alt="Logo ViceRectoria" className="h-10" />
                            <img src="/factec_0.png" alt="Logo Facultad" className="h-10" />
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Proyecto de Innovación Docente PID 050-2023. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;