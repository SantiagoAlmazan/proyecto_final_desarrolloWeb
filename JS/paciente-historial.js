const API = "http://localhost:3000";

// Tomamos el id del paciente desde query string
const params = new URLSearchParams(window.location.search);
const pacienteId = params.get('id');

async function cargarHistorial() {
  try {
    const resPaciente = await fetch(`${API}/pacientes`);
    const pacientes = await resPaciente.json();
    const paciente = pacientes.find(p => p.id === pacienteId);

    if (!paciente) {
      document.getElementById("pacienteNombre").textContent = "Paciente no encontrado";
      return;
    }

    document.getElementById("pacienteNombre").textContent = `Paciente: ${paciente.nombre}`;

    const res = await fetch(`${API}/pacientes/${pacienteId}/citas`);
    const citas = await res.json();

    const tbody = document.getElementById("historialBody");
    tbody.innerHTML = "";

    if (citas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay citas registradas</td></tr>`;
      return;
    }

    citas.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${c.doctorNombre}</td>
        <td>${c.doctorEspecialidad}</td>
        <td>${c.motivo}</td>
        <td>${c.estado}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error cargando historial:", err);
  }
}

cargarHistorial();
