// ============================================================
// API de Gestión de Citas Médicas (CommonJS)
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Crear servidor
const app = express();

// Middlewares base
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

// Servir frontend desde carpeta "public"
app.use(express.static('public'));

// Helpers JSON
const dataPath = path.join(process.cwd(), 'data');
const readJSON = (file) =>
  JSON.parse(fs.readFileSync(path.join(dataPath, file)));
const writeJSON = (file, data) =>
  fs.writeFileSync(path.join(dataPath, file), JSON.stringify(data, null, 2));


app.get('/api/pacientes', (req, res) => {
  res.json([
    { id: 1, nombre: "Luis Pérez" },
    { id: 2, nombre: "Ana Gómez" }
  ]);
});
// GET todos los pacientes
app.get('/pacientes', (req, res) => {
  const pacientes = readJSON('pacientes.json'); // tu helper readJSON
  res.json(pacientes);
});

// DELETE paciente
app.delete('/pacientes/:id', (req, res) => {
  const pacientes = readJSON('pacientes.json');
  const { id } = req.params;
  const index = pacientes.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Paciente no encontrado' });

  pacientes.splice(index, 1);
  writeJSON('pacientes.json', pacientes);
  res.json({ mensaje: 'Paciente eliminado' });
});

// ============================================================
// PACIENTES
// ============================================================
app.post('/pacientes', (req, res) => {
  const pacientes = readJSON('pacientes.json');
  const { nombre, edad, telefono, email } = req.body;

  if (!telefono) return res.status(400).json({ error: 'Teléfono obligatorio' });
  if (edad <= 0) return res.status(400).json({ error: 'Edad inválida' });
  if (pacientes.find(p => p.email === email))
    return res.status(400).json({ error: 'Email ya registrado' });

  const nuevo = {
    id: `P${(pacientes.length + 1).toString().padStart(3, '0')}`,
    nombre,
    edad,
    telefono,
    email,
    fechaRegistro: new Date().toISOString().split('T')[0]
  };

  pacientes.push(nuevo);
  writeJSON('pacientes.json', pacientes);

  res.status(201).json(nuevo);
});

app.get('/pacientes', (req, res) =>
  res.json(readJSON('pacientes.json'))
);
app.put('/pacientes/:id', (req, res) => {
  const pacientes = readJSON('pacientes.json');
  const { id } = req.params;
  const { nombre, edad, telefono, email } = req.body;

  const index = pacientes.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Paciente no encontrado" });

  // Validaciones
  if (!telefono) return res.status(400).json({ error: 'Teléfono obligatorio' });
  if (edad <= 0) return res.status(400).json({ error: 'Edad inválida' });
  if (pacientes.find(p => p.email === email && p.id !== id))
    return res.status(400).json({ error: 'Email ya registrado' });

  pacientes[index] = { ...pacientes[index], nombre, edad, telefono, email };

  writeJSON('pacientes.json', pacientes);
  res.json(pacientes[index]);
});



// DELETE paciente
app.delete('/pacientes/:id', (req, res) => {
    const pacientes = readJSON('pacientes.json');
    const index = pacientes.findIndex(p => p.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: "Paciente no encontrado" });

    pacientes.splice(index, 1);
    writeJSON('pacientes.json', pacientes);

    res.json({ msg: "Paciente eliminado" });
});


// ============================================================
// DOCTORES
// ============================================================
app.post('/doctores', (req, res) => {
  const doctores = readJSON('doctores.json');
  const { nombre, especialidad, horarioInicio, horarioFin, diasDisponibles } = req.body;

  if (!nombre || !especialidad)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  if (horarioInicio >= horarioFin)
    return res.status(400).json({ error: 'Horario inválido' });

  if (!diasDisponibles?.length)
    return res.status(400).json({ error: 'Debe tener días disponibles' });

  if (doctores.find(d => d.nombre === nombre && d.especialidad === especialidad))
    return res.status(400).json({ error: 'Doctor duplicado' });

  const nuevo = {
    id: `D${(doctores.length + 1).toString().padStart(3, '0')}`,
    nombre,
    especialidad,
    horarioInicio,
    horarioFin,
    diasDisponibles
  };

  doctores.push(nuevo);
  writeJSON('doctores.json', doctores);

  res.status(201).json(nuevo);
});

app.get('/doctores', (req, res) =>
  res.json(readJSON('doctores.json'))
);

// Estadísticas por especialidad
app.get('/estadisticas/especialidades', (req, res) => {
    const doctores = readJSON('doctores.json');

    // Contar doctores por especialidad
    const conteo = {};

    doctores.forEach(doc => {
        if (!conteo[doc.especialidad]) {
            conteo[doc.especialidad] = 0;
        }
        conteo[doc.especialidad]++;
    });

    // Formato compatible con Chart.js
    const resultado = Object.entries(conteo).map(([especialidad, total]) => ({
        especialidad,
        total
    }));

    res.json(resultado);
});


