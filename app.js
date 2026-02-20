const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3001;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (tu index.html está en la raíz)
//app.use(express.static('public'));

// Config MySQL (XAMPP)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cursos_db',
};


// ======================
// READ - Obtener Cursos
// ======================
app.get('/api/cursos', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      `SELECT id, nombre_curso, nombre_instructor, numero_horas, 
              nivel, fecha_inicio, costo 
       FROM cursos 
       ORDER BY id DESC`
    );
    await conn.end();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});


// ======================
// CREATE - Registrar Curso
// ======================
app.post('/api/cursos', async (req, res) => {
  try {
    const { nombre_curso, nombre_instructor, numero_horas, nivel, fecha_inicio, costo } = req.body;

    if (!nombre_curso || !nombre_instructor || !numero_horas || !nivel || !fecha_inicio || !costo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const conn = await mysql.createConnection(dbConfig);

    const [result] = await conn.execute(
      `INSERT INTO cursos 
       (nombre_curso, nombre_instructor, numero_horas, nivel, fecha_inicio, costo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre_curso.trim(),
        nombre_instructor.trim(),
        numero_horas,
        nivel,
        fecha_inicio,
        costo
      ]
    );

    await conn.end();

    res.json({ ok: true, id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar curso' });
  }
});


// ======================
// UPDATE - Actualizar Curso
// ======================
app.put('/api/cursos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_curso, nombre_instructor, numero_horas, nivel, fecha_inicio, costo } = req.body;

    if (!nombre_curso || !nombre_instructor || !numero_horas || !nivel || !fecha_inicio || !costo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const conn = await mysql.createConnection(dbConfig);

    const [result] = await conn.execute(
      `UPDATE cursos 
       SET nombre_curso = ?, 
           nombre_instructor = ?, 
           numero_horas = ?, 
           nivel = ?, 
           fecha_inicio = ?, 
           costo = ?
       WHERE id = ?`,
      [
        nombre_curso.trim(),
        nombre_instructor.trim(),
        numero_horas,
        nivel,
        fecha_inicio,
        costo,
        id
      ]
    );

    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
});


// ======================
// DELETE - Eliminar Curso
// ======================
app.delete('/api/cursos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await mysql.createConnection(dbConfig);

    const [result] = await conn.execute(
      'DELETE FROM cursos WHERE id = ?',
      [id]
    );

    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
});


// ======================
// Servidor + abrir navegador
// ======================
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('Servidor corriendo en ' + url);
  abrirNavegador(url);
});

// Función para abrir navegador
async function abrirNavegador(url) {
  try {
    const open = (await import('open')).default;
    await open(url);
  } catch (err) {
    console.error('No se pudo abrir el navegador:', err.message);
  }

}
