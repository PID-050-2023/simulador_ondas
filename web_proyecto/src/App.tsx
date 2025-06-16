import React, { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    document.title = 'PID 050-2023 | Aprendizaje Significativo';
    
    const defaultTitle = document.querySelector('[data-default]');
    if (defaultTitle) {
      defaultTitle.textContent = 'PID 050-2023 | Aprendizaje Significativo';
    }
  }, []);

  return (
    <MainLayout>
      <Hero />
      <About />
      <Dashboard /> 
      <Gallery />
      <Benefits />
      <Testimonials />
    </MainLayout>
  );
}

export default App;

/*
      <Hero />
      <About />
      <Dashboard /> 
      <Gallery />
      <Benefits />
      <Testimonials />
      <Team />
      <Faq />
      <Contact />

*/