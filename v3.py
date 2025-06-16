import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.widgets import Slider, Button
import matplotlib.patches as patches

class SimuladorOndasPerfil:
    def __init__(self):
        # Parámetros del sistema
        self.n_particulas = 80
        self.longitud = 20.0
        self.altura_equilibrio = 5.0
        self.espaciado = self.longitud / (self.n_particulas - 1)
        
        # Parámetros físicos
        self.tension_superficial = 15.0
        self.gravedad = 9.8
        self.viscosidad = 0.05
        self.densidad = 1.0
        self.dt = 0.02
        
        # Control de simulación
        self.tiempo = 0
        self.pausado = False
        self.mostrar_particulas = True
        self.mostrar_superficie = True
        
        # Inicializar sistema
        self.inicializar_agua()
        
        # Datos para análisis
        self.alturas_tiempo = []
        self.tiempos = []
        self.energias = []
        
        # Configurar visualización
        self.setup_visualizacion()
        
    def inicializar_agua(self):
        """Inicializa las posiciones de las partículas de agua"""
        # Posiciones horizontales fijas
        self.x_particulas = np.linspace(0, self.longitud, self.n_particulas)
        
        # Alturas iniciales (superficie en equilibrio)
        self.y_particulas = np.full(self.n_particulas, self.altura_equilibrio)
        self.y_equilibrio = self.y_particulas.copy()
        
        # Velocidades verticales
        self.velocidades = np.zeros(self.n_particulas)
        
        # Condiciones de frontera (paredes del tanque)
        self.pared_izq = True
        self.pared_der = True
        
    def aplicar_perturbacion(self, tipo='gota', posicion=None, amplitud=2.0, ancho=2.0):
        """Aplica diferentes tipos de perturbaciones"""
        if posicion is None:
            posicion = self.longitud / 2  # Centro por defecto
            
        # Encontrar índice más cercano a la posición
        idx_centro = np.argmin(np.abs(self.x_particulas - posicion))
        
        if tipo == 'gota':
            # Simula una gota cayendo
            for i in range(self.n_particulas):
                dist = abs(self.x_particulas[i] - posicion)
                if dist < ancho:
                    factor = np.exp(-(dist/ancho)**2)
                    self.y_particulas[i] -= amplitud * factor
                    self.velocidades[i] = -amplitud * factor * 2
                    
        elif tipo == 'onda_senoidal':
            # Fuente senoidal continua
            self.fuente_activa = True
            self.pos_fuente = posicion
            self.frecuencia = 1.0
            self.amplitud_fuente = amplitud
            
        elif tipo == 'piston':
            # Simulación de pistón en un extremo
            if posicion < self.longitud / 2:  # Lado izquierdo
                for i in range(min(5, self.n_particulas//4)):
                    self.velocidades[i] = amplitud
            else:  # Lado derecho
                for i in range(max(self.n_particulas-5, 3*self.n_particulas//4), self.n_particulas):
                    self.velocidades[i] = amplitud
                    
        elif tipo == 'tsunami':
            # Levantamiento súbito del fondo (tsunami)
            inicio = max(0, idx_centro - int(ancho))
            fin = min(self.n_particulas, idx_centro + int(ancho))
            for i in range(inicio, fin):
                self.y_particulas[i] += amplitud
                self.velocidades[i] += amplitud * 0.5
    
    def calcular_fuerzas(self):
        """Calcula las fuerzas que actúan sobre cada partícula"""
        fuerzas = np.zeros(self.n_particulas)
        
        for i in range(self.n_particulas):
            # Fuerza gravitacional (restauradora hacia equilibrio)
            fuerza_gravedad = -self.gravedad * (self.y_particulas[i] - self.y_equilibrio[i])
            
            # Fuerza de tensión superficial (interacción con vecinos)
            fuerza_tension = 0
            if i > 0:  # Vecino izquierdo
                diff_izq = (self.y_particulas[i-1] - self.y_particulas[i])
                fuerza_tension += self.tension_superficial * diff_izq
                
            if i < self.n_particulas - 1:  # Vecino derecho
                diff_der = (self.y_particulas[i+1] - self.y_particulas[i])
                fuerza_tension += self.tension_superficial * diff_der
            
            # Fuerza de viscosidad (proporcional a la velocidad)
            fuerza_viscosidad = -self.viscosidad * self.velocidades[i]
            
            fuerzas[i] = fuerza_gravedad + fuerza_tension + fuerza_viscosidad
            
        return fuerzas
    
    def aplicar_condiciones_frontera(self):
        """Aplica condiciones de frontera en las paredes"""
        if self.pared_izq:
            # Pared rígida izquierda (reflexión)
            self.y_particulas[0] = self.y_equilibrio[0]
            self.velocidades[0] = 0
            
        if self.pared_der:
            # Pared rígida derecha (reflexión)
            self.y_particulas[-1] = self.y_equilibrio[-1]
            self.velocidades[-1] = 0
    
    def paso_simulacion(self):
        """Ejecuta un paso de la simulación"""
        if self.pausado:
            return
            
        # Aplicar fuente senoidal si está activa
        if hasattr(self, 'fuente_activa') and self.fuente_activa:
            idx_fuente = np.argmin(np.abs(self.x_particulas - self.pos_fuente))
            fase = 2 * np.pi * self.frecuencia * self.tiempo
            self.velocidades[idx_fuente] += self.amplitud_fuente * np.sin(fase) * self.dt
        
        # Calcular fuerzas
        fuerzas = self.calcular_fuerzas()
        
        # Integración temporal (Verlet)
        aceleraciones = fuerzas / self.densidad
        
        # Actualizar velocidades y posiciones
        self.velocidades += aceleraciones * self.dt
        self.y_particulas += self.velocidades * self.dt
        
        # Aplicar condiciones de frontera
        self.aplicar_condiciones_frontera()
        
        self.tiempo += self.dt
        
        # Guardar datos para análisis
        altura_centro = self.y_particulas[self.n_particulas//2] - self.y_equilibrio[self.n_particulas//2]
        self.alturas_tiempo.append(altura_centro)
        self.tiempos.append(self.tiempo)
        
        # Calcular energía total
        energia_cinetica = 0.5 * np.sum(self.velocidades**2)
        energia_potencial = 0.5 * self.gravedad * np.sum((self.y_particulas - self.y_equilibrio)**2)
        energia_total = energia_cinetica + energia_potencial
        self.energias.append(energia_total)
    
    def setup_visualizacion(self):
        """Configura la interfaz gráfica"""
        self.fig = plt.figure(figsize=(16, 10))
        
        # Layout - STORE as instance variable
        self.gs = self.fig.add_gridspec(3, 3, height_ratios=[2, 1, 1], width_ratios=[2, 1, 1])
        
        # Vista principal del tanque
        self.ax_tanque = self.fig.add_subplot(self.gs[0, :2])
        self.ax_tanque.set_title("Vista de Perfil - Simulación de Ondas en Agua", 
                                fontsize=14, fontweight='bold')
        self.ax_tanque.set_xlabel("Posición Horizontal (m)")
        self.ax_tanque.set_ylabel("Altura del Agua (m)")
        self.ax_tanque.set_xlim(0, self.longitud)
        self.ax_tanque.set_ylim(0, 10)
        self.ax_tanque.grid(True, alpha=0.3)
        
        # Dibujar el tanque
        self.dibujar_tanque()
        
        # Gráfico de altura vs tiempo
        self.ax_altura = self.fig.add_subplot(self.gs[1, :2])
        self.ax_altura.set_title("Altura en el Centro vs Tiempo")
        self.ax_altura.set_xlabel("Tiempo (s)")
        self.ax_altura.set_ylabel("Desplazamiento (m)")
        self.ax_altura.grid(True, alpha=0.3)
        
        # Panel de información
        self.ax_info = self.fig.add_subplot(self.gs[0, 2])
        self.ax_info.set_title("Parámetros Físicos")
        self.ax_info.axis('off')
        
        # Gráfico de energía
        self.ax_energia = self.fig.add_subplot(self.gs[1, 2])
        self.ax_energia.set_title("Energía del Sistema")
        self.ax_energia.set_xlabel("Tiempo (s)")
        self.ax_energia.set_ylabel("Energía")
        self.ax_energia.grid(True, alpha=0.3)
        
        # Configurar controles
        self.setup_controles()
        
        # Inicializar elementos gráficos
        self.line_superficie, = self.ax_tanque.plot(self.x_particulas, self.y_particulas, 
                                                   'b-', linewidth=3, label='Superficie')
        self.scatter_particulas = self.ax_tanque.scatter(self.x_particulas, self.y_particulas, 
                                                        c='cyan', s=20, alpha=0.7, label='Partículas')
        
        self.line_altura, = self.ax_altura.plot([], [], 'r-', linewidth=2)
        self.line_energia, = self.ax_energia.plot([], [], 'g-', linewidth=2)
        
        self.ax_tanque.legend()
        
    def dibujar_tanque(self):
        """Dibuja las paredes del tanque"""
        # Fondo del tanque
        self.ax_tanque.axhline(y=0, color='brown', linewidth=4, label='Fondo')
        
        # Paredes laterales
        if self.pared_izq:
            self.ax_tanque.axvline(x=0, color='gray', linewidth=4, label='Pared')
        if self.pared_der:
            self.ax_tanque.axvline(x=self.longitud, color='gray', linewidth=4)
            
        # Nivel de equilibrio (línea punteada)
        self.ax_tanque.axhline(y=self.altura_equilibrio, color='red', 
                              linestyle='--', alpha=0.5, label='Equilibrio')
    
    def setup_controles(self):
        """Configura los controles interactivos"""
        # Área de controles - NOW using self.gs
        ax_controles = self.fig.add_subplot(self.gs[2, :])
        ax_controles.axis('off')
        
        # Sliders
        ax_tension = plt.axes([0.1, 0.25, 0.25, 0.03])
        self.slider_tension = Slider(ax_tension, 'Tensión Sup.', 5.0, 30.0, 
                                   valinit=self.tension_superficial)
        
        ax_viscosidad = plt.axes([0.1, 0.20, 0.25, 0.03])
        self.slider_viscosidad = Slider(ax_viscosidad, 'Viscosidad', 0.0, 0.2, 
                                      valinit=self.viscosidad)
        
        ax_gravedad = plt.axes([0.1, 0.15, 0.25, 0.03])
        self.slider_gravedad = Slider(ax_gravedad, 'Gravedad', 1.0, 20.0, 
                                    valinit=self.gravedad)
        
        ax_frecuencia = plt.axes([0.1, 0.10, 0.25, 0.03])
        self.slider_frecuencia = Slider(ax_frecuencia, 'Frecuencia', 0.1, 3.0, 
                                      valinit=1.0)
        
        # Botones
        ax_reset = plt.axes([0.45, 0.25, 0.08, 0.04])
        self.btn_reset = Button(ax_reset, 'Reset')
        
        ax_pause = plt.axes([0.55, 0.25, 0.08, 0.04])
        self.btn_pause = Button(ax_pause, 'Pausa')
        
        ax_gota = plt.axes([0.45, 0.20, 0.08, 0.04])
        self.btn_gota = Button(ax_gota, 'Gota')
        
        ax_seno = plt.axes([0.55, 0.20, 0.08, 0.04])
        self.btn_seno = Button(ax_seno, 'Senoidal')
        
        ax_piston = plt.axes([0.45, 0.15, 0.08, 0.04])
        self.btn_piston = Button(ax_piston, 'Pistón')
        
        ax_tsunami = plt.axes([0.55, 0.15, 0.08, 0.04])
        self.btn_tsunami = Button(ax_tsunami, 'Tsunami')
        
        # Conectar eventos
        self.slider_tension.on_changed(lambda val: setattr(self, 'tension_superficial', val))
        self.slider_viscosidad.on_changed(lambda val: setattr(self, 'viscosidad', val))
        self.slider_gravedad.on_changed(lambda val: setattr(self, 'gravedad', val))
        self.slider_frecuencia.on_changed(lambda val: setattr(self, 'frecuencia', val))
        
        self.btn_reset.on_clicked(self.reset_simulacion)
        self.btn_pause.on_clicked(self.toggle_pausa)
        self.btn_gota.on_clicked(lambda x: self.aplicar_perturbacion('gota'))
        self.btn_seno.on_clicked(lambda x: self.aplicar_perturbacion('onda_senoidal'))
        self.btn_piston.on_clicked(lambda x: self.aplicar_perturbacion('piston'))
        self.btn_tsunami.on_clicked(lambda x: self.aplicar_perturbacion('tsunami'))
        
        # Click en el tanque para crear perturbaciones
        self.fig.canvas.mpl_connect('button_press_event', self.on_click)
    
    def reset_simulacion(self, event):
        """Reinicia la simulación"""
        self.inicializar_agua()
        self.tiempo = 0
        self.alturas_tiempo.clear()
        self.tiempos.clear()
        self.energias.clear()
        self.fuente_activa = False
        
    def toggle_pausa(self, event):
        """Pausa/reanuda la simulación"""
        self.pausado = not self.pausado
        self.btn_pause.label.set_text('Reanudar' if self.pausado else 'Pausa')
        
    def on_click(self, event):
        """Maneja clicks en la simulación"""
        if event.inaxes == self.ax_tanque and event.button == 1:
            if 0 <= event.xdata <= self.longitud and event.ydata > self.altura_equilibrio:
                self.aplicar_perturbacion('gota', posicion=event.xdata, amplitud=1.5)
    
    def actualizar_info(self):
        """Actualiza el panel de información"""
        if len(self.alturas_tiempo) > 5:
            altura_max = max(self.alturas_tiempo[-50:]) if len(self.alturas_tiempo) >= 50 else max(self.alturas_tiempo)
            energia_actual = self.energias[-1] if self.energias else 0
            
            # Calcular longitud de onda aproximada
            longitud_onda = "N/A"
            if len(self.alturas_tiempo) > 10:
                # Análisis simple de período
                alturas_recientes = self.alturas_tiempo[-50:]
                if len(alturas_recientes) > 20:
                    # Encontrar picos
                    picos = []
                    for i in range(1, len(alturas_recientes)-1):
                        if (alturas_recientes[i] > alturas_recientes[i-1] and 
                            alturas_recientes[i] > alturas_recientes[i+1] and
                            alturas_recientes[i] > 0.1):
                            picos.append(i)
                    
                    if len(picos) >= 2:
                        periodo_frames = np.mean(np.diff(picos))
                        periodo_tiempo = periodo_frames * self.dt
                        if periodo_tiempo > 0:
                            velocidad = np.sqrt(self.tension_superficial / self.densidad)
                            longitud_onda = f"{velocidad * periodo_tiempo:.2f}m"
            
            info_text = f"""
PARÁMETROS ACTUALES:
• Tensión Superficial: {self.tension_superficial:.1f}
• Viscosidad: {self.viscosidad:.3f}
• Gravedad: {self.gravedad:.1f} m/s²
• Tiempo: {self.tiempo:.1f}s

MEDICIONES:
• Amplitud máxima: {altura_max:.3f}m
• Energía total: {energia_actual:.2f}
• Longitud de onda: {longitud_onda}
• Partículas: {self.n_particulas}

INSTRUCCIONES:
• Click: crear perturbación
• Sliders: ajustar parámetros
• Botones: diferentes tipos de ondas
• Observar reflexiones en paredes
            """
            
            self.ax_info.clear()
            self.ax_info.text(0.05, 0.95, info_text, transform=self.ax_info.transAxes,
                            fontsize=9, verticalalignment='top', fontfamily='monospace')
            self.ax_info.axis('off')
    
    def actualizar_animacion(self, frame):
        """Actualiza la animación"""
        self.paso_simulacion()
        
        # Actualizar superficie del agua
        self.line_superficie.set_data(self.x_particulas, self.y_particulas)
        
        # Actualizar partículas con colores según velocidad
        if self.mostrar_particulas:
            velocidades_norm = np.abs(self.velocidades)
            colores = plt.cm.coolwarm(velocidades_norm / (np.max(velocidades_norm) + 1e-6))
            self.scatter_particulas.set_offsets(np.column_stack([self.x_particulas, self.y_particulas]))
            self.scatter_particulas.set_color(colores)
        
        # Actualizar gráfico de altura
        if len(self.tiempos) > 1:
            self.line_altura.set_data(self.tiempos, self.alturas_tiempo)
            if len(self.tiempos) > 200:
                self.ax_altura.set_xlim(self.tiempos[-200], self.tiempos[-1])
            else:
                self.ax_altura.set_xlim(0, max(self.tiempos))
            
            if self.alturas_tiempo:
                y_max = max(self.alturas_tiempo) * 1.1
                y_min = min(self.alturas_tiempo) * 1.1
                self.ax_altura.set_ylim(y_min, y_max)
        
        # Actualizar gráfico de energía
        if len(self.energias) > 1:
            self.line_energia.set_data(self.tiempos, self.energias)
            if len(self.tiempos) > 200:
                self.ax_energia.set_xlim(self.tiempos[-200], self.tiempos[-1])
            else:
                self.ax_energia.set_xlim(0, max(self.tiempos))
            
            if self.energias:
                self.ax_energia.set_ylim(0, max(self.energias) * 1.1)
        
        # Actualizar información cada cierto tiempo
        if frame % 20 == 0:
            self.actualizar_info()
        
        return self.line_superficie, self.scatter_particulas, self.line_altura, self.line_energia
    
    def ejecutar(self):
        """Ejecuta la simulación"""
        # Aplicar perturbación inicial
        self.aplicar_perturbacion('gota')
        
        # Crear animación
        self.ani = animation.FuncAnimation(
            self.fig, self.actualizar_animacion,
            frames=2000, interval=50, blit=False, repeat=True
        )
        
        plt.tight_layout()
        plt.show()

# Ejecutar el simulador
if __name__ == "__main__":
    print(" Simulador de Ondas - Vista de Perfil")
    print("Instrucciones:")
    print("• Haz click en el agua para crear ondas")
    print("• Usa los sliders para cambiar parámetros físicos")
    print("• Prueba diferentes tipos de perturbaciones")
    print("• Observa las reflexiones en las paredes")
    
    simulador = SimuladorOndasPerfil()
    simulador.ejecutar()