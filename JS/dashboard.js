import { getEstadisticas } from "./stats.js";

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
});

function renderDashboard() {
  const stats = getEstadisticas();

  renderCards(stats);
  renderNotificaciones(stats.proximas24h);
  renderGraficaCitasPorMes(stats.citasPorMes);
  renderGraficaEspecialidades(stats.especialidadesOrdenadas);
  renderTasaCancelacion(stats.tasaCancelacion);
}

/* ===========================================
                CARDS PRINCIPALES
=========================================== */
function renderCards(stats) {
  document.getElementById("cardPacientes").textContent = stats.totalPacientes;
  document.getElementById("cardDoctores").textContent = stats.totalDoctores;
  document.getElementById("cardCitasHoy").textContent = stats.citasHoy.length;
}

/* ===========================================
                NOTIFICACIONES
=========================================== */
function renderNotificaciones(citas) {
  const contenedor = document.getElementById("notificaciones");
  contenedor.innerHTML = "";

  if (citas.length === 0) {
    contenedor.innerHTML = "<p>No hay citas próximas.</p>";
    return;
  }

  citas.forEach(c => {
    const div = document.createElement("div");
    div.className = "notif-item";

    div.innerHTML = `
      <strong>${c.fecha} ${c.hora}</strong>
      – Paciente: ${c.pacienteNombre}
      – Doctor: ${c.doctorNombre}
      ${esUrgente(c) ? "<span class='urgente'>URGENTE</span>" : ""}
    `;

    contenedor.appendChild(div);
  });

  // Badge superior
  const badge = document.getElementById("badgeNotificaciones");
  if (badge) badge.textContent = citas.length;
}

function esUrgente(cita) {
  const fecha = new Date(`${cita.fecha}T${cita.hora}`);
  return (fecha - Date.now()) <= 60 * 60 * 1000; // < 1 hora
}

/* ===========================================
      GRÁFICA: CITAS POR MES (Chart.js)
=========================================== */
function renderGraficaCitasPorMes(data) {
  const ctx = document.getElementById("chartCitasPorMes");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Citas por mes",
          data: Object.values(data),
        }
      ]
    }
  });
}

/* ===========================================
      GRÁFICA: ESPECIALIDADES (Chart.js)
=========================================== */
function renderGraficaEspecialidades(lista) {
  const ctx = document.getElementById("chartEspecialidades");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: lista.map(e => e.especialidad),
      datasets: [
        {
          data: lista.map(e => e.total)
        }
      ]
    }
  });
}

/* ===========================================
            TASA DE CANCELACIÓN
=========================================== */
function renderTasaCancelacion(tasa) {
  const el = document.getElementById("tasaCancelacion");
  el.textContent = `${tasa.toFixed(1)}%`;
}
