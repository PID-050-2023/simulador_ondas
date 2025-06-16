import React, { useState } from 'react';
import { faqs } from '../data/faqs';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">Preguntas Frecuentes</h2>
        <div className="w-20 h-1 bg-teal-600 mx-auto mb-10"></div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className={`w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none ${
                    openIndex === index ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-blue-800">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="flex-shrink-0 text-blue-700" size={20} />
                  ) : (
                    <ChevronDown className="flex-shrink-0 text-gray-500" size={20} />
                  )}
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-700 mb-4">¿No encuentras respuesta a tu pregunta?</p>
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
              Contáctanos directamente y te responderemos a la brevedad
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;