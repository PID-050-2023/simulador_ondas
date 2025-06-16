import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const Dashboard: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState('all');

  // Process pre vs post intervention comparison
  const conceptComparison = useMemo(() => {
    return {
      labels: ['Longitud de onda', 'Frecuencia', 'Amplitud', 'Velocidad de propagación'],
      datasets: [
        {
          label: 'Pre-intervención',
          data: [2.3, 2.7, 2.8, 1.9],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Post-intervención',
          data: [4.1, 4.3, 4.2, 3.9],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, []);

  // Learning effectiveness radar chart
  const learningEffectiveness = {
    labels: [
      'Comprensión Visual',
      'Aplicación Práctica',
      'Retención',
      'Motivación',
      'Participación Activa',
    ],
    datasets: [
      {
        label: 'Pre-intervención',
        data: [2.1, 1.8, 2.3, 2.5, 2.0],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Post-intervención',
        data: [4.2, 4.5, 4.1, 4.3, 4.4],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Student satisfaction distribution
  const satisfactionData = {
    labels: ['Muy Satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho'],
    datasets: [{
      data: [65, 25, 8, 2],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(255, 99, 132, 0.5)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }]
  };

  // Learning preferences trend
  const learningPreferences = {
    labels: ['Debates', 'Ejercicios guiados', 'Clases prácticas', 'Simulaciones', 'Videos educativos'],
    datasets: [{
      label: 'Preferencia',
      data: [15, 22, 28, 20, 15],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <section id="dashboard" className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        {/* Animated bubbles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">Análisis de Resultados - Simulación de Resultados</h2>
        <div className="w-20 h-1 bg-teal-400 mx-auto mb-10"></div>

        {/* Filters */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedConcept('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                selectedConcept === 'all'
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Todos los conceptos
            </button>
            {conceptComparison.labels.map((concept, index) => (
              <button
                key={concept}
                onClick={() => setSelectedConcept(concept)}
                className={`px-4 py-2 text-sm font-medium ${
                  index === conceptComparison.labels.length - 1 ? 'rounded-r-lg' : ''
                } ${
                  selectedConcept === concept
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart containers with glass effect */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Comprensión de Conceptos: Pre vs Post</h3>
            <Bar
              data={conceptComparison}
              options={{
                responsive: true,
                plugins: {
                  legend: { 
                    position: 'top',
                    labels: { color: 'white' }
                  },
                  title: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 5,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'white' },
                    title: {
                      display: true,
                      text: 'Nivel de Comprensión (1-5)',
                      color: 'white'
                    },
                  },
                  x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'white' }
                  }
                },
              }}
            />
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Efectividad del Aprendizaje</h3>
            <Radar
              data={learningEffectiveness}
              options={{
                responsive: true,
                plugins: {
                  legend: { 
                    position: 'top',
                    labels: { color: 'white' }
                  },
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 5,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: 'white' },
                    ticks: { color: 'white' }
                  },
                },
              }}
            />
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Satisfacción del Estudiante</h3>
            <Pie
              data={satisfactionData}
              options={{
                responsive: true,
                plugins: {
                  legend: { 
                    position: 'right',
                    labels: { color: 'white' }
                  },
                },
              }}
            />
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Preferencias de Aprendizaje</h3>
            <Bar
              data={learningPreferences}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'white' },
                    title: {
                      display: true,
                      text: 'Número de Estudiantes',
                      color: 'white'
                    },
                  },
                  x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'white' }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Key Metrics with glass effect */}
        <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6">Métricas Clave</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-300">85%</p>
              <p className="text-white text-opacity-90">Mejora en comprensión general</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-300">92%</p>
              <p className="text-white text-opacity-90">Recomendarían la herramienta</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-300">78%</p>
              <p className="text-white text-opacity-90">Incremento en calificaciones</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-300">90%</p>
              <p className="text-white text-opacity-90">Satisfacción con la metodología</p>
            </div>
          </div>
        </div>

        {/* Insights Section with glass effect */}
        <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6">Hallazgos Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-teal-300">Mejoras Significativas</h4>
              <ul className="list-disc pl-5 space-y-2 text-white text-opacity-90">
                <li>Incremento del 85% en la comprensión de conceptos ondulatorios</li>
                <li>Mayor capacidad para visualizar fenómenos físicos</li>
                <li>Mejor retención de conceptos teóricos</li>
                <li>Aumento en la participación activa durante las clases</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-teal-300">Áreas de Oportunidad</h4>
              <ul className="list-disc pl-5 space-y-2 text-white text-opacity-90">
                <li>Expandir el programa a más asignaturas</li>
                <li>Desarrollar materiales complementarios</li>
                <li>Implementar sesiones de práctica adicionales</li>
                <li>Crear guías detalladas para docentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-200px) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-400px) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
};

export default Dashboard;