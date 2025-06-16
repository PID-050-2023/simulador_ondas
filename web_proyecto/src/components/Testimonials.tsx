import React, { useState } from 'react';
import { testimonials } from '../data/testimonials';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section id="testimonials" className="py-20 bg-blue-800 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Testimonios</h2>
        <div className="w-20 h-1 bg-teal-400 mx-auto mb-14"></div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 p-4"
                >
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 shadow-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="flex-shrink-0">
                      </div>
                      <div>
                        <div className="mb-4">
                          <svg className="w-10 h-10 text-teal-400 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                            <path d="M10 8c-2.209 0-4 1.791-4 4v12h8v-8h-4v-4c0-1.105 0.895-2 2-2v-2h-2zM22 8c-2.209 0-4 1.791-4 4v12h8v-8h-4v-4c0-1.105 0.895-2 2-2v-2h-2z"></path>
                          </svg>
                        </div>
                        <p className="text-lg mb-6 italic">{testimonial.content}</p>
                        <div>
                          <h4 className="font-semibold text-xl">{testimonial.name}</h4>
                          <p className="text-blue-200">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:translate-x-0 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-0 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Testimonio siguiente"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Indicator dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${
                  index === activeIndex ? 'bg-teal-400' : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;