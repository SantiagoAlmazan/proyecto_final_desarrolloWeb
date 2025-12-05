const API = "http://localhost:3000";

// ===============================
// 1) Citas por mes
// ===============================
async function cargarCitasPorMes() {
  const res = await fetch(`${API}/citas`);
  const citas = await res.json();

  const conteo = {};

  citas.forEach(c => {
    const mes = c.fecha.slice(0, 7);
    conteo[mes] = (conteo[mes] || 0) + 1;
  });

  new Chart(document.getElementById("citasMesChart"), {
    type: "line",
    data: {
      labels: Object.keys(conteo),
      datasets: [{
        label: "Citas por Mes",
        data: Object.values(conteo)
      }]
    }
  });
}

// ===============================
// 2) Especialidades más solicitadas
// ===============================
async function cargarEspecialidades() {
  const res = await fetch(`${API}/estadisticas/especialidades`);
  const data = await res.json(); // ES UN ARREGLO

  new Chart(document.getElementById("especialidadesChart"), {
    type: "bar",
    data: {
      labels: data.map(e => e.especialidad),
      datasets: [{
        label: "Doctores Disponibles",
        data: data.map(e => e.total)
      }]
    }
  });
}

// ===============================
// 3) Tasa de cancelación
// ===============================
async function cargarCancelaciones() {
  const res = await fetch(`${API}/citas`);
  const citas = await res.json();

  const total = citas.length;
  const canceladas = citas.filter(c => c.estado === "cancelada").length;

  new Chart(document.getElementById("cancelacionesChart"), {
    type: "doughnut",
    data: {
      labels: ["Canceladas", "Activas"],
      datasets: [{
        data: [canceladas, total - canceladas]
      }]
    }
  });
}

// ===============================
// 4) Citas próximas 24h
// ===============================


async function cargarCitasProximas() {
  const res = await fetch(`${API}/notificaciones/proximas`);
  const citas = await res.json();

  const lista = document.getElementById("citasProximasLista");
  lista.innerHTML = "";

  if (citas.length === 0) {
    lista.innerHTML = "<li>No hay citas próximas.</li>";
    return;
  }

  citas.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.fecha} ${c.hora} — Paciente ${c.pacienteId} — Doctor ${c.doctorId}`;
    lista.appendChild(li);
  });
}

// Inicializar
cargarCitasPorMes();
cargarEspecialidades();
cargarCancelaciones();
cargarCitasProximas();
