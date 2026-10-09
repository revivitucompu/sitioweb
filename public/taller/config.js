/* Configuración del sistema del taller.
   Este archivo no se pisa cuando actualizás index.html. */
const CONFIG = {
  // Pegá acá la URL de la implementación de Apps Script (termina en /exec)
  API_URL: 'https://script.google.com/macros/s/AKfycbzmKxVmx3UHROKedec9VZV5qKz5XQms1W7UTNVSJICcRT_n6vY-jaXvQtHrY-2wO3GJ/exec',

  negocio: 'Reviví Tu Compu',
  responsable: 'Juan Francisco De Paula',
  firmaWhatsapp: 'Juan',
  whatsapp: '+54 9 11 2388-4677',
  email: 'revivitucompu@gmail.com',
  web: 'revivitucompu.com.ar',
  // Demora habitual del laboratorio externo, en días hábiles (mínimo y máximo)
  laboratorioDias: [5, 10],

  // Link directo para dejar una reseña en tu ficha de Google
  linkResenas: 'https://search.google.com/local/writereview?placeid=ChIJA1zMDaPLvJURQwr2XfXx0TY',

  horario: 'de lunes a viernes de 10 a 19 hs, con cita previa',

  condiciones: [
    'El diagnóstico y el presupuesto son sin cargo. Te lo paso dentro de las 72 hs hábiles y no hago ningún trabajo sin tu aprobación.',
    'Hacé una copia de seguridad de tus archivos: no me responsabilizo por la pérdida de datos.',
    'Garantía de 3 meses sobre la mano de obra desde la entrega. En repuestos, según el componente.',
    'Para retirar el equipo coordiná antes por WhatsApp e indicá tu número de orden.',
    'Finalizado el trabajo y notificado el cliente, hay 90 días para retirar el equipo. Vencido ese plazo, se considera en mora y se podrá iniciar la intimación por abandono y la ejecución de la deuda.'
  ]
};
