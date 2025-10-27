-- Insert sample educational content for Matemáticas
INSERT INTO educational_content (subject, title, description, content, education_level) VALUES
('matematicas', 'Suma y Resta Básica', 'Aprende las operaciones fundamentales', 'La suma es juntar cantidades. Por ejemplo: 2 + 3 = 5. La resta es quitar cantidades. Por ejemplo: 5 - 2 = 3.', 'primaria'),
('matematicas', 'Multiplicación', 'Domina las tablas de multiplicar', 'La multiplicación es una suma repetida. Por ejemplo: 3 × 4 = 3 + 3 + 3 + 3 = 12', 'primaria'),
('matematicas', 'Álgebra Básica', 'Introducción a las ecuaciones', 'El álgebra usa letras para representar números. Por ejemplo: x + 5 = 10, entonces x = 5', 'basicos');

-- Insert sample educational content for Lenguaje
INSERT INTO educational_content (subject, title, description, content, education_level) VALUES
('lenguaje', 'El Alfabeto', 'Conoce las letras del abecedario', 'El alfabeto español tiene 27 letras. Cada letra tiene un sonido único que nos ayuda a formar palabras.', 'primaria'),
('lenguaje', 'Ortografía y Acentuación', 'Reglas básicas de escritura', 'Las palabras agudas llevan acento en la última sílaba cuando terminan en n, s o vocal. Ejemplo: canción, café.', 'basicos'),
('lenguaje', 'Comprensión Lectora', 'Mejora tu lectura', 'Leer con atención nos ayuda a entender mejor. Siempre pregúntate: ¿Quién? ¿Qué? ¿Cuándo? ¿Dónde? ¿Por qué?', 'primaria');

-- Insert sample educational content for Ciencias
INSERT INTO educational_content (subject, title, description, content, education_level) VALUES
('ciencias', 'El Cuerpo Humano', 'Conoce tu cuerpo', 'El cuerpo humano tiene diferentes sistemas: respiratorio, digestivo, circulatorio. Cada uno cumple una función importante.', 'primaria'),
('ciencias', 'El Ciclo del Agua', 'Cómo se mueve el agua en la naturaleza', 'El agua se evapora, forma nubes, cae como lluvia y vuelve a los ríos y océanos. Este proceso se repite constantemente.', 'primaria'),
('ciencias', 'La Célula', 'La unidad básica de la vida', 'Todos los seres vivos están formados por células. Las células tienen núcleo, citoplasma y membrana.', 'basicos');

-- Insert sample evaluations
INSERT INTO evaluations (subject, title, description, education_level, questions) VALUES
('matematicas', 'Evaluación de Suma y Resta', 'Prueba tus conocimientos básicos', 'primaria', 
'[
  {"question": "¿Cuánto es 5 + 3?", "options": ["6", "7", "8", "9"], "correct": 2},
  {"question": "¿Cuánto es 10 - 4?", "options": ["5", "6", "7", "8"], "correct": 1},
  {"question": "¿Cuánto es 7 + 2?", "options": ["8", "9", "10", "11"], "correct": 1}
]'::jsonb),
('lenguaje', 'Evaluación del Alfabeto', 'Conoce las letras', 'primaria',
'[
  {"question": "¿Cuántas letras tiene el alfabeto español?", "options": ["26", "27", "28", "29"], "correct": 1},
  {"question": "¿Qué letra viene después de la M?", "options": ["L", "N", "O", "P"], "correct": 1},
  {"question": "¿Cuál es la primera vocal?", "options": ["A", "E", "I", "O"], "correct": 0}
]'::jsonb);
