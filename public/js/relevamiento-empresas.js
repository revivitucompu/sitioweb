/* ═════════════════════════════════════════════════════════════
   Relevamiento de equipos para empresas.
   Se dibuja solo adentro de <div data-relevamiento></div>, así vive en un
   único lugar y sirve igual dentro de /empresas y en su página propia.

   La URL de abajo es la del script "Relevamientos" (planilla aparte de la
   del taller). Se saca en la planilla: menú Relevamientos → Ver la URL.
   ═════════════════════════════════════════════════════════════ */
const RELEV_URL = 'https://script.google.com/macros/s/AKfycbyk4ZVUucwx4ZTTkCOMOVYVkt58GPdZwd_rSTFGcgk0_lH4-mxng9IuT_WJ3s74q1o/exec';

(function () {
  var destino = document.querySelector('[data-relevamiento]');
  if (!destino) return;

  // El estilo y el formulario viven acá para no repetirlos en cada página
  var ESTILO = "/* ---------- relevamiento (mismo formato que el de apps) ---------- */\n.rel{--rbrand:#29AAE3;--rbrand-dark:#1580B3;--rbrand-soft:#E8F6FC;--rmuted:#5B6B77;--rline:#DCE5EB;--rerr:#C8412F;\n  max-width:760px;margin:0 auto;padding:0 0 8px}\n.rel form{margin:0}\n.rel fieldset{border:1px solid var(--rline);background:#fff;border-radius:14px;padding:20px 18px 8px;margin:0 0 18px}\n.rel legend{padding:0 8px;width:auto}\n.rel legend h3{font-family:'Archivo Narrow','Arial Narrow',sans-serif;font-weight:700;font-size:1.3rem;margin:0;display:flex;align-items:center;gap:8px}\n.rel legend h3 b{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--rbrand);color:#fff;font-size:.9rem;font-weight:700;flex:none}\n.rel .ayuda{color:var(--rmuted);font-size:.9rem;margin:-2px 0 14px}\n.rel .campos{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}\n.rel .campos.tres{grid-template-columns:1fr 1fr}\n.rel .campos > div{margin-bottom:18px}\n.rel .ancho{grid-column:1/-1}\n@media(max-width:560px){.rel .campos,.rel .campos.tres{grid-template-columns:1fr}}\n.rel label.f{display:block;font-weight:600;margin-bottom:6px}\n.rel label.f small{display:block;font-weight:400;color:var(--rmuted);font-size:.85rem;margin-top:2px}\n.rel .req{color:var(--rerr)}\n.rel input[type=text],.rel input[type=email],.rel input[type=tel],.rel input[type=number],.rel select,.rel textarea{width:100%;padding:11px 12px;border:1px solid var(--rline);border-radius:10px;font:inherit;background:#fff;color:var(--ink)}\n.rel select{appearance:none;-webkit-appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B6B77' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 12px center;background-size:18px;padding-right:38px}\n.rel textarea{min-height:92px;resize:vertical}\n.rel input:focus,.rel select:focus,.rel textarea:focus{outline:2px solid var(--rbrand);outline-offset:1px;border-color:var(--rbrand)}\n.rel .opciones{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n@media(max-width:560px){.rel .opciones{grid-template-columns:1fr}}\n.rel .opciones label{display:flex;gap:10px;align-items:center;border:1px solid var(--rline);border-radius:10px;padding:10px 12px;cursor:pointer;background:#fff;font-weight:400;user-select:none}\n.rel .opciones label:hover{border-color:var(--rbrand)}\n.rel .opciones input{accent-color:var(--rbrand);width:18px;height:18px;margin:0;flex:none}\n.rel .opciones label:has(input:checked){border-color:var(--rbrand);background:var(--rbrand-soft)}\n.rel .contador{display:flex;align-items:stretch;border:1px solid var(--rline);border-radius:10px;background:#fff;overflow:hidden;max-width:210px}\n.rel .contador:focus-within{border-color:var(--rbrand)}\n.rel .contador button{flex:none;width:44px;border:0;background:#F5F8FA;color:var(--rbrand-dark);font-size:1.3rem;font-weight:600;line-height:1;cursor:pointer;font-family:inherit;border-radius:0;padding:0;touch-action:manipulation}\n.rel .contador button:hover:not(:disabled){background:var(--rbrand-soft)}\n.rel .contador button:disabled{color:#B8C7D2;cursor:default}\n.rel .contador input[type=number]{border:0!important;border-radius:0;text-align:center;font-weight:600;min-width:0;-moz-appearance:textfield;appearance:textfield}\n.rel .contador input::-webkit-outer-spin-button,.rel .contador input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}\n.rel .mal,.rel .contador.mal{border-color:var(--rerr)!important}\n.rel .trampa{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}\n.rel .aviso{display:none;background:#FDF0EE;color:#7A2318;border:1px solid #F0C5BD;border-radius:12px;padding:.9rem 1.1rem;margin-bottom:1.2rem}\n.rel .envio{background:#fff;border:1px solid var(--rline);border-radius:14px;padding:20px 18px}\n.rel .envio p{margin:0;color:var(--rmuted);font-size:.9rem}\n.rel .envio .acciones{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}\n.rel .envio .btn{font:inherit;border:0;border-radius:10px;padding:12px 18px;cursor:pointer;font-weight:600}\n.rel .btn-main{background:var(--rbrand);color:#fff}\n.rel .btn-main:hover:not(:disabled){background:var(--rbrand-dark)}\n.rel .btn-main:disabled{opacity:.6;cursor:wait}\n.rel .btn-ghost{background:transparent;color:var(--rmuted);text-decoration:underline;padding:12px 6px;border:0}\n.rel .barra{position:sticky;top:var(--rel-arriba,70px);z-index:30;width:100vw;margin-left:calc(50% - 50vw);background:#fff;border-bottom:1px solid var(--rline);margin-bottom:24px}\n.rel .barra .wrap{display:flex;align-items:center;gap:12px;max-width:760px;margin:0 auto;padding:10px 16px}\n.rel .barra .pista{flex:1;order:-1;height:8px;background:var(--rline);border-radius:99px;overflow:hidden}\n.rel .barra .pista i{display:block;height:100%;width:0;background:var(--rbrand);border-radius:99px;transition:width .3s}\n.rel .barra #relPaso{font-size:.85rem;color:var(--rmuted);min-width:96px;text-align:right}\n.rel .listo{display:none;background:#fff;border:1px solid var(--rline);border-radius:14px;padding:30px 20px;text-align:center}\n.rel .listo .tilde{width:62px;height:62px;border-radius:50%;background:var(--rbrand);display:grid;place-items:center;margin:0 auto 16px}\n.rel .listo h2{margin:0 0 8px}\n.rel .listo p{color:var(--rmuted);max-width:52ch;margin:0 auto 1rem}";
  var CUERPO = "<form id=\"relev\" novalidate>\n      <input type=\"text\" name=\"_web\" class=\"trampa\" tabindex=\"-1\" autocomplete=\"off\" aria-hidden=\"true\">\n\n      <div class=\"barra\">\n        <div class=\"wrap\">\n          <span id=\"relPaso\">0% completo</span>\n          <span class=\"pista\"><i id=\"relPista\"></i></span>\n        </div>\n      </div>\n\n      <fieldset>\n        <legend><h3><b>1</b> La empresa</h3></legend>\n        <p class=\"ayuda\">Los campos con <span class=\"req\">*</span> son obligatorios.</p>\n        <div class=\"campos\">\n          <div><label class=\"f\" for=\"rEmpresa\">Empresa <span class=\"req\">*</span></label><input type=\"text\" id=\"rEmpresa\" name=\"Empresa\" required></div>\n          <div><label class=\"f\" for=\"rRubro\">Rubro</label><input type=\"text\" id=\"rRubro\" name=\"Rubro\" placeholder=\"Inmobiliaria, estudio contable, agencia\u2026\"></div>\n          <div><label class=\"f\" for=\"rContacto\">Tu nombre <span class=\"req\">*</span></label><input type=\"text\" id=\"rContacto\" name=\"Contacto\" required></div>\n          <div><label class=\"f\" for=\"rCargo\">Cargo o \u00e1rea</label><input type=\"text\" id=\"rCargo\" name=\"Cargo\"></div>\n          <div><label class=\"f\" for=\"rEmail\">Email <span class=\"req\">*</span></label><input type=\"email\" id=\"rEmail\" name=\"Email\" required></div>\n          <div><label class=\"f\" for=\"rTel\">Tel\u00e9fono o WhatsApp <span class=\"req\">*</span></label><input type=\"tel\" id=\"rTel\" name=\"Tel\u00e9fono\" required></div>\n          <div class=\"ancho\"><label class=\"f\" for=\"rDir\">Direcci\u00f3n de la oficina <small>(calle, altura y barrio)</small></label><input type=\"text\" id=\"rDir\" name=\"Direcci\u00f3n\"></div>\n        </div>\n      </fieldset>\n\n      <fieldset>\n        <legend><h3><b>2</b> Puestos y equipos</h3></legend>\n        <p class=\"ayuda\">Un n\u00famero aproximado alcanza.</p>\n        <div class=\"campos tres\">\n          <div><label class=\"f\" for=\"rUsuarios\">Personas que usan computadora <span class=\"req\">*</span></label><input type=\"number\" id=\"rUsuarios\" name=\"Usuarios\" min=\"1\" inputmode=\"numeric\" required></div>\n          <div><label class=\"f\" for=\"rPcs\">PC de escritorio</label><input type=\"number\" id=\"rPcs\" name=\"PC de escritorio\" min=\"0\" inputmode=\"numeric\"></div>\n          <div><label class=\"f\" for=\"rNotebooks\">Notebooks</label><input type=\"number\" id=\"rNotebooks\" name=\"Notebooks\" min=\"0\" inputmode=\"numeric\"></div>\n          <div><label class=\"f\" for=\"rMacs\">Mac (iMac o MacBook)</label><input type=\"number\" id=\"rMacs\" name=\"Mac\" min=\"0\" inputmode=\"numeric\"></div>\n          <div><label class=\"f\" for=\"rImpresoras\">Impresoras o multifunci\u00f3n</label><input type=\"number\" id=\"rImpresoras\" name=\"Impresoras\" min=\"0\" inputmode=\"numeric\"></div>\n          <div><label class=\"f\" for=\"rAntig\">Antig\u00fcedad promedio</label>\n            <select id=\"rAntig\" name=\"Antig\u00fcedad de los equipos\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>Menos de 2 a\u00f1os</option><option>Entre 2 y 5 a\u00f1os</option><option>M\u00e1s de 5 a\u00f1os</option><option>Mezclados</option><option>No s\u00e9</option></select></div>\n          <div class=\"ancho\"><label class=\"f\">Sistemas operativos que usan</label>\n            <div class=\"opciones\">\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"Windows 11\">Windows 11</label>\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"Windows 10\">Windows 10</label>\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"Windows m\u00e1s antiguo\">Windows m\u00e1s antiguo</label>\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"macOS\">macOS</label>\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"Linux\">Linux</label>\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"ChromeOS\">ChromeOS</label>\n              <label><input type=\"checkbox\" name=\"Sistemas operativos\" value=\"No s\u00e9\">No s\u00e9</label>\n            </div></div>\n          <div class=\"ancho\"><label class=\"f\">\u00bfTienen servidor o NAS?</label>\n            <div class=\"opciones\">\n              <label><input type=\"radio\" name=\"Servidor o NAS\" value=\"S\u00ed\">S\u00ed</label>\n              <label><input type=\"radio\" name=\"Servidor o NAS\" value=\"No\">No</label>\n              <label><input type=\"radio\" name=\"Servidor o NAS\" value=\"No s\u00e9\">No s\u00e9</label>\n            </div></div>\n          <div class=\"ancho\"><label class=\"f\">Otros equipos en la oficina</label>\n            <div class=\"opciones\">\n              <label><input type=\"checkbox\" name=\"Otros equipos\" value=\"C\u00e1maras de seguridad\">C\u00e1maras de seguridad</label>\n              <label><input type=\"checkbox\" name=\"Otros equipos\" value=\"Telefon\u00eda IP o central\">Telefon\u00eda IP o central</label>\n              <label><input type=\"checkbox\" name=\"Otros equipos\" value=\"Tablets\">Tablets</label>\n              <label><input type=\"checkbox\" name=\"Otros equipos\" value=\"TV o proyector de sala\">TV o proyector de sala</label>\n              <label><input type=\"checkbox\" name=\"Otros equipos\" value=\"Control de acceso\">Control de acceso</label>\n            </div></div>\n        </div>\n      </fieldset>\n\n      <fieldset>\n        <legend><h3><b>3</b> Red e internet</h3></legend>\n        <div class=\"campos\">\n          <div><label class=\"f\" for=\"rIsp\">Proveedor de internet</label><input type=\"text\" id=\"rIsp\" name=\"Proveedor de internet\" placeholder=\"Telecentro, Personal, Movistar\u2026\"></div>\n          <div><label class=\"f\" for=\"rWifi\">\u00bfC\u00f3mo es el wifi?</label>\n            <select id=\"rWifi\" name=\"Wifi\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>Un solo router</option><option>Router con repetidores</option><option>Red mallada (mesh) o access points</option><option>No s\u00e9</option></select></div>\n          <div><label class=\"f\" for=\"rCable\">\u00bfHay equipos conectados por cable?</label>\n            <select id=\"rCable\" name=\"Cableado de red\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>S\u00ed, todos o casi todos</option><option>Algunos</option><option>No, todo por wifi</option><option>No s\u00e9</option></select></div>\n          <div><label class=\"f\" for=\"rWifiProb\">\u00bfTienen problemas de conexi\u00f3n?</label>\n            <select id=\"rWifiProb\" name=\"Problemas de conexi\u00f3n\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>No, anda bien</option><option>A veces, en algunos lugares</option><option>S\u00ed, seguido</option></select></div>\n        </div>\n      </fieldset>\n\n      <fieldset>\n        <legend><h3><b>4</b> Cuentas, programas y seguridad</h3></legend>\n        <div class=\"campos\">\n          <div class=\"ancho\"><label class=\"f\">Correo de la empresa</label>\n            <div class=\"opciones\">\n              <label><input type=\"checkbox\" name=\"Correo\" value=\"Google Workspace\">Google Workspace</label>\n              <label><input type=\"checkbox\" name=\"Correo\" value=\"Microsoft 365\">Microsoft 365</label>\n              <label><input type=\"checkbox\" name=\"Correo\" value=\"Correo del dominio o hosting\">Correo del dominio o hosting</label>\n              <label><input type=\"checkbox\" name=\"Correo\" value=\"Cuentas personales (Gmail, Hotmail)\">Cuentas personales</label>\n              <label><input type=\"checkbox\" name=\"Correo\" value=\"No s\u00e9\">No s\u00e9</label>\n            </div></div>\n          <div class=\"ancho\"><label class=\"f\" for=\"rProgramas\">Programas que usan a diario <small>(gesti\u00f3n inmobiliaria, facturaci\u00f3n, contable, dise\u00f1o, etc.)</small></label><textarea id=\"rProgramas\" name=\"Programas\"></textarea></div>\n          <div><label class=\"f\" for=\"rBackup\">\u00bfHacen copias de seguridad?</label>\n            <select id=\"rBackup\" name=\"Backups\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>S\u00ed, autom\u00e1ticas</option><option>S\u00ed, manuales cada tanto</option><option>No</option><option>No s\u00e9</option></select></div>\n          <div><label class=\"f\" for=\"rAntivirus\">\u00bfTienen antivirus?</label>\n            <select id=\"rAntivirus\" name=\"Antivirus\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>S\u00ed, en todos los equipos</option><option>En algunos</option><option>No</option><option>No s\u00e9</option></select></div>\n          <div class=\"ancho\"><label class=\"f\" for=\"rSoporte\">\u00bfQui\u00e9n les resuelve hoy los problemas t\u00e9cnicos?</label>\n            <select id=\"rSoporte\" name=\"Soporte actual\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>Nadie fijo, llamamos cuando pasa algo</option><option>Una persona de confianza</option><option>Una empresa de soporte</option><option>Alguien del equipo interno</option></select></div>\n        </div>\n      </fieldset>\n\n      <fieldset>\n        <legend><h3><b>5</b> Qu\u00e9 necesitan</h3></legend>\n        <div class=\"campos\">\n          <div class=\"ancho\"><label class=\"f\" for=\"rProblemas\">\u00bfQu\u00e9 problemas aparecen m\u00e1s seguido? <span class=\"req\">*</span></label><textarea id=\"rProblemas\" name=\"Problemas frecuentes\" required placeholder=\"Equipos lentos, la impresora no imprime, se corta el wifi, hay que instalar programas a gente nueva\u2026\"></textarea></div>\n          <div class=\"ancho\"><label class=\"f\">\u00bfQu\u00e9 les interesa cubrir?</label>\n            <div class=\"opciones\">\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Soporte remoto a usuarios\">Soporte remoto</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Visitas a la oficina\">Visitas a la oficina</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Mantenimiento preventivo\">Mantenimiento preventivo</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Instalaci\u00f3n de equipos y programas\">Instalaci\u00f3n de equipos y programas</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Redes y wifi\">Redes y wifi</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Backups y seguridad\">Backups y seguridad</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Cuentas de correo\">Cuentas de correo</label>\n              <label><input type=\"checkbox\" name=\"Necesidades\" value=\"Compra de equipos nuevos\">Compra de equipos</label>\n            </div></div>\n          <div><label class=\"f\" for=\"rModalidad\">Modalidad que les interesa</label>\n            <select id=\"rModalidad\" name=\"Modalidad\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>Abono mensual</option><option>Por incidente</option><option>Proyecto puntual</option><option>No s\u00e9, quiero que me asesores</option></select></div>\n          <div><label class=\"f\" for=\"rUrgencia\">\u00bfPara cu\u00e1ndo lo necesitan?</label>\n            <select id=\"rUrgencia\" name=\"Urgencia\"><option value=\"\">Eleg\u00ed una opci\u00f3n</option><option>Hay algo urgente ahora</option><option>En las pr\u00f3ximas semanas</option><option>Estamos evaluando opciones</option></select></div>\n          <div class=\"ancho\"><label class=\"f\">Para terminar el relevamiento, prefer\u00eds</label>\n            <div class=\"opciones\">\n              <label><input type=\"radio\" name=\"Relevamiento\" value=\"Videollamada\">Videollamada</label>\n              <label><input type=\"radio\" name=\"Relevamiento\" value=\"Visita a la oficina\">Visita a la oficina</label>\n              <label><input type=\"radio\" name=\"Relevamiento\" value=\"Con el formulario alcanza\">Con el formulario alcanza</label>\n            </div></div>\n          <div class=\"ancho\"><label class=\"f\" for=\"rComentarios\">Algo m\u00e1s que quieras contarme</label><textarea id=\"rComentarios\" name=\"Comentarios\"></textarea></div>\n        </div>\n      </fieldset>\n\n      <div class=\"aviso\" id=\"relAviso\" role=\"alert\"></div>\n      <div class=\"envio\">\n        <p>Las respuestas se guardan en este navegador mientras complet\u00e1s, por si se te cierra la pesta\u00f1a. Los datos los uso solo para preparar tu propuesta: no los comparto con nadie.</p>\n        <div class=\"acciones\">\n          <button type=\"submit\" class=\"btn btn-main\" id=\"relEnviar\">Enviar relevamiento</button>\n          <button type=\"button\" class=\"btn btn-ghost\" id=\"relBorrar\">Borrar todo</button>\n        </div>\n      </div>\n    </form>\n\n    <div class=\"listo\" id=\"relListo\" role=\"status\">\n      <div class=\"tilde\"><svg width=\"34\" height=\"34\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg></div>\n      <h2>\u00a1Listo, gracias!</h2>\n      <p>Ya me lleg\u00f3 el relevamiento. Lo reviso y te escribo en el d\u00eda h\u00e1bil con la propuesta y el valor del abono por escrito.</p>\n      <p><button type=\"button\" class=\"btn btn-ghost\" id=\"relVolver\">Volver al formulario</button></p>";

  var hoja = document.createElement('style');
  hoja.textContent = ESTILO;
  document.head.appendChild(hoja);
  destino.classList.add('rel');
  destino.innerHTML = CUERPO;

  // La barra de avance se pega debajo de lo que ya esté pegado arriba (encabezado, submenú)
  var arriba = 0;
  document.querySelectorAll('header, nav').forEach(function (el) {
    if (getComputedStyle(el).position === 'sticky') arriba += el.getBoundingClientRect().height;
  });
  destino.style.setProperty('--rel-arriba', Math.round(arriba) + 'px');

  var f = document.getElementById('relev');
  var aviso = document.getElementById('relAviso'), listo = document.getElementById('relListo');
  var CLAVE = 'rtc_relevamiento_empresas';

  /* Cantidades con + y − */
  f.querySelectorAll('input[type=number]').forEach(function (inp) {
    var min = Number(inp.min || 0), max = inp.max ? Number(inp.max) : 999;
    var caja = document.createElement('div'); caja.className = 'contador';
    var etiqueta = document.querySelector('label[for="' + inp.id + '"]');
    var nombre = etiqueta ? etiqueta.textContent.replace('*', '').trim() : 'cantidad';
    var menos = document.createElement('button'), mas = document.createElement('button');
    menos.type = 'button'; menos.textContent = '−'; menos.setAttribute('aria-label', 'Restar uno a ' + nombre);
    mas.type = 'button'; mas.textContent = '+'; mas.setAttribute('aria-label', 'Sumar uno a ' + nombre);
    inp.placeholder = '–';
    inp.parentNode.insertBefore(caja, inp);
    caja.appendChild(menos); caja.appendChild(inp); caja.appendChild(mas);
    function pintar() {
      var v = inp.value === '' ? null : Number(inp.value);
      menos.disabled = v === null || v <= min;
      mas.disabled = v !== null && v >= max;
    }
    function mover(d) {
      var v = inp.value === '' ? null : Number(inp.value);
      v = v === null ? (d > 0 ? Math.max(min, 1) : min) : v + d;
      inp.value = Math.min(max, Math.max(min, v));
      caja.classList.remove('mal'); inp.classList.remove('mal');
      pintar(); guardar(); avance();
    }
    [[menos, -1], [mas, 1]].forEach(function (par) {
      var b = par[0], d = par[1], t, r;
      function parar() { clearTimeout(t); clearInterval(r); }
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); mover(d); t = setTimeout(function () { r = setInterval(function () { mover(d); }, 90); }, 400); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, parar); });
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mover(d); } });
    });
    inp.addEventListener('input', function () {
      inp.value = inp.value.replace(/\D/g, '');
      if (inp.value !== '' && Number(inp.value) > max) inp.value = max;
      pintar();
    });
    pintar();
  });

  /* Lo escrito se guarda en este navegador, por si se cierra la pestaña */
  function guardar() {
    try {
      var d = {};
      new FormData(f).forEach(function (v, k) {
        if (k === '_web') return;
        if (d[k] === undefined) d[k] = v;
        else if (Array.isArray(d[k])) d[k].push(v);
        else d[k] = [d[k], v];
      });
      localStorage.setItem(CLAVE, JSON.stringify(d));
    } catch (e) { /* modo privado o sin espacio: no pasa nada */ }
  }
  function recuperar() {
    var d;
    try { d = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { return; }
    if (!d) return;
    Object.keys(d).forEach(function (k) {
      var valores = [].concat(d[k]);
      f.querySelectorAll('[name="' + k.replace(/"/g, '\\"') + '"]').forEach(function (el) {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = valores.indexOf(el.value) > -1;
        else el.value = valores[0];
      });
    });
  }

  function avance() {
    var total = 0, hechos = 0, grupos = {};
    f.querySelectorAll('input[name]:not([type=checkbox]):not([type=radio]):not(.trampa), select[name], textarea[name]').forEach(function (el) {
      total++; if (String(el.value).trim()) hechos++;
    });
    f.querySelectorAll('input[type=checkbox][name], input[type=radio][name]').forEach(function (el) {
      if (grupos[el.name] === undefined) grupos[el.name] = false;
      if (el.checked) grupos[el.name] = true;
    });
    Object.keys(grupos).forEach(function (g) { total++; if (grupos[g]) hechos++; });
    var pct = total ? Math.round(hechos / total * 100) : 0;
    document.getElementById('relPista').style.width = pct + '%';
    document.getElementById('relPaso').textContent = pct + '% completo';
  }

  f.addEventListener('input', function () { guardar(); avance(); });
  f.addEventListener('change', function () { guardar(); avance(); });

  function mostrarAviso(t) {
    aviso.textContent = t; aviso.style.display = 'block';
    aviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function completo() {
    aviso.style.display = 'none';
    f.querySelectorAll('.mal').forEach(function (el) { el.classList.remove('mal'); });
    var faltan = [].slice.call(f.querySelectorAll('[required]')).filter(function (el) {
      return !String(el.value).trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
    });
    if (faltan.length) {
      faltan.forEach(function (el) {
        el.classList.add('mal');
        var c = el.closest('.contador'); if (c) c.classList.add('mal');
      });
      mostrarAviso('Revisá los campos marcados: son obligatorios o tienen un formato inválido.');
      faltan[0].focus();
    }
    return faltan.length === 0;
  }

  /* Lo que se manda: cada pregunta con su respuesta */
  function respuestas() {
    var d = {}, vistos = {};
    f.querySelectorAll('[name]').forEach(function (el) {
      if (el.name === '_web' || vistos[el.name]) return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        vistos[el.name] = true;
        var marcados = [].slice.call(f.querySelectorAll('[name="' + el.name.replace(/"/g, '\\"') + '"]:checked'))
          .map(function (x) { return x.value; });
        if (marcados.length) d[el.name] = marcados.join(', ');
      } else {
        var v = String(el.value).trim();
        if (v) d[el.name] = v;
      }
    });
    return d;
  }

  var boton = document.getElementById('relEnviar');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!completo()) return;
    if (String(RELEV_URL).indexOf('PEGAR') === 0) {
      mostrarAviso('Todavía falta configurar el envío. Escribime por WhatsApp al +54 9 11 2388-4677 y lo vemos.');
      return;
    }
    boton.disabled = true;
    var original = boton.textContent;
    boton.textContent = 'Enviando…';

    var corte = setTimeout(function () { control.abort(); }, 30000);
    var control = new AbortController();
    fetch(RELEV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        formulario: 'empresas',
        pagina: location.href,
        trampa: f._web.value,
        campos: respuestas()
      }),
      signal: control.signal,
      redirect: 'follow'
    }).then(function (r) {
      return r.json();
    }).then(function (r) {
      if (!r || !r.ok) throw new Error((r && r.error) || 'No se pudo enviar.');
      try { localStorage.removeItem(CLAVE); } catch (e) {}
      f.style.display = 'none';
      listo.style.display = 'block';
      listo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function (err) {
      mostrarAviso(err && err.name === 'AbortError'
        ? 'El envío tardó demasiado. Probá de nuevo o escribime por WhatsApp al +54 9 11 2388-4677.'
        : (err.message || 'No se pudo enviar el formulario.') + ' Si sigue sin andar, escribime por WhatsApp al +54 9 11 2388-4677.');
    }).finally(function () {
      clearTimeout(corte);
      // Siempre se reactiva: si salió bien el formulario ya está oculto y no se ve el cambio
      boton.disabled = false; boton.textContent = original;
    });
  });

  document.getElementById('relBorrar').onclick = function () {
    if (!confirm('¿Borrar todas las respuestas del formulario?')) return;
    f.reset();
    try { localStorage.removeItem(CLAVE); } catch (e) {}
    f.querySelectorAll('.mal').forEach(function (el) { el.classList.remove('mal'); });
    aviso.style.display = 'none';
    avance();
  };

  document.getElementById('relVolver').onclick = function () {
    listo.style.display = 'none';
    f.style.display = '';
    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  recuperar();
  avance();
})();
