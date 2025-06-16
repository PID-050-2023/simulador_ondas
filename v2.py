import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.widgets import Slider, Button, CheckButtons
import matplotlib.patches as patches

class SimuladorOndas:
    def __init__(self):
        # Parámetros configurables
        self.n = 50
        self.espaciado = 0.2
        self.masa = 1.0
        self.k = 25.0
        self.damping = 0.02
        self.dt = 0.03
        
        # Control de simulación
        self.pausado = False
        self.tiempo = 0
        self.frame_count = 0
        
        # Inicialización de la red
        self.inicializar_sistema()
        
        # Datos para análisis
        self.amplitudes_centro = []
        self.amplitudes_borde = []
        self.tiempos = []
        
        # Configuración de visualización
        self.setup_visualizacion()
        
    def inicializar_sistema(self):
        """Inicializa las posiciones y velocidades de las partículas"""
        x_coords = np.linspace(0, (self.n - 1) * self.espaciado, self.n)
        y_coords = np.linspace(0, (self.n - 1) * self.espaciado, self.n)
        X, Y = np.meshgrid(x_coords, y_coords)
        
        self.posiciones_iniciales = np.stack((X.flatten(), Y.flatten()), axis=-1)
        self.posiciones = self.posiciones_iniciales.copy()
        self.velocidades = np.zeros_like(self.posiciones)
        self.n_particulas = self.posiciones.shape[0]
        
        # Índices importantes
        self.indice_centro = (self.n // 2) * self.n + (self.n // 2)
        self.indice_borde = (self.n - 1) * self.n + (self.n // 2)
        
        # Calcular vecinos
        self.calcular_vecinos()
        
    def calcular_vecinos(self):
        """Calcula los vecinos directos de cada partícula"""
        self.vecinos = []
        for i in range(self.n_particulas):
            fila_i = i // self.n
            col_i = i % self.n
            conexiones = []
            
            # Vecinos directos (4-conectividad)
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                f, c = fila_i + dy, col_i + dx
                if 0 <= f < self.n and 0 <= c < self.n:
                    j = f * self.n + c
                    conexiones.append(j)
            
            self.vecinos.append(conexiones)
    
    def aplicar_perturbacion(self, tipo='pulso', centro=None, amplitud=3.0, ancho=1.5):
        """Aplica diferentes tipos de perturbaciones"""
        if centro is None:
            centro = np.array([self.posiciones_iniciales[self.indice_centro, 0], 
                             self.posiciones_iniciales[self.indice_centro, 1]])
        
        if tipo == 'pulso':
            # Perturbación circular (pulso)
            for i in range(self.n_particulas):
                dist = np.linalg.norm(self.posiciones_iniciales[i] - centro)
                if dist < ancho:
                    factor = np.exp(-dist**2 / (ancho/2)**2)
                    self.velocidades[i][1] += factor * amplitud
                    
        elif tipo == 'senoidal':
            # Fuente senoidal continua en el centro
            self.fuente_activa = True
            self.frecuencia_fuente = 0.5
            self.amplitud_fuente = amplitud
            
        elif tipo == 'lineal':
            # Perturbación lineal (frente de onda)
            fila_centro = int(centro[1] / self.espaciado)
            for i in range(self.n_particulas):
                fila_i = i // self.n
                if abs(fila_i - fila_centro) <= 2:
                    self.velocidades[i][1] += amplitud * np.exp(-abs(fila_i - fila_centro))
    
    def paso_simulacion(self):
        """Ejecuta un paso de la simulación"""
        if self.pausado:
            return
            
        # Calcular fuerzas elásticas
        aceleraciones = np.zeros_like(self.posiciones)
        
        for i in range(self.n_particulas):
            for j in self.vecinos[i]:
                # Vector entre partículas
                delta = self.posiciones[j] - self.posiciones[i]
                delta_inicial = (self.posiciones_iniciales[j] - 
                               self.posiciones_iniciales[i])
                
                # Deformación respecto a la posición de equilibrio
                deformacion = delta - delta_inicial
                
                # Fuerza elástica proporcional a la deformación
                fuerza = self.k * deformacion
                aceleraciones[i] += fuerza / self.masa
        
        # Aplicar fuente senoidal si está activa
        if hasattr(self, 'fuente_activa') and self.fuente_activa:
            fase = 2 * np.pi * self.frecuencia_fuente * self.tiempo
            fuerza_fuente = self.amplitud_fuente * np.sin(fase)
            self.velocidades[self.indice_centro][1] += fuerza_fuente * self.dt
        
        # Integración temporal
        self.velocidades += aceleraciones * self.dt
        self.velocidades *= (1 - self.damping)  # Amortiguamiento
        self.posiciones += self.velocidades * self.dt
        
        self.tiempo += self.dt
        self.frame_count += 1
        
        # Guardar datos para análisis
        if self.frame_count % 2 == 0:  # Cada 2 frames
            amp_centro = (self.posiciones[self.indice_centro][1] - 
                         self.posiciones_iniciales[self.indice_centro][1])
            amp_borde = (self.posiciones[self.indice_borde][1] - 
                        self.posiciones_iniciales[self.indice_borde][1])
            
            self.amplitudes_centro.append(amp_centro)
            self.amplitudes_borde.append(amp_borde)
            self.tiempos.append(self.tiempo)
    
    def setup_visualizacion(self):
        """Configura la interfaz gráfica"""
        self.fig = plt.figure(figsize=(16, 10))
        
        # Layout de subplots
        self.gs = self.fig.add_gridspec(3, 3, height_ratios=[2, 1, 1], 
                                       width_ratios=[2, 1, 1])
        
        # Panel principal de simulación
        self.ax_sim = self.fig.add_subplot(self.gs[0, :2])
        self.ax_sim.set_title("Simulación de Ondas 2D", fontsize=14, fontweight='bold')
        self.ax_sim.set_xlabel("Posición X")
        self.ax_sim.set_ylabel("Posición Y")
        self.ax_sim.set_aspect('equal')
        
        # Gráfico de amplitudes
        self.ax_amp = self.fig.add_subplot(self.gs[1, :2])
        self.ax_amp.set_title("Amplitud vs Tiempo")
        self.ax_amp.set_xlabel("Tiempo")
        self.ax_amp.set_ylabel("Amplitud")
        
        # Panel de información
        self.ax_info = self.fig.add_subplot(self.gs[0, 2])
        self.ax_info.set_title("Parámetros Físicos")
        self.ax_info.axis('off')
        
        # Análisis de frecuencia
        self.ax_freq = self.fig.add_subplot(self.gs[1, 2])
        self.ax_freq.set_title("Espectro de Frecuencia")
        self.ax_freq.set_xlabel("Frecuencia")
        self.ax_freq.set_ylabel("Amplitud")
        
        # Controles
        self.setup_controles()
        
        # Inicializar visualización
        self.scatter = self.ax_sim.scatter(self.posiciones[:, 0], self.posiciones[:, 1], 
                                         s=30, c='blue', alpha=0.7)
        
        # Líneas para amplitudes
        self.line_centro, = self.ax_amp.plot([], [], 'r-', label='Centro', linewidth=2)
        self.line_borde, = self.ax_amp.plot([], [], 'b-', label='Borde', linewidth=2)
        self.ax_amp.legend()
        
        # Marcadores especiales
        self.marcar_puntos_importantes()
        
    def setup_controles(self):
        """Configura los controles interactivos"""
        # Área de controles
        ax_controles = self.fig.add_subplot(self.gs[2, :])
        ax_controles.axis('off')
        
        # Sliders
        ax_k = plt.axes([0.1, 0.25, 0.3, 0.03])
        self.slider_k = Slider(ax_k, 'Rigidez (k)', 5.0, 50.0, valinit=self.k)
        
        ax_damp = plt.axes([0.1, 0.20, 0.3, 0.03])
        self.slider_damp = Slider(ax_damp, 'Amortiguamiento', 0.0, 0.1, valinit=self.damping)
        
        ax_freq = plt.axes([0.1, 0.15, 0.3, 0.03])
        self.slider_freq = Slider(ax_freq, 'Frecuencia Fuente', 0.1, 2.0, valinit=0.5)
        
        # Botones
        ax_reset = plt.axes([0.5, 0.25, 0.08, 0.04])
        self.btn_reset = Button(ax_reset, 'Reset')
        
        ax_pause = plt.axes([0.6, 0.25, 0.08, 0.04])
        self.btn_pause = Button(ax_pause, 'Pausa')
        
        ax_pulso = plt.axes([0.5, 0.20, 0.08, 0.04])
        self.btn_pulso = Button(ax_pulso, 'Pulso')
        
        ax_seno = plt.axes([0.6, 0.20, 0.08, 0.04])
        self.btn_seno = Button(ax_seno, 'Senoidal')
        
        ax_lineal = plt.axes([0.5, 0.15, 0.08, 0.04])
        self.btn_lineal = Button(ax_lineal, 'Lineal')
        
        # Conectar eventos
        self.slider_k.on_changed(self.actualizar_k)
        self.slider_damp.on_changed(self.actualizar_damping)
        self.slider_freq.on_changed(self.actualizar_frecuencia)
        
        self.btn_reset.on_clicked(self.reset_simulacion)
        self.btn_pause.on_clicked(self.toggle_pausa)
        self.btn_pulso.on_clicked(lambda x: self.aplicar_perturbacion('pulso'))
        self.btn_seno.on_clicked(lambda x: self.aplicar_perturbacion('senoidal'))
        self.btn_lineal.on_clicked(lambda x: self.aplicar_perturbacion('lineal'))
        
        # Click en la simulación para crear perturbaciones
        self.fig.canvas.mpl_connect('button_press_event', self.on_click)
    
    def marcar_puntos_importantes(self):
        """Marca puntos importantes en la simulación"""
        # Marcar centro
        centro_pos = self.posiciones_iniciales[self.indice_centro]
        self.ax_sim.plot(centro_pos[0], centro_pos[1], 'ro', markersize=8, 
                        label='Centro')
        
        # Marcar borde
        borde_pos = self.posiciones_iniciales[self.indice_borde]
        self.ax_sim.plot(borde_pos[0], borde_pos[1], 'go', markersize=8, 
                        label='Borde')
        
        self.ax_sim.legend()
    
    def actualizar_k(self, val):
        self.k = self.slider_k.val
        
    def actualizar_damping(self, val):
        self.damping = self.slider_damp.val
        
    def actualizar_frecuencia(self, val):
        if hasattr(self, 'frecuencia_fuente'):
            self.frecuencia_fuente = self.slider_freq.val
    
    def reset_simulacion(self, event):
        """Reinicia la simulación"""
        self.posiciones = self.posiciones_iniciales.copy()
        self.velocidades = np.zeros_like(self.posiciones)
        self.tiempo = 0
        self.frame_count = 0
        self.amplitudes_centro.clear()
        self.amplitudes_borde.clear()
        self.tiempos.clear()
        self.fuente_activa = False
        
    def toggle_pausa(self, event):
        """Pausa/reanuda la simulación"""
        self.pausado = not self.pausado
        self.btn_pause.label.set_text('Reanudar' if self.pausado else 'Pausa')
        
    def on_click(self, event):
        """Maneja clicks en la simulación"""
        if event.inaxes == self.ax_sim and event.button == 1:  # Click izquierdo
            centro_click = np.array([event.xdata, event.ydata])
            self.aplicar_perturbacion('pulso', centro=centro_click, amplitud=2.0)
    
    def actualizar_info(self):
        """Actualiza el panel de información"""
        if len(self.amplitudes_centro) > 10:
            # Calcular velocidad de onda aproximada
            max_amp = max(self.amplitudes_centro[-50:]) if len(self.amplitudes_centro) >= 50 else max(self.amplitudes_centro)
            
            # Información física
            info_text = f"""
PARÁMETROS ACTUALES:
• Rigidez (k): {self.k:.1f}
• Amortiguamiento: {self.damping:.3f}
• Tiempo: {self.tiempo:.1f}s

MEDICIONES:
• Amplitud máxima: {max_amp:.2f}
• Partículas: {self.n_particulas}
• Espaciado: {self.espaciado:.2f}

INSTRUCCIONES:
• Click izquierdo: crear pulso
• Ajustar sliders para cambiar parámetros
• Observar propagación y reflexiones
            """
            
            self.ax_info.clear()
            self.ax_info.text(0.05, 0.95, info_text, transform=self.ax_info.transAxes,
                            fontsize=9, verticalalignment='top', fontfamily='monospace')
            self.ax_info.axis('off')
    
    def analizar_frecuencia(self):
        """Analiza el espectro de frecuencia"""
        if len(self.amplitudes_centro) > 50:
            # FFT de las amplitudes del centro
            y = np.array(self.amplitudes_centro[-100:]) if len(self.amplitudes_centro) >= 100 else np.array(self.amplitudes_centro)
            if len(y) > 10:
                fft = np.fft.fft(y)
                freqs = np.fft.fftfreq(len(y), self.dt * 2)  # *2 porque guardamos cada 2 frames
                
                # Solo frecuencias positivas
                pos_mask = freqs > 0
                freqs_pos = freqs[pos_mask]
                fft_pos = np.abs(fft[pos_mask])
                
                self.ax_freq.clear()
                self.ax_freq.plot(freqs_pos, fft_pos, 'b-', linewidth=2)
                self.ax_freq.set_xlabel("Frecuencia")
                self.ax_freq.set_ylabel("Amplitud")
                self.ax_freq.set_title("Espectro de Frecuencia")
                self.ax_freq.grid(True, alpha=0.3)
    
    def actualizar_animacion(self, frame):
        """Actualiza la animación"""
        self.paso_simulacion()
        
        # Actualizar posiciones de partículas
        colores = plt.cm.viridis((self.posiciones[:, 1] - self.posiciones_iniciales[:, 1] + 2) / 4)
        self.scatter.set_offsets(self.posiciones)
        self.scatter.set_color(colores)
        
        # Actualizar gráficos de amplitud
        if len(self.tiempos) > 1:
            self.line_centro.set_data(self.tiempos, self.amplitudes_centro)
            self.line_borde.set_data(self.tiempos, self.amplitudes_borde)
            
            # Ajustar límites
            if len(self.tiempos) > 100:
                self.ax_amp.set_xlim(self.tiempos[-100], self.tiempos[-1])
            else:
                self.ax_amp.set_xlim(0, max(self.tiempos))
                
            if self.amplitudes_centro:
                y_max = max(max(self.amplitudes_centro), max(self.amplitudes_borde)) * 1.1
                y_min = min(min(self.amplitudes_centro), min(self.amplitudes_borde)) * 1.1
                self.ax_amp.set_ylim(y_min, y_max)
        
        # Actualizar información cada cierto tiempo
        if self.frame_count % 20 == 0:
            self.actualizar_info()
            self.analizar_frecuencia()
        
        return self.scatter, self.line_centro, self.line_borde
    
    def ejecutar(self):
        """Ejecuta la simulación"""
        # Aplicar perturbación inicial
        self.aplicar_perturbacion('pulso')
        
        # Crear animación
        self.ani = animation.FuncAnimation(
            self.fig, self.actualizar_animacion, 
            frames=1000, interval=50, blit=False, repeat=True
        )
        
        plt.tight_layout()
        plt.show()

# Ejecutar el simulador
if __name__ == "__main__":
    simulador = SimuladorOndas()
    simulador.ejecutar()