const API = "http://localhost:3000";

let pacientes = [];
let doctores = [];
let especialidades = [];

document.addEventListener("DOMContentLoaded", async () => {
  await cargarPacientes();
  await cargarDoctores();
  llenarEspecialidades();

  document.getElementById("especialidad").addEventListener("change", filtrarDoctores);
});

async function cargarPacientes() {
  const res = await fetch(`${API}/pacientes`);
  pacientes = await res.json();

  const sel = document.getElementById("pacienteId");
  pacientes.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nombre} (${p.id})`;
    sel.appendChild(option);
  });
}

async function cargarDoctores() {
  const res = await fetch(`${API}/doctores`);
  doctores = await res.json();
}

function llenarEspecialidades() {
  especialidades = [...new Set(doctores.map(d => d.especialidad))];

  const sel = document.getElementById("especialidad");
  sel.innerHTML = "<option value=''>Seleccione</option>";
  especialidades.forEach(e => {
    const option = document.createElement("option");
    option.value = e;
    option.textContent = e;
    sel.appendChild(option);
  });
}

function filtrarDoctores() {
  const especialidad = document.getElementById("especialidad").value;
  const sel = document.getElementById("doctorId");
  sel.innerHTML = "<option value=''>Seleccione</option>";

  doctores.filter(d => d.especialidad === especialidad).forEach(d => {
    const option = document.createElement("option");
    option.value = d.id;
    option.textContent = d.nombre;
    sel.appendChild(option);
  });
}

document.getElementById("formCita").addEventListener("submit", async e => {
  e.preventDefault();

  const pacienteId = document.getElementById("pacienteId").value;
  const doctorId = document.getElementById("doctorId").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value;

  // Validaciones
  if (!pacienteId || !doctorId || !fecha || !hora || !motivo) {
    alert("Todos los campos son obligatorios");
    return;
  }

  const fechaObj = new Date(fecha);
  if (fechaObj <= new Date()) {
    alert("La fecha debe ser futura");
    return;
  }

  const doctor = doctores.find(d => d.id === doctorId);
  const diasSemana = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const dia = diasSemana[fechaObj.getDay()];
  if (!doctor.diasDisponibles.includes(dia)) {
    alert(`El doctor no trabaja el día ${dia}`);
    return;
  }

  if (hora < doctor.horarioInicio || hora > doctor.horarioFin) {
    alert("Hora fuera del horario del doctor");
    return;
  }

  // Comprobar disponibilidad en tiempo real
  const resCitas = await fetch(`${API}/citas`);
  const citas = await resCitas.json();
  if (citas.find(c => c.doctorId === doctorId && c.fecha === fecha && c.hora === hora)) {
    alert("El doctor ya tiene una cita a esa hora");
    return;
  }

  // Guardar cita
  const res = await fetch(`${API}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pacienteId, doctorId, fecha, hora, motivo })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Cita guardada");
    window.location.href = "citas.html";
  } else {
    alert(data.error || "Error guardando la cita");
  }
});
