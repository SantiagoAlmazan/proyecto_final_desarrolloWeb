const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get("id");

    if (pacienteId) {
        // Modo edición
        document.getElementById("tituloForm").textContent = "Editar Paciente";
        cargarPaciente(pacienteId);
    }

    document.getElementById("pacienteForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        guardarPaciente(pacienteId);
    });
});

// =========================
// Cargar paciente para editar
// =========================
async function cargarPaciente(id) {
    try {
        const res = await fetch(`${API_URL}/pacientes`);
        const pacientes = await res.json();
        const paciente = pacientes.find(p => p.id === id);
        if (!paciente) return alert("Paciente no encontrado");

        document.getElementById("nombre").value = paciente.nombre;
        document.getElementById("edad").value = paciente.edad;
        document.getElementById("telefono").value = paciente.telefono;
        document.getElementById("email").value = paciente.email;
    } catch (err) {
        console.error("Error cargando paciente:", err);
    }
}

// =========================
// Guardar paciente (crear o editar)
// =========================
async function guardarPaciente(id) {
    const nombre = document.getElementById("nombre").value;
    const edad = parseInt(document.getElementById("edad").value);
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    const body = { nombre, edad, telefono, email };

    try {
        let res;
        if (id) {
            // Editar
            res = await fetch(`${API_URL}/pacientes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } else {
            // Crear
            res = await fetch(`${API_URL}/pacientes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }

        if (!res.ok) {
            const error = await res.json();
            return alert("Error: " + error.error);
        }

        alert("Paciente guardado correctamente");
        window.location.href = "pacientes.html";

    } catch (err) {
        console.error("Error guardando paciente:", err);
    }
}
