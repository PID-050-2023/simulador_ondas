import React from 'react';
import { benefits } from '../data/benefits';
import Card from './Card';
import * as LucideIcons from 'lucide-react';

const Benefits: React.FC = () => {
  // Helper function to dynamically render icons
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={40} className="text-blue-800" /> : null;
  };

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">Beneficios para Estudiantes</h2>
        <div className="w-20 h-1 bg-teal-600 mx-auto mb-10"></div>
        
        <div className="max-w-lg mx-auto text-center mb-12">
          <p className="text-gray-700 text-lg">
            Este informe busca transformar la experiencia de aprendizaje, ofreciendo ventajas significativas para el desarrollo académico y profesional de los estudiantes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.id} hover className="p-6 h-full flex flex-col">
              <div className="mb-4">
                {renderIcon(benefit.icon)}
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 flex-grow">{benefit.description}</p>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Resultados Comprobados - Simulación de Resultados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-teal-600 mb-2">85%</div>
              <p className="text-gray-700">Mejora en la comprensión de conceptos complejos</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-teal-600 mb-2">92%</div>
              <p className="text-gray-700">De estudiantes recomiendan la metodología</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-teal-600 mb-2">78%</div>
              <p className="text-gray-700">Incremento en las calificaciones promedio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;