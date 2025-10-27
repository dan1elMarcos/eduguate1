# EduGuate - Plataforma Educativa

Versión HTML/JavaScript puro de la plataforma educativa EduGuate.

## Configuración

1. **Configurar Supabase**
   - Abre el archivo `js/config.js`
   - Reemplaza `YOUR_SUPABASE_URL` con tu URL de Supabase
   - Reemplaza `YOUR_SUPABASE_ANON_KEY` con tu clave anónima de Supabase

2. **Ejecutar Scripts SQL**
   - Ve a tu proyecto de Supabase
   - Ejecuta los scripts en la carpeta `/scripts` en orden (001, 002, 003, 004)
   - Esto creará todas las tablas necesarias

3. **Abrir la Aplicación**
   - Abre `index.html` en tu navegador
   - O usa un servidor local como Live Server en VS Code

## Estructura de Archivos

- `index.html` - Página principal
- `login.html` - Inicio de sesión
- `register.html` - Registro de usuarios
- `dashboard-student.html` - Dashboard para estudiantes
- `dashboard-tutor.html` - Dashboard para tutores
- `js/config.js` - Configuración de Supabase
- `js/auth.js` - Funciones de autenticación

## Características

- ✅ Autenticación con Supabase
- ✅ Roles de usuario (Estudiante/Tutor)
- ✅ Dashboards personalizados
- ✅ Diseño responsivo con Tailwind CSS
- ✅ Sin dependencias de Node.js o frameworks

## Tecnologías

- HTML5
- JavaScript (Vanilla)
- Tailwind CSS (CDN)
- Supabase JS SDK (CDN)
