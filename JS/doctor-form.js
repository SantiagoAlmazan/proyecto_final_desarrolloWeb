const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("id");

    if (doctorId) {
        document.getElementById("tituloForm").textContent = "Editar Doctor";
        cargarDoctor(doctorId);
    }

    document.getElementById("doctorForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        guardarDoctor(doctorId);
    });
});

async function cargarDoctor(id) {
    const res = await fetch(`${API_URL}/doctores`);
    const doctores = await res.json();
    const doctor = doctores.find(d => d.id === id);
    if (!doctor) return alert("Doctor no encontrado");

    document.getElementById("nombre").value = doctor.nombre;
    document.getElementById("especialidad").value = doctor.especialidad;
    document.getElementById("horarioInicio").value = doctor.horarioInicio;
    document.getElementById("horarioFin").value = doctor.horarioFin;

    doctor.diasDisponibles.forEach(dia => {
        const checkbox = document.querySelector(`input[name="dias"][value="${dia}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

async function guardarDoctor(id) {
    const nombre = document.getElementById("nombre").value.trim();
    const especialidad = document.getElementById("especialidad").value.trim();
    const horarioInicio = document.getElementById("horarioInicio").value;
    const horarioFin = document.getElementById("horarioFin").value;
    const diasDisponibles = Array.from(document.querySelectorAll("input[name='dias']:checked"))
                               .map(cb => cb.value);

    if (horarioInicio >= horarioFin) return alert("Horario inicio debe ser menor que horario fin");
    if (diasDisponibles.length === 0) return alert("Seleccione al menos un día disponible");

    const body = { nombre, especialidad, horarioInicio, horarioFin, diasDisponibles };

    try {
        let res;
        if (id) {
            res = await fetch(`${API_URL}/doctores/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } else {
            res = await fetch(`${API_URL}/doctores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }

        if (!res.ok) {
            const err = await res.json();
            return alert("Error: " + err.error);
        }

        alert("Doctor guardado correctamente");
        window.location.href = "doctores.html";

    } catch (err) {
        console.error("Error guardando doctor:", err);
    }
}
