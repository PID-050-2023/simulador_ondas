import React from 'react';
import { teamMembers } from '../data/team';
import Card from './Card';
import { Mail } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <section id="team" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">Equipo del Proyecto</h2>
        <div className="w-20 h-1 bg-teal-600 mx-auto mb-10"></div>
        
        <div className="max-w-lg mx-auto text-center mb-12">
          <p className="text-gray-700 text-lg">
            Nuestro equipo multidisciplinario combina experiencia académica y profesional para desarrollar soluciones educativas innovadoras.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.id} hover className="overflow-hidden">
              <div className="aspect-w-3 aspect-h-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-1">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.faculty}</p>
                <a 
                  href={`mailto:${member.email}`} 
                  className="inline-flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <Mail size={16} className="mr-1" />
                  Contactar
                </a>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-2">¿Interesado en colaborar con nuestro equipo?</p>
          <a 
            href="#contact" 
            className="text-blue-700 font-medium hover:text-blue-900 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contáctanos para explorar oportunidades de colaboración
          </a>
        </div>
      </div>
    </section>
  );
};

export default Team;