const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("id");
    if (!doctorId) return alert("Doctor no especificado");

    window.doctorId = doctorId;

    document.getElementById("filtroFecha").addEventListener("change", cargarAgenda);
    await cargarDoctorInfo(doctorId);
    await cargarAgenda();
});

async function cargarDoctorInfo(id) {
    try {
        const res = await fetch(`${API_URL}/doctores`);
        const doctores = await res.json();
        const doctor = doctores.find(d => d.id === id);
        if (!doctor) return alert("Doctor no encontrado");

        document.getElementById("doctorNombre").textContent = `Agenda de ${doctor.nombre} (${doctor.especialidad})`;
        window.doctorHorario = { inicio: doctor.horarioInicio, fin: doctor.horarioFin };
    } catch (err) {
        console.error(err);
    }
}

async function cargarAgenda() {
    try {
        const filtro = document.getElementById("filtroFecha").value;
        const res = await fetch(`${API_URL}/citas`);
        const citas = await res.json();

        // Filtrar por doctor
        let citasDoctor = citas.filter(c => c.doctorId === window.doctorId);

        // Filtrar por fecha
        const hoy = new Date();
        if (filtro === "hoy") {
            citasDoctor = citasDoctor.filter(c => c.fecha === hoy.toISOString().split("T")[0]);
        } else if (filtro === "semana") {
            const finSemana = new Date();
            finSemana.setDate(hoy.getDate() + 7);
            citasDoctor = citasDoctor.filter(c => {
                const fechaC = new Date(c.fecha);
                return fechaC >= hoy && fechaC <= finSemana;
            });
        } else if (filtro === "proximos7") {
            const fin7 = new Date();
            fin7.setDate(hoy.getDate() + 7);
            citasDoctor = citasDoctor.filter(c => {
                const fechaC = new Date(c.fecha);
                return fechaC >= hoy && fechaC <= fin7;
            });
        }

        renderCitas(citasDoctor);
    } catch (err) {
        console.error("Error cargando agenda:", err);
    }
    renderCitas(citasDoctor);
renderSlotsChart(citasDoctor);

}

function renderCitas(citas) {
    const tbody = document.getElementById("tablaCitasBody");
    tbody.innerHTML = "";

    if (citas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay citas</td></tr>`;
        document.getElementById("totalProgramadas").textContent = 0;
        document.getElementById("totalCanceladas").textContent = 0;
        return;
    }

    let programadas = 0, canceladas = 0;

    citas.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.fecha}</td>
            <td>${c.hora}</td>
            <td>${c.pacienteId}</td>
            <td>${c.motivo}</td>
            <td>${c.estado}</td>
        `;
        tbody.appendChild(tr);

        if (c.estado === "programada") programadas++;
        if (c.estado === "cancelada") canceladas++;
    });
   function calcularSlots(citas) {
    // Suponemos slots por hora entre horarioInicio y horarioFin
    const [hInicio, mInicio] = window.doctorHorario.inicio.split(":").map(Number);
    const [hFin, mFin] = window.doctorHorario.fin.split(":").map(Number);

    const totalSlots = (hFin - hInicio) * 1; // slots por hora, ajustar si quieres fracciones
    const ocupados = citas.filter(c => c.estado === "programada").length;
    const libres = totalSlots - ocupados;

    return { libres: Math.max(0, libres), ocupados };
}

function renderSlotsChart(citas) {
    const ctx = document.getElementById("slotsChart").getContext("2d");
    const { libres, ocupados } = calcularSlots(citas);

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Libres", "Ocupados"],
            datasets: [{
                data: [libres, ocupados],
                backgroundColor: ["#4CAF50", "#F44336"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}



    document.getElementById("totalProgramadas").textContent = programadas;
    document.getElementById("totalCanceladas").textContent = canceladas;
}
