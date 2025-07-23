document.addEventListener("DOMContentLoaded", () => {
  const btnAddObjetivo = document.getElementById("btnAddObjetivo");
  const tplObjetivo = document.getElementById("tplObjetivo");
  const contenedorObjetivos = document.getElementById("contenedor-objetivos");

  btnAddObjetivo.addEventListener("click", () => {
    const clone = tplObjetivo.content.cloneNode(true);
    contenedorObjetivos.appendChild(clone);
  });

  const btnAddProfesor = document.getElementById("btnAddProfesor");
  const tplProfesor = document.getElementById("tplProfesor");
  const contenedorProfesores = document.getElementById("contenedor-profesores");

  btnAddProfesor.addEventListener("click", () => {
    const clone = tplProfesor.content.cloneNode(true);
    contenedorProfesores.appendChild(clone);
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("boton-eliminar")) {
      e.target.parentElement.remove();
    }
  });
});
