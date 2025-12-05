const API_URL = "http://localhost:3000";

// =========================
// Inicialización
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  await cargarPacientes();

  // Configurar buscador
  const buscador = document.getElementById("buscarPaciente");
  if (buscador) {
    buscador.addEventListener("input", filtrarPacientes);
  }
});

// =========================
// Cargar pacientes desde API
// =========================
async function cargarPacientes() {
  try {
    const res = await fetch(`${API_URL}/pacientes`);
    const data = await res.json();

    window.listaPacientes = data; // Guardar en memoria para el buscador
    renderPacientes(data);
  } catch (err) {
    console.error("Error cargando pacientes:", err);
  }
}

// =========================
// Render tabla de pacientes
// =========================
function renderPacientes(pacientes) {
  const tbody = document.getElementById("tablaPacientesBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (pacientes.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="8" style="text-align:center; padding:20px;">No hay pacientes registrados</td></tr>
    `;
    return;
  }

  pacientes.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.edad}</td>
      <td>${p.telefono}</td>
      <td>${p.email}</td>
      <td>${p.fechaRegistro}</td>
      <td class="acciones">
        <button onclick="verHistorial('${p.id}')">Historial</button>
        <button onclick="editarPaciente('${p.id}')">Editar</button>
        <button onclick="eliminarPaciente('${p.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =========================
// Buscador
// =========================
function filtrarPacientes() {
  const texto = document.getElementById("buscarPaciente").value.toLowerCase();

  const filtrados = window.listaPacientes.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.id.toLowerCase().includes(texto)
  );

  renderPacientes(filtrados);
}

// =========================
// Acciones
// =========================
function verHistorial(id) {
  window.location.href = `paciente-historial.html?id=${id}`;
}

function editarPaciente(id) {
  window.location.href = `paciente-form.html?id=${id}`;
}

async function eliminarPaciente(id) {
  if (!confirm("¿Deseas eliminar este paciente?")) return;

  try {
    const res = await fetch(`${API_URL}/pacientes/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.mensaje || "Paciente eliminado");

    // Recargar tabla
    await cargarPacientes();
  } catch (err) {
    console.error("Error eliminando paciente:", err);
    alert("Error eliminando paciente");
  }
}
