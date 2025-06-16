import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
import matplotlib.animation as animation

# Configuración de red
n = 40
espaciado = 0.25
masa = 1.0
k = 20.0
damping = 0.05
dt = 0.05

# Inicialización de partículas
x_coords = np.linspace(0, (n - 1) * espaciado, n)
y_coords = np.linspace(0, (n - 1) * espaciado, n)
X, Y = np.meshgrid(x_coords, y_coords)
posiciones_base = np.stack((X.flatten(), Y.flatten()), axis=-1)
n_particulas = posiciones_base.shape[0]

# Vecinos directos
vecinos = []
for i in range(n_particulas):
    fila_i = i // n
    col_i = i % n
    conexiones = []
    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
        f, c = fila_i + dy, col_i + dx
        if 0 <= f < n and 0 <= c < n:
            j = f * n + c
            conexiones.append(j)
    vecinos.append(conexiones)

# Crear figura y ejes
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
plt.subplots_adjust(bottom=0.25)

# Configurar sliders
ax_slider = plt.axes([0.25, 0.1, 0.50, 0.03])
slider_fuerza = Slider(ax_slider, 'Fuerza inicial', 0.0, 10.0, valinit=5.0, valstep=0.1)

# Inicialización de variables de simulación
posiciones = posiciones_base.copy()
velocidades = np.zeros_like(posiciones)
indice_central = (n // 2) * n + (n // 2)
centro = posiciones[indice_central]
amplitudes = []

# Perturbación inicial configurable por slider
def aplicar_perturbacion(fuerza):
    global posiciones, velocidades, amplitudes
    posiciones = posiciones_base.copy()
    velocidades = np.zeros_like(posiciones)
    amplitudes = []
    for i in range(n_particulas):
        dist = np.linalg.norm(posiciones[i] - centro)
        if dist < 1.5:
            velocidades[i][1] += np.exp(-dist**2) * fuerza

aplicar_perturbacion(slider_fuerza.val)

# Elementos visuales
sc = ax1.scatter(posiciones[:, 0], posiciones[:, 1], c='blue', s=10)
ax1.set_xlim(0, (n - 1) * espaciado)
ax1.set_ylim(-2, (n - 1) * espaciado + 1)
ax1.set_title("Simulación de Onda")

line_amp, = ax2.plot([], [], color='red')
ax2.set_xlim(0, 150)
ax2.set_ylim(-10, 10)
ax2.set_title("Amplitud en el Centro vs Tiempo")
ax2.set_xlabel("Tiempo (frames)")
ax2.set_ylabel("Desplazamiento Y")

# Lógica de simulación
def paso_simulacion():
    global posiciones, velocidades
    aceleraciones = np.zeros_like(posiciones)
    for i in range(n_particulas):
        for j in vecinos[i]:
            delta = posiciones[j] - posiciones[i]
            dist = np.linalg.norm(delta)
            if dist > 0:
                direccion = delta / dist
                fuerza = k * (dist - espaciado)
                aceleraciones[i] += fuerza * direccion / masa
    velocidades += aceleraciones * dt
    velocidades *= (1 - damping)
    posiciones += velocidades * dt

# Animación
def actualizar(frame):
    paso_simulacion()
    sc.set_offsets(posiciones)
    amp = posiciones[indice_central][1] - centro[1]
    amplitudes.append(amp)
    line_amp.set_data(np.arange(len(amplitudes)), amplitudes)
    ax2.set_xlim(max(0, len(amplitudes)-150), len(amplitudes))
    return sc, line_amp

def reiniciar(val):
    aplicar_perturbacion(slider_fuerza.val)

slider_fuerza.on_changed(reiniciar)

ani = animation.FuncAnimation(fig, actualizar, frames=300, interval=50, blit=True)
plt.show()