// ============================================================
// CITAS
// ============================================================
app.post('/citas', (req, res) => {
  const citas = readJSON('citas.json');
  const { pacienteId, doctorId, fecha, hora, motivo } = req.body;

  if (!pacienteId || !doctorId || !fecha || !hora || !motivo)
    return res.status(400).json({ error: 'Faltan campos' });

  const nuevo = {
    id: `C${(citas.length + 1).toString().padStart(3,'0')}`,
    pacienteId,
    doctorId,
    fecha,
    hora,
    motivo,
    estado: 'programada'
  };

  citas.push(nuevo);
  writeJSON('citas.json', citas);

  res.status(201).json(nuevo);
});

// Citas próximas en 24 horas
app.get('/notificaciones/proximas', (req, res) => {
    const citas = readJSON('citas.json');

    const ahora = new Date();
    const limite = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const proximas = citas.filter(c => {
        const fechaHora = new Date(`${c.fecha}T${c.hora}`);
        return fechaHora >= ahora && fechaHora <= limite;
    });

    res.json(proximas);
});


app.put('/citas/:id', (req, res) => {
  const citas = readJSON('citas.json');
  const doctores = readJSON('doctores.json');
  const pacientes = readJSON('pacientes.json');

  const { id } = req.params;
  const { pacienteId, doctorId, fecha, hora, motivo, estado } = req.body;

  const cita = citas.find(c => c.id === id);
  if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

  const paciente = pacientes.find(p => p.id === pacienteId);
  const doctor = doctores.find(d => d.id === doctorId);

  if (!paciente) return res.status(400).json({ error: 'Paciente no existe' });
  if (!doctor) return res.status(400).json({ error: 'Doctor no existe' });

  const fechaCita = new Date(fecha);
  if (fechaCita <= new Date())
    return res.status(400).json({ error: 'Fecha debe ser futura' });

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dia = diasSemana[fechaCita.getDay()];

  if (!doctor.diasDisponibles.includes(dia))
    return res.status(400).json({ error: 'Doctor no trabaja ese día' });

  if (hora < doctor.horarioInicio || hora > doctor.horarioFin)
    return res.status(400).json({ error: 'Hora fuera del horario del doctor' });

  // evitar choque con otras citas del mismo doctor
  if (citas.find(c => c.id !== id && c.doctorId === doctorId && c.fecha === fecha && c.hora === hora))
    return res.status(400).json({ error: 'Doctor ocupado en esa hora' });

  cita.pacienteId = pacienteId;
  cita.doctorId = doctorId;
  cita.fecha = fecha;
  cita.hora = hora;
  cita.motivo = motivo;
  cita.estado = estado || cita.estado;

  writeJSON('citas.json', citas);

  res.json(cita);
});

//get citas
app.get('/citas', (req, res) => {
  const citas = readJSON('citas.json');
  res.json(citas);
});

// Obtener citas de un paciente específico
app.get('/pacientes/:id/citas', (req, res) => {
  const pacienteId = req.params.id;
  const citas = readJSON('citas.json');
  const pacientes = readJSON('pacientes.json');
  const doctores = readJSON('doctores.json');

  const paciente = pacientes.find(p => p.id === pacienteId);
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

  const historial = citas
    .filter(c => c.pacienteId === pacienteId)
    .map(c => {
      const doctor = doctores.find(d => d.id === c.doctorId);
      return {
        ...c,
        doctorNombre: doctor ? doctor.nombre : 'Desconocido',
        doctorEspecialidad: doctor ? doctor.especialidad : 'Desconocido'
      };
    });

  res.json(historial);
});



// Cancelar cita
app.put('/citas/:id/cancelar', (req, res) => {
  const citas = readJSON('citas.json');
  const { id } = req.params;

  const index = citas.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Cita no encontrada" });

  if (citas[index].estado !== "programada")
    return res.status(400).json({ error: "Sólo se pueden cancelar citas programadas" });

  citas[index].estado = "cancelada";
  writeJSON('citas.json', citas);

  res.json(citas[index]);
});

app.get('/notificaciones/proximas', (req, res) => {
    const citas = readJSON('citas.json');

    const ahora = new Date();
    const limite = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const proximas = citas.filter(c => {
        const fechaHora = new Date(`${c.fecha}T${c.hora}`);
        return fechaHora >= ahora && fechaHora <= limite;
    });

    res.json(proximas);
});




app.get('/estadisticas/citas-mes', (req, res) => {
    const citas = readJSON('citas.json');

    const conteo = {}; // { "2025-01": 3, "2025-02": 7 }

    citas.forEach(c => {
        const fecha = new Date(c.fecha);
        const clave = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}`;

        if (!conteo[clave]) conteo[clave] = 0;
        conteo[clave]++;
    });

    const resultado = Object.entries(conteo).map(([mes, total]) => ({
        mes,
        total
    }));

    res.json(resultado);
});


app.delete('/citas/:id', (req, res) => {
  let citas = readJSON('citas.json');
  const { id } = req.params;

  const existe = citas.some(c => c.id === id);
  if (!existe) return res.status(404).json({ error: 'Cita no encontrada' });

  citas = citas.filter(c => c.id !== id);
  writeJSON('citas.json', citas);

  res.json({ message: 'Cita eliminada correctamente' });
});



// ============================================================
// SERVIDOR FINAL
// ============================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
});
