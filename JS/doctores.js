const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    await cargarDoctores();

    const filtro = document.getElementById("filtroEspecialidad");
    filtro.addEventListener("change", filtrarDoctores);
});

let listaDoctores = [];

async function cargarDoctores() {
    try {
        const res = await fetch(`${API_URL}/doctores`);
        listaDoctores = await res.json();

        renderDoctores(listaDoctores);
        cargarFiltroEspecialidades(listaDoctores);

    } catch (err) {
        console.error("Error cargando doctores:", err);
    }
}

function renderDoctores(doctores) {
    const tbody = document.getElementById("tablaDoctoresBody");
    tbody.innerHTML = "";

    if (doctores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No hay doctores registrados</td></tr>`;
        return;
    }

    doctores.forEach(d => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${d.nombre}</td>
            <td>${d.especialidad}</td>
            <td>${d.horarioInicio} - ${d.horarioFin}</td>
            <td>${d.diasDisponibles.join(", ")}</td>
            <td class="acciones">
                <button onclick="verAgenda('${d.id}')">Agenda</button>
                <button onclick="editarDoctor('${d.id}')">Editar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Filtrar por especialidad
function filtrarDoctores() {
    const valor = document.getElementById("filtroEspecialidad").value;
    const filtrados = valor ? listaDoctores.filter(d => d.especialidad === valor) : listaDoctores;
    renderDoctores(filtrados);
}

// Llenar filtro con especialidades únicas
function cargarFiltroEspecialidades(doctores) {
    const filtro = document.getElementById("filtroEspecialidad");
    const especialidades = [...new Set(doctores.map(d => d.especialidad))];

    especialidades.forEach(e => {
        const option = document.createElement("option");
        option.value = e;
        option.textContent = e;
        filtro.appendChild(option);
    });
}

// Acciones
function verAgenda(id) {
    window.location.href = `doctor-agenda.html?id=${id}`;
}

function editarDoctor(id) {
    window.location.href = `doctor-form.html?id=${id}`;
}
