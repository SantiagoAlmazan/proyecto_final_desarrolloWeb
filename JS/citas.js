const API = "http://localhost:3000";

let citas = [];
let doctores = [];
let pacientes = [];

document.addEventListener("DOMContentLoaded", async () => {
  await cargarDoctores();
  await cargarPacientes();
  await cargarCitas();

  document.getElementById("filtroFecha").addEventListener("change", filtrarCitas);
  document.getElementById("filtroEstado").addEventListener("change", filtrarCitas);
  document.getElementById("filtroDoctor").addEventListener("change", filtrarCitas);
});

async function cargarCitas() {
  const res = await fetch(`${API}/citas`);
  citas = await res.json();
  renderCitas(citas);
}

async function cargarDoctores() {
  const res = await fetch(`${API}/doctores`);
  doctores = await res.json();

  const filtroDoctor = document.getElementById("filtroDoctor");
  doctores.forEach(d => {
    const option = document.createElement("option");
    option.value = d.id;
    option.textContent = `${d.nombre} (${d.especialidad})`;
    filtroDoctor.appendChild(option);
  });
}

async function cargarPacientes() {
  const res = await fetch(`${API}/pacientes`);
  pacientes = await res.json();
}

function renderCitas(lista) {
  const tbody = document.getElementById("tablaCitasBody");
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center">No hay citas</td></tr>`;
    return;
  }

  lista.forEach(c => {
    const paciente = pacientes.find(p => p.id === c.pacienteId);
    const doctor = doctores.find(d => d.id === c.doctorId);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.fecha}</td>
      <td>${c.hora}</td>
      <td>${paciente ? paciente.nombre : c.pacienteId}</td>
      <td>${doctor ? doctor.nombre : c.doctorId}</td>
      <td>${doctor ? doctor.especialidad : ""}</td>
      <td>${c.motivo}</td>
      <td>${c.estado}</td>
      <td>
        <button onclick="verDetalle('${c.id}')">Ver</button>
        ${c.estado === "programada" ? `<button onclick="cancelarCita('${c.id}')">Cancelar</button>` : ""}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filtrarCitas() {
  const fecha = document.getElementById("filtroFecha").value;
  const estado = document.getElementById("filtroEstado").value;
  const doctorId = document.getElementById("filtroDoctor").value;

  const filtradas = citas.filter(c => {
    return (!fecha || c.fecha === fecha) &&
           (!estado || c.estado === estado) &&
           (!doctorId || c.doctorId === doctorId);
  });

  renderCitas(filtradas);
}

function verDetalle(id) {
  window.location.href = `cita-detalle.html?id=${id}`;
}

async function cancelarCita(id) {
  if (!confirm("¿Está seguro de cancelar esta cita?")) return;

  const res = await fetch(`${API}/citas/${id}/cancelar`, { method: "PUT" });
  if (res.ok) {
    alert("Cita cancelada");
    cargarCitas();
  } else {
    alert("Error cancelando la cita");
  }
}
