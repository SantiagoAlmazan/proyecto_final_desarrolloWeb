import { renderDashboard } from "./stats.js";
import { renderPacientes } from "./pacientes.js";
import { renderDoctores } from "./doctores.js";
import { renderCitas } from "./citas.js";
import { setActiveMenu } from "./ui.js";


const app = document.getElementById("app");


export function router() {
const hash = location.hash || "#dashboard";
setActiveMenu(hash);


if (hash === "#pacientes") return renderPacientes(app);
if (hash === "#doctores") return renderDoctores(app);
if (hash === "#citas") return renderCitas(app);
return renderDashboard(app);
}


window.addEventListener("hashchange", router);
window.addEventListener("load", router);