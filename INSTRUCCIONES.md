# EduGuate - Versión HTML/JavaScript

## Configuración Inicial

### 1. Configurar Supabase

Antes de usar la aplicación, debes configurar las credenciales de Supabase:

1. Abre el archivo `js/config.js`
2. Reemplaza los valores de `SUPABASE_URL` y `SUPABASE_ANON_KEY` con tus credenciales reales de Supabase

\`\`\`javascript
const SUPABASE_URL = "https://tu-proyecto.supabase.co"
const SUPABASE_ANON_KEY = "tu-clave-anon"
\`\`\`

### 2. Ejecutar Scripts SQL

Debes ejecutar los scripts SQL en tu base de datos de Supabase en el siguiente orden:

1. `scripts/001_create_tables.sql` - Crea todas las tablas necesarias
2. `scripts/002_enable_rls.sql` - Habilita Row Level Security
3. `scripts/003_seed_sample_data.sql` - Inserta datos de ejemplo
4. `scripts/004_create_profile_trigger.sql` - Crea el trigger para perfiles

### 3. Abrir la Aplicación

Una vez configurado Supabase y ejecutados los scripts:

1. Abre `index.html` en tu navegador web
2. Regístrate como Estudiante o Tutor
3. Explora las diferentes funcionalidades

## Estructura de Archivos

### Páginas HTML

- `index.html` - Página de inicio pública
- `login.html` - Inicio de sesión
- `register.html` - Registro de usuarios
- `dashboard-student.html` - Panel de estudiante
- `dashboard-tutor.html` - Panel de tutor
- `subjects.html` - Lista de materias
- `subject-content.html` - Contenidos de una materia
- `evaluations.html` - Lista de evaluaciones
- `tutoring.html` - Gestión de tutorías
- `forum.html` - Foro comunitario

### Archivos JavaScript

- `js/config.js` - Configuración de Supabase
- `js/auth.js` - Funciones de autenticación

## Funcionalidades

### Para Estudiantes

- Ver contenidos educativos por materia y nivel
- Realizar evaluaciones interactivas
- Solicitar tutorías
- Participar en el foro comunitario
- Ver su progreso y estadísticas

### Para Tutores

- Gestionar solicitudes de tutoría
- Crear contenidos educativos
- Crear evaluaciones
- Programar sesiones de tutoría
- Participar en el foro comunitario

## Notas Importantes

- Esta es una versión HTML/JavaScript pura sin frameworks
- Requiere conexión a internet para cargar Tailwind CSS y Supabase JS
- Los datos se almacenan en Supabase
- La autenticación se maneja con Supabase Auth
- Todas las páginas están protegidas con autenticación excepto index.html, login.html y register.html

## Despliegue

Para desplegar esta aplicación:

1. Sube todos los archivos HTML y la carpeta `js/` a tu servidor web
2. Asegúrate de que las credenciales de Supabase estén configuradas correctamente
3. La aplicación funcionará desde cualquier servidor web estático (GitHub Pages, Netlify, Vercel, etc.)
