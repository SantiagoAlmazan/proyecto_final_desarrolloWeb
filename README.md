# proyecto_final_desarrolloWeb



## 1. Decisiones de diseño tomadas

- **Arquitectura Cliente-Servidor:**  
  Se optó por un backend en Node.js con Express para manejar la API REST y un frontend en HTML/CSS/JS con fetch para consumir los datos.

- **Separación de responsabilidades:**  
  - **Backend:** gestión de datos, validaciones y endpoints REST.  
  - **Frontend:** visualización, interacciones de usuario y gráficos (Chart.js).

- **Almacenamiento en JSON:**  
  Para simplificar la gestión de datos durante el desarrollo, se usan archivos JSON (`pacientes.json`, `doctores.json`, `citas.json`) como base de datos.

- **Uso de Chart.js:**  
  Para las estadísticas del dashboard (citas por mes, especialidades, tasa de cancelación).

- **Validaciones tanto en cliente como servidor:**  
  - Fechas y horas válidas.  
  - Campos obligatorios.  
  - Evitar duplicados (pacientes por email, doctores por nombre y especialidad).

---

## 2. Flujos de usuario principales

### Dashboard
1. Usuario abre `dashboard.html`.  
2. Se cargan gráficos:  
   - Citas por mes.  
   - Especialidades más solicitadas.  
   - Tasa de cancelación.  
   - Citas próximas (24 horas).  

### Gestión de Pacientes
1. Usuario accede a `pacientes.html`.  
2. Visualiza tabla con pacientes (ID, Nombre, Edad, Teléfono, Email, Fecha de registro).  
3. Opciones:  
   - **Nuevo paciente:** abre `paciente-form.html`.  
   - **Editar paciente:** modifica información y se actualiza en la API.  
   - **Eliminar paciente:** remueve registro de JSON y refresca tabla.  
   - **Ver historial:** redirige a `paciente-historial.html`.

### Gestión de Doctores
1. Usuario accede a `doctores.html`.  
2. Tabla con doctores: Nombre, Especialidad, Horario, Días disponibles.  
3. Opciones:  
   - **Nuevo doctor / Editar doctor**.  
   - **Ver agenda:** muestra citas filtradas por doctor.

### Gestión de Citas
1. Usuario accede a `citas.html`.  
2. Tabla con todas las citas: ID, Fecha, Hora, Paciente, Doctor, Especialidad, Motivo, Estado.  
3. Opciones:  
   - **Nueva cita:** selección de paciente, especialidad, doctor, fecha, hora y motivo.  
   - Validaciones de disponibilidad y horarios.  
   - **Cancelar cita:** solo si está programada.

---

## 3. Endpoints consumidos y cómo se utilizan

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET    | `/pacientes` | Listar todos los pacientes para mostrar en tabla y dropdowns. |
| POST   | `/pacientes` | Crear un nuevo paciente desde el formulario. |
| PUT    | `/pacientes/:id` | Editar información de un paciente existente. |
| DELETE | `/pacientes/:id` | Eliminar paciente. |
| GET    | `/doctores` | Listar todos los doctores y cargar dropdowns. |
| POST   | `/doctores` | Crear un nuevo doctor. |
| PUT    | `/doctores/:id` | Editar doctor. |
| DELETE | `/doctores/:id` | Eliminar doctor. |
| GET    | `/citas` | Listar todas las citas para dashboard y gestión de citas. |
| POST   | `/citas` | Crear nueva cita, validando disponibilidad y horarios. |
| GET    | `/estadisticas/especialidades` | Obtener conteo de citas por especialidad para gráfico. |

---

## 4. Problemas encontrados y soluciones implementadas

1. **Fetch retornando HTML en lugar de JSON (Unexpected token '<')**  
   - Causa: URL del endpoint incorrecta o servidor Node no ejecutándose.  
   - Solución: confirmar URL y puerto, agregar endpoint GET `/citas` en `server.js`.

2. **Gráficos del dashboard no se mostraban**  
   - Causa: fetch fallido o `stats.js` no cargado correctamente.  
   - Solución: asegurar que el archivo JS esté en la ruta correcta (`JS/stats.js`) y que `API` apunte al puerto correcto.

3. **Edición y eliminación de pacientes no actualizaba JSON**  
   - Causa: métodos PUT y DELETE no implementados en el backend o frontend.  
   - Solución: agregar endpoints correspondientes y refrescar la tabla tras operación exitosa.

4. **Asignación incorrecta de paciente al crear cita**  
   - Causa: valor del dropdown de paciente no se enviaba correctamente en el cuerpo del POST.  
   - Solución: asegurar que el `select` de paciente tenga como `value` el `id` correcto y se use en `fetch`.

5. **Problemas de estilo en páginas distintas al dashboard**  
   - Solución: crear un `styles.css` común o etiquetas `<style>` con los mismos colores y layout que el dashboard.

