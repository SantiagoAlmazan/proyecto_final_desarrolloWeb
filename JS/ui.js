export function setActiveMenu(hash) {
document.querySelectorAll(".menu a").forEach(a => a.classList.remove("active"));
const active = document.querySelector(`a[href='${hash}']`);
if (active) active.classList.add("active");
}