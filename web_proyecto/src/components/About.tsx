import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">¿De qué se trata?</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto mb-10"></div>
          
          <div className="space-y-6 text-gray-700">
            <p className="text-lg">
              El <strong>Proyecto de Innovación Docente PID 050-2023</strong> surge como respuesta a la necesidad de crear metodologías de enseñanza más efectivas en el área de tecnologías industriales, particularmente en la comprensión de fenómenos ondulatorios y vibratorios fundamentales para la ingeniería.
            </p>
            
            <p className="text-lg">
              A través de la combinación de maquetas físicas y simulaciones digitales, este proyecto proporciona a los estudiantes experiencias de aprendizaje inmersivas que permiten visualizar conceptos abstractos y conectarlos con aplicaciones prácticas del mundo real.
            </p>
            
            <p className="text-lg">
              Los fundamentos pedagógicos del proyecto se basan en el aprendizaje significativo, donde el estudiante construye conocimiento a partir de la experimentación y la reflexión, facilitando la retención a largo plazo y la transferencia de conocimiento a situaciones nuevas.
            </p>
            
            <div className="mt-10 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-md">
              <h3 className="font-bold text-blue-800 mb-2">Objetivos principales:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Desarrollar herramientas didácticas que permitan la visualización de fenómenos ondulatorios</li>
                <li>Integrar tecnologías físicas y digitales para crear experiencias de aprendizaje multidimensionales</li>
                <li>Mejorar la comprensión y retención de conceptos complejos en ingeniería</li>
                <li>Fomentar el pensamiento crítico y la capacidad de resolución de problemas</li>
                <li>Documentar y compartir metodologías innovadoras para su implementación en otros contextos educativos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;