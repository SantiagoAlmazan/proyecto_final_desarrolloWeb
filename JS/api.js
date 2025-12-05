const API_URL = "http://localhost:3000"; 

// Pacientes
export const getPacientes = () => fetch(`${API_URL}/pacientes`).then(r => r.json());
export const getPacienteById = (id) => fetch(`${API_URL}/pacientes/${id}`).then(r => r.json());
export const createPaciente = (data) =>
    fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(r => r.json());

// Doctores
export const getDoctores = () => fetch(`${API_URL}/doctores`).then(r => r.json());

// Citas
export const getCitas = () => fetch(`${API_URL}/citas`).then(r => r.json());
