document.addEventListener("DOMContentLoaded", cargarCursos);

const form = document.getElementById("formCurso");

let editando = false;
let cursoId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre_curso: document.getElementById("nombreCurso").value,
    nombre_instructor: document.getElementById("nombreInstructor").value,
    numero_horas: document.getElementById("numeroHoras").value,
    nivel: document.getElementById("nivel").value,
    fecha_inicio: document.getElementById("fechaInicio").value,
    costo: document.getElementById("costoCurso").value,
  };

  if (!editando) {
    await fetch("/api/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    toastr.success("Curso registrado correctamente");
  } else {
    await fetch(`/api/cursos/${cursoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    toastr.info("Curso actualizado correctamente");
    editando = false;
    cursoId = null;
  }

  form.reset();
  cargarCursos();
});

async function cargarCursos() {
  const res = await fetch("/api/cursos");
  const cursos = await res.json();

  const tabla = document.getElementById("tablaCursos");
  tabla.innerHTML = "";

  cursos.forEach((curso) => {
    tabla.innerHTML += `
      <tr>
        <td>${curso.nombre_curso}</td>
        <td>${curso.nombre_instructor}</td>
        <td>${curso.numero_horas}</td>
        <td>${curso.nivel}</td>
        <td>${curso.fecha_inicio}</td>
        <td>$${curso.costo}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarCurso(${curso.id}, '${curso.nombre_curso}', '${curso.nombre_instructor}', ${curso.numero_horas}, '${curso.nivel}', '${curso.fecha_inicio}', ${curso.costo})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarCurso(${curso.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

async function eliminarCurso(id) {
  await fetch(`/api/cursos/${id}`, { method: "DELETE" });
  toastr.error("Curso eliminado correctamente");
  cargarCursos();
}

function editarCurso(id, nombre, instructor, horas, nivel, fecha, costo) {
  document.getElementById("nombreCurso").value = nombre;
  document.getElementById("nombreInstructor").value = instructor;
  document.getElementById("numeroHoras").value = horas;
  document.getElementById("nivel").value = nivel;
  document.getElementById("fechaInicio").value = fecha;
  document.getElementById("costoCurso").value = costo;

  editando = true;
  cursoId = id;
}