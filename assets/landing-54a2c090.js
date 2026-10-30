// Landing comercial de NOVANTIQ SPORTS.
// Todo lo que se ve en las demos (chat, agenda, "Falta uno") son datos de ejemplo
// que viven en esta página. Lo único que se lee del backend es el WhatsApp comercial
// (Panel NOVANTIQ → Ajustes comerciales), con respaldo en VITE_SALES_WHATSAPP.
import { E as waLink, j as config, k as rpc } from './ui-CecIe10a.js';

// Abono de referencia del plan Club en pesos, para la calculadora (actualizar con el dólar).
const ABONO_ARS = 93000;
const PRICES = { padel: 48000, futbol: 60000 };
const DEMO_TEXT = 'Hola NOVANTIQ! Quiero saber más de NOVANTIQ SPORTS para mi complejo.';

const ars = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- WhatsApp comercial ---------- */
let SALES = config.salesWhatsapp || '';
const salesLink = (text) => waLink(SALES, text);
function applySales() {
  const link = salesLink(DEMO_TEXT);
  const line = $('#contact-line');
  if (SALES) {
    $('#wa-num-text').textContent = '+' + String(SALES).replace(/\D/g, '');
    line.hidden = false;
  }
  if (!link) $('#form-out').textContent = 'Dejanos tus datos y el número comercial se configura desde el Panel NOVANTIQ.';
}
(async () => {
  try {
    const settings = await rpc('public_get_site_settings');
    SALES = String(settings?.['sales.whatsapp'] || '') || SALES;
  } catch { /* sin backend: queda el respaldo de configuración */ }
  applySales();
})();

/* ---------- Nombre del complejo ---------- */
let CLUB = 'Club Ejemplo';
function initials(n) {
  const w = n.replace(/club|complejo|pádel|padel|fútbol|futbol|y/gi, '').trim().split(/\s+/).filter(Boolean);
  const src = w.length ? w : n.split(/\s+/);
  return (src.slice(0, 2).map((x) => x[0]).join('') || 'CE').toUpperCase();
}
function setClub(name, save) {
  CLUB = (name || '').trim().slice(0, 40) || 'Club Ejemplo';
  $$('[data-club]').forEach((el) => {
    el.textContent = el.closest('.lead') && CLUB === 'Club Ejemplo' ? 'tu complejo' : CLUB;
  });
  $$('[data-initials]').forEach((el) => { el.textContent = initials(CLUB); });
  if (save) { try { localStorage.setItem('nq-club', CLUB); } catch { /* sin almacenamiento */ } }
}
(() => {
  let start = '';
  try { start = new URLSearchParams(location.search).get('club') || ''; } catch { /* */ }
  if (!start) { try { start = localStorage.getItem('nq-club') || ''; } catch { /* */ } }
  if (start) $('#club-input').value = start;
  setClub(start, false);
})();
$('#club-form').addEventListener('submit', (e) => {
  e.preventDefault();
  setClub($('#club-input').value, true);
  const f = $('#f-club');
  if (f && !f.value && CLUB !== 'Club Ejemplo') f.value = CLUB;
  resetBot();
  renderBoard();
  setNotif(FU.find((c) => c.id === fuLastNotif) || FU[0]);
});
$('#club-input').addEventListener('input', (e) => setClub(e.target.value, false));

/* ---------- Chat del hero ---------- */
const heroChat = $('#hero-chat');
if (!reduce) { [...heroChat.children].forEach((m, i) => { m.style.animationDelay = `${i * 0.5}s`; }); heroChat.classList.add('play'); }

/* ---------- Agenda de demostración ---------- */
const TIMES = ['18:00', '19:30', '21:00', '22:30'];
const COURTS = [{ name: 'Pádel 1', sport: 'padel', min: 90 }, { name: 'Pádel 2', sport: 'padel', min: 90 }, { name: 'Fútbol 5', sport: 'futbol', min: 60 }];
const endOf = (t, min) => { const [h, m] = t.split(':').map(Number); const x = h * 60 + m + min; return `${String(Math.floor(x / 60) % 24).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
function baseAgenda() {
  const F = () => ({ t: 'free' });
  return [
    { '18:00': [{ t: 'busy', who: 'Lucía P.', src: 'Mostrador' }, { t: 'block', who: 'Mantenimiento', src: 'hasta 19:30' }, F()],
      '19:30': [F(), { t: 'busy', wa: 1, who: 'Diego R.', src: 'WhatsApp' }, { t: 'busy', wa: 1, who: 'Los Pibes FC', src: 'Web' }],
      '21:00': [{ t: 'busy', wa: 1, who: 'Sofía M.', src: 'WhatsApp' }, { t: 'busy', who: 'Pablo T.', src: 'Mostrador' }, { t: 'busy', fijo: 1, who: 'Oficina Martes', src: 'Turno fijo' }],
      '22:30': [F(), F(), F()] },
    { '18:00': [F(), { t: 'busy', fijo: 1, who: 'Grupo de los jueves', src: 'Turno fijo' }, F()],
      '19:30': [{ t: 'busy', wa: 1, who: 'Nicolás B.', src: 'WhatsApp' }, F(), F()],
      '21:00': [{ t: 'busy', wa: 1, who: 'Carla V.', src: 'Web' }, { t: 'busy', who: 'Jorge S.', src: 'Mostrador' }, { t: 'busy', wa: 1, who: 'Amigos del Barrio', src: 'WhatsApp' }],
      '22:30': [F(), F(), { t: 'busy', wa: 1, who: 'Tomás E.', src: 'WhatsApp' }] },
  ];
}
let AG = baseAgenda(); let DAY = 0;
const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
function dayLabel(d) { const x = new Date(); x.setDate(x.getDate() + d); return `${d ? 'Mañana' : 'Hoy'} ${dayNames[x.getDay()]} ${x.getDate()}`; }
$$('.days button').forEach((b) => { b.textContent = dayLabel(+b.dataset.day); b.addEventListener('click', () => showDay(+b.dataset.day)); });

function slotHTML(s) {
  if (s.t === 'free') return '<div class="slot free">Libre</div>';
  if (s.t === 'block') return `<div class="slot block">${esc(s.who)}<small>${esc(s.src)}</small></div>`;
  if (s.t === 'released') return '<div class="slot released">Liberado<small>Vuelve a ofrecerse en la web y WhatsApp</small></div>';
  const cls = ['slot', 'busy', s.wa ? 'wa' : '', s.fijo ? 'fijo' : '', s.mine ? 'mine' : ''].join(' ');
  const pill = s.mine ? '<span class="pill paid">Confirmada</span>' : (s.code ? `<span class="pill pend">${s.code}</span>` : '');
  return `<div class="${cls}">${esc(s.who)}<small>${esc(s.src)}</small>${pill}</div>`;
}
function renderAgenda() {
  const a = AG[DAY];
  $('#agenda-body').innerHTML = TIMES.map((t) => `<tr><td class="h">${t}</td>${a[t].map((s) => `<td>${slotHTML(s)}</td>`).join('')}</tr>`).join('');
  let res = 0; let free = 0; let busy = 0; let total = 0;
  TIMES.forEach((t) => AG[0][t].forEach((s) => { total++; if (s.t === 'busy' || s.t === 'block') busy++; if (s.t === 'free' || s.t === 'released') free++; if (s.t === 'busy' && s.wa) res++; }));
  $('#st-res').textContent = res; $('#st-free').textContent = free; $('#st-occ').textContent = `${Math.round((busy / total) * 100)}%`;
}
function showDay(d) {
  DAY = d;
  $$('.days button').forEach((b) => b.setAttribute('aria-selected', +b.dataset.day === d ? 'true' : 'false'));
  renderAgenda();
}
showDay(0);
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    const tb = $('#agenda'); tb.classList.add('fill-in');
    tb.querySelectorAll('.slot').forEach((s, i) => { s.style.animationDelay = `${i * 0.05}s`; });
    io.disconnect();
  }), { threshold: 0.4 });
  io.observe($('#agenda'));
}

/* ---------- Bot interactivo ---------- */
const bot = $('#bot');
let booking = null; let busyBot = false;
const scrollBot = () => { bot.scrollTop = bot.scrollHeight; };
function addMsg(side, htmlText, opts, extraClass) {
  const m = document.createElement('div');
  m.className = `msg new ${side}${extraClass ? ` ${extraClass}` : ''}`;
  m.innerHTML = htmlText;
  if (opts?.length) {
    const o = document.createElement('div'); o.className = 'opts';
    opts.forEach(([label, fn]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', () => {
        if (busyBot) return;
        o.querySelectorAll('button').forEach((x) => { x.disabled = true; }); b.classList.add('picked');
        addMsg('out', esc(label)); botSay(fn);
      });
      o.appendChild(b);
    });
    m.appendChild(o);
  }
  bot.appendChild(m); scrollBot(); return m;
}
function botSay(fn, wait) {
  busyBot = true; $('#bot-status').textContent = 'escribiendo…';
  const t = document.createElement('div'); t.className = 'msg in typing'; t.innerHTML = '<i></i><i></i><i></i>';
  bot.appendChild(t); scrollBot();
  setTimeout(() => { t.remove(); busyBot = false; $('#bot-status').textContent = 'en línea'; fn(); }, reduce ? 150 : (wait || 750));
}
const code = () => 'NQ-' + Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
function start() {
  addMsg('in', `¡Hola! Soy el asistente de reservas de <b>${esc(CLUB)}</b>. ¿Qué querés hacer?`, [['Reservar cancha', askSport], ['Ver precios', prices], ['Hablar con alguien', human]]);
}
function prices() {
  addMsg('in', `Precios de ejemplo:<br>• Pádel, 90 min: <b>${ars(PRICES.padel)}</b><br>• Fútbol 5, 60 min: <b>${ars(PRICES.futbol)}</b><br>Se paga en el complejo.`, [['Reservar cancha', askSport]]);
}
function human() {
  addMsg('in', 'Listo, le aviso a alguien del complejo y te escribe enseguida. Si querés, mientras tanto podés reservar:', [['Reservar cancha', askSport]]);
}
function askSport() { addMsg('in', '¿Qué deporte?', [['Pádel', () => askDay('padel')], ['Fútbol 5', () => askDay('futbol')]]); }
function askDay(sp) {
  addMsg('in', '¿Para qué día?', [[dayLabel(0).replace('Hoy ', 'Hoy, '), () => askTime(sp, 0)], [dayLabel(1).replace('Mañana ', 'Mañana, '), () => askTime(sp, 1)]]);
}
const courtsOf = (sp) => COURTS.map((c, i) => (c.sport === sp ? i : -1)).filter((i) => i >= 0);
function askTime(sp, d) {
  showDay(d);
  const idx = courtsOf(sp);
  const times = TIMES.filter((t) => idx.some((i) => AG[d][t][i].t === 'free' || AG[d][t][i].t === 'released'));
  if (!times.length) { addMsg('in', 'Ese día está todo reservado. ¿Probamos otro?', [['Elegir otro día', () => askDay(sp)]]); return; }
  addMsg('in', 'Horarios con canchas libres:', times.map((t) => [t, () => askCourt(sp, d, t)]));
}
function askCourt(sp, d, t) {
  const free = courtsOf(sp).filter((i) => AG[d][t][i].t === 'free' || AG[d][t][i].t === 'released');
  if (free.length === 1) { confirmAsk(d, t, free[0]); return; }
  addMsg('in', `A las ${t} están libres:`, free.map((i) => [COURTS[i].name, () => confirmAsk(d, t, i)]));
}
function confirmAsk(d, t, i) {
  const c = COURTS[i];
  booking = { d, t, i };
  addMsg('in', `${c.name}, ${dayLabel(d).split(' ')[0].toLowerCase()} de ${t} a ${endOf(t, c.min)}. Precio: <b>${ars(PRICES[c.sport])}</b>, se paga en el complejo. ¿Confirmo?`, [['Confirmar', confirmBooking], ['Elegir otro horario', () => askTime(c.sport, d)]]);
}
function confirmBooking() {
  const { d, t, i } = booking; const c = COURTS[i];
  const k = code(); booking.code = k;
  AG.forEach((day) => TIMES.forEach((x) => day[x].forEach((s) => { delete s.mine; })));
  AG[d][t][i] = { t: 'busy', wa: 1, mine: 1, who: 'Vos (demo)', src: 'WhatsApp' };
  showDay(d);
  addMsg('in', `✓ <b>Reserva confirmada.</b> Código ${k}. ${c.name}, ${t} a ${endOf(t, c.min)}. Ya la ve el complejo en su agenda.`, null, 'ok');
  botSay(() => {
    addMsg('sys', 'Antes del turno');
    addMsg('in', `⏰ Recordatorio: jugás a las <b>${t}</b> en ${c.name} de ${esc(CLUB)}. ¿Venís?`, [['Sí, voy', goodGame], ['Cancelar turno', cancelBooking]]);
  }, 1500);
}
function goodGame() { addMsg('in', '¡Genial! Te esperamos. Buen partido.', [['Probar de nuevo', resetBot]]); }
function cancelBooking() {
  const { d, t, i } = booking;
  AG[d][t][i] = { t: 'released' }; showDay(d);
  addMsg('in', 'Turno cancelado a tiempo. El horario ya vuelve a estar libre en la web y en WhatsApp.', [['Probar de nuevo', resetBot]]);
}
function resetBot() { AG = baseAgenda(); booking = null; busyBot = false; bot.innerHTML = ''; showDay(0); start(); }
start();

/* ---------- Falta uno (demo) ---------- */
const FU_NAMES = ['Juli M.', 'Fede A.', 'Caro P.', 'Nico L.', 'Sofi R.', 'Mati G.', 'Agus T.', 'Lu V.', 'Pedro S.', 'Vale C.', 'Tomi B.', 'Flor D.', 'Rami K.', 'Meli O.', 'Santi Z.', 'Jose H.'];
const pick = (n, off) => Array.from({ length: n }, (_, i) => ({ n: FU_NAMES[(i + off) % FU_NAMES.length] }));
const pairs = (list, off) => list.map((p, i) => ({ n: `${p.n} y ${FU_NAMES[(i + off) % 16]}` }));
const FU = [
  { id: 1, tipo: 'partido', label: 'Pádel', titulo: 'Partido 2 vs 2', nivel: '7ma categoría', cuando: 'Hoy · 20:00', cancha: 'Pádel 2', precio: 12000, cupo: 4, unit: 'jugador', jug: [{ n: 'Diego R.' }, { n: 'Martín G.' }, { n: 'Lucas F.' }] },
  { id: 2, tipo: 'partido', label: 'Fútbol 5', titulo: 'Partido 5 vs 5', nivel: 'Libre', cuando: 'Hoy · 21:00', cancha: 'Fútbol 5', precio: 6000, cupo: 10, unit: 'jugador', jug: pick(9, 2) },
  { id: 3, tipo: 'torneo', label: 'Pádel', titulo: 'Americano mixto', nivel: '6ta y 7ma', cuando: 'Sáb · 10:00', cancha: 'Pádel 1 y 2', precio: 20000, cupo: 16, unit: 'jugador', jug: pick(15, 0) },
  { id: 4, tipo: 'partido', label: 'Pádel', titulo: 'Peloteo 1 vs 1', nivel: 'Principiante', cuando: 'Mañana · 18:00', cancha: 'Pádel 1', precio: 24000, cupo: 2, unit: 'jugador', jug: [{ n: 'Camila S.' }] },
  { id: 5, tipo: 'torneo', label: 'Pádel', titulo: 'Relámpago 2 vs 2', nivel: '5ta categoría', cuando: 'Dom · 16:00', cancha: 'Pádel 1 y 2', precio: 40000, cupo: 8, unit: 'pareja', jug: pairs(pick(7, 4), 9) },
  { id: 6, tipo: 'clase', label: 'Pádel', titulo: 'Clase de iniciación', nivel: 'Iniciación', cuando: 'Jue · 19:00', cancha: 'Pádel 2', precio: 15000, cupo: 4, unit: 'jugador', jug: [{ n: 'Ana L.' }, { n: 'Rocío N.' }, { n: 'Bruno C.' }] },
];
let fuFilter = 'all'; const fuOpen = new Set(); let fuFresh = null; let fuNextId = 7; let fuLastNotif = 1;
const faltan = (c) => c.cupo - c.jug.length;
function needText(c) {
  const f = faltan(c);
  if (f <= 0) return 'Completo';
  const u = c.unit === 'pareja' ? (f === 1 ? ' pareja' : ' parejas') : '';
  return (f === 1 ? 'Falta 1' : `Faltan ${f}`) + u;
}
function setNotif(c) {
  fuLastNotif = c.id;
  const f = Math.max(faltan(c), 1);
  const quien = c.unit === 'pareja' ? (f === 1 ? '1 pareja' : `${f} parejas`) : (f === 1 ? '1 jugador' : `${f} jugadores`);
  $('#notif-text').innerHTML = `<b>Falta ${quien}</b> para ${esc(c.titulo.toLowerCase())} de ${esc(c.label.toLowerCase())} · ${esc(c.cuando.toLowerCase())} en <span data-club>${esc(CLUB)}</span>. Nivel: ${esc(c.nivel)}. ${ars(c.precio)} por ${c.unit}. ¿Te sumás?<div class="opts"><span>Me sumo</span><span>No, gracias</span></div>`;
  $('#notif-sub').textContent = `Lo reciben los jugadores de ${c.nivel} que aceptaron avisos del complejo.`;
}
function renderBoard() {
  const list = FU.filter((c) => fuFilter === 'all' || c.tipo === fuFilter);
  $$('#fu-chips button').forEach((b) => {
    const k = b.dataset.f; b.querySelector('.n').textContent = FU.filter((c) => (k === 'all' || c.tipo === k) && faltan(c) > 0).length;
  });
  const cards = list.map((c) => {
    const f = faltan(c); const mine = c.jug.some((j) => j.me); const open = fuOpen.has(c.id);
    const dots = c.jug.map((j) => `<i class="${j.me ? 'me' : ''}"></i>`).join('') + Array.from({ length: Math.max(f, 0) }, () => '<i class="empty"></i>').join('');
    const players = c.jug.map((j) => `<li class="${j.me ? 'you' : ''}">${j.me ? 'Vos' : esc(j.n)}<span>${j.me ? 'recién sumado' : 'confirmado'}</span></li>`).join('')
      + Array.from({ length: Math.max(f, 0) }, () => '<li class="slot-open">Lugar libre<span>esperando</span></li>').join('');
    const action = mine
      ? `<button class="btn btn-ghost btn-sm" type="button" data-leave="${c.id}">Me bajo</button>`
      : (f > 0 ? `<button class="btn btn-ball btn-sm" type="button" data-join="${c.id}">Me sumo</button>` : '');
    return `<article class="fu${f <= 0 ? ' full' : ''}${fuFresh === c.id ? ' fresh' : ''}">
      <div class="fu-row"><span class="fu-type">${esc(c.label)} · ${c.tipo}</span><span class="need${f <= 0 ? ' done' : ''}">${needText(c)}</span></div>
      <h3>${esc(c.titulo)}</h3>
      <div class="fu-meta"><span><b>${esc(c.cuando)}</b> · ${esc(c.cancha)}</span><span>Nivel: ${esc(c.nivel)}</span></div>
      <div class="dots${c.unit === 'pareja' ? ' pairs' : ''}" role="img" aria-label="${c.jug.length} de ${c.cupo} lugares ocupados">${dots}</div>
      ${mine ? '<p class="fu-ok">✓ Estás adentro. Te llegó la confirmación por WhatsApp.</p>' : ''}
      <button class="link-btn" type="button" aria-expanded="${open}" data-toggle="${c.id}">${open ? 'Ocultar' : 'Ver'} ${c.unit === 'pareja' ? 'parejas' : 'jugadores'} (${c.jug.length}/${c.cupo})</button>
      ${open ? `<ul class="players">${players}</ul>` : ''}
      <div class="fu-foot"><span class="fu-price">${ars(c.precio)}<small>por ${c.unit}</small></span><div class="fu-actions">${action}</div></div>
    </article>`;
  }).join('');
  const publish = `<form class="publish" id="fu-form">
      <h3>Publicá un "falta uno"</h3>
      <p>Así lo haría el complejo desde su panel. El bot avisa solo.</p>
      <label for="fu-tipo">Qué es<select id="fu-tipo">
        <option value="p2">Pádel · partido 2 vs 2</option><option value="p1">Pádel · peloteo 1 vs 1</option><option value="f5">Fútbol 5 · partido</option><option value="ta">Pádel · torneo americano</option><option value="tp">Pádel · torneo por parejas</option><option value="cl">Pádel · clase grupal</option>
      </select></label>
      <div class="two">
        <label for="fu-cuando">Cuándo<select id="fu-cuando"><option>Hoy · 19:30</option><option>Hoy · 22:30</option><option>Mañana · 20:00</option><option>Sáb · 11:00</option></select></label>
        <label for="fu-faltan">Faltan<select id="fu-faltan"><option>1</option><option>2</option><option>3</option></select></label>
      </div>
      <label for="fu-nivel">Nivel<select id="fu-nivel"><option>Libre</option><option>Principiante</option><option>7ma categoría</option><option selected>6ta categoría</option><option>5ta categoría</option><option>4ta o más</option></select></label>
      <button class="btn btn-dark" type="submit">Publicar y avisar</button>
    </form>`;
  $('#board').innerHTML = publish + cards;
  $('#fu-form').addEventListener('submit', publishFU);
}
function publishFU(e) {
  e.preventDefault();
  const T = {
    p2: { tipo: 'partido', label: 'Pádel', titulo: 'Partido 2 vs 2', cupo: 4, unit: 'jugador', precio: 12000, cancha: 'Pádel 1' },
    p1: { tipo: 'partido', label: 'Pádel', titulo: 'Peloteo 1 vs 1', cupo: 2, unit: 'jugador', precio: 24000, cancha: 'Pádel 2' },
    f5: { tipo: 'partido', label: 'Fútbol 5', titulo: 'Partido 5 vs 5', cupo: 10, unit: 'jugador', precio: 6000, cancha: 'Fútbol 5' },
    ta: { tipo: 'torneo', label: 'Pádel', titulo: 'Americano', cupo: 16, unit: 'jugador', precio: 20000, cancha: 'Pádel 1 y 2' },
    tp: { tipo: 'torneo', label: 'Pádel', titulo: 'Torneo por parejas', cupo: 8, unit: 'pareja', precio: 40000, cancha: 'Pádel 1 y 2' },
    cl: { tipo: 'clase', label: 'Pádel', titulo: 'Clase grupal', cupo: 4, unit: 'jugador', precio: 15000, cancha: 'Pádel 2' },
  }[$('#fu-tipo').value];
  const f = Math.min(+$('#fu-faltan').value, T.cupo - 1);
  const id = fuNextId++;
  let jug = pick(T.cupo - f, id * 3);
  if (T.unit === 'pareja') jug = pairs(jug, 5);
  const c = { ...T, id, nivel: $('#fu-nivel').value, cuando: $('#fu-cuando').value, jug };
  FU.unshift(c); fuFresh = c.id;
  if (fuFilter !== 'all' && fuFilter !== c.tipo) { fuFilter = 'all'; setChips(); }
  setNotif(c); renderBoard();
}
function setChips() { $$('#fu-chips button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === fuFilter ? 'true' : 'false')); }
$('#fu-chips').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; fuFilter = b.dataset.f; setChips(); renderBoard(); });
$('#board').addEventListener('click', (e) => {
  const j = e.target.closest('[data-join]'); const l = e.target.closest('[data-leave]'); const t = e.target.closest('[data-toggle]');
  if (j) { const c = FU.find((x) => x.id === +j.dataset.join); if (faltan(c) > 0) { c.jug.push({ n: 'Vos', me: true }); fuFresh = null; renderBoard(); } }
  if (l) { const c = FU.find((x) => x.id === +l.dataset.leave); c.jug = c.jug.filter((x) => !x.me); renderBoard(); }
  if (t) {
    const id = +t.dataset.toggle; if (fuOpen.has(id)) fuOpen.delete(id); else fuOpen.add(id);
    renderBoard(); document.querySelector(`[data-toggle="${id}"]`)?.focus();
  }
});
setNotif(FU[0]); renderBoard();

/* ---------- Calculadora ---------- */
const cP = $('#c-precio'); const cC = $('#c-caidas'); const cH = $('#c-horas');
function calc() {
  const p = +cP.value; const c = +cC.value; const h = +cH.value;
  $('#o-precio').textContent = ars(p);
  $('#o-caidas').textContent = c;
  $('#o-horas').textContent = `${String(h).replace('.', ',')} h`;
  const loss = p * c * 4.3;
  $('#r-loss').textContent = ars(loss); $('#r-loss2').textContent = ars(loss); $('#r-cost').textContent = ars(ABONO_ARS);
  const max = Math.max(loss, ABONO_ARS, 1);
  $('#b-loss').style.width = `${(loss / max) * 100}%`; $('#b-cost').style.width = `${(ABONO_ARS / max) * 100}%`;
  $('#r-turnos').textContent = Math.ceil(ABONO_ARS / p);
  $('#r-hs').textContent = `${Math.round(h * 30 * 0.8)} h`;
}
[cP, cC, cH].forEach((x) => x.addEventListener('input', calc)); calc();

/* ---------- Deportes ---------- */
const SPORTS = {
  padel: { title: 'Pádel', meta: 'Turnos de 60, 90 o 120 minutos', items: ['Canchas techadas y descubiertas, con precio por franja horaria', 'Turnos fijos para los grupos de todas las semanas', 'Próximamente: "falta uno" por nivel, americanos y ranking del complejo'] },
  futbol: { title: 'Fútbol 5, 7, 8 y 11', meta: 'Cada cancha con su tamaño y su precio', items: ['El capitán reserva por WhatsApp o por la web en segundos', 'Ligas y equipos fijos cargados como turnos fijos', 'Próximamente: cada jugador paga su parte con un link'] },
  tenis: { title: 'Tenis', meta: 'Polvo de ladrillo, cemento o sintético', items: ['Bloqueos para riego y mantenimiento de las canchas', 'Turnos fijos para alumnos y profesores', 'Precios distintos para socios y no socios'] },
  basquet: { title: 'Básquet y vóley', meta: 'Alquiler por hora y por equipo', items: ['Canchas cubiertas compartidas con otros deportes', 'Reservas de equipos y escuelitas en la misma agenda', 'Reportes de ocupación por deporte'] },
};
const cv = $('#court-canvas'); const cx = cv.getContext('2d');
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function drawCourt(kind) {
  const W = cv.width; const H = cv.height; const line = cssVar('--on-court'); const ball = cssVar('--ball');
  cx.clearRect(0, 0, W, H);
  const fills = { padel: '#1E5A78', futbol: '#2F7A45', tenis: '#B4583A', basquet: '#B98A4E' };
  const m = 24; const w = W - 2 * m; const h = H - 2 * m;
  cx.fillStyle = fills[kind]; cx.beginPath(); if (cx.roundRect) cx.roundRect(m, m, w, h, 10); else cx.rect(m, m, w, h); cx.fill();
  cx.strokeStyle = line; cx.lineWidth = 3; cx.strokeRect(m + 10, m + 10, w - 20, h - 20);
  const X = m + 10; const Y = m + 10; const CW = w - 20; const CH = h - 20; const cy = Y + CH / 2; const ccx = X + CW / 2;
  cx.beginPath();
  if (kind === 'padel') {
    cx.moveTo(X, cy); cx.lineTo(X + CW, cy);
    cx.moveTo(X, Y + CH * 0.2); cx.lineTo(X + CW, Y + CH * 0.2); cx.moveTo(X, Y + CH * 0.8); cx.lineTo(X + CW, Y + CH * 0.8);
    cx.moveTo(ccx, Y + CH * 0.2); cx.lineTo(ccx, Y + CH * 0.8);
  } else if (kind === 'futbol') {
    cx.moveTo(X, cy); cx.lineTo(X + CW, cy); cx.moveTo(ccx + 40, cy); cx.arc(ccx, cy, 40, 0, Math.PI * 2);
    cx.rect(ccx - 55, Y, 110, 50); cx.rect(ccx - 55, Y + CH - 50, 110, 50);
  } else if (kind === 'tenis') {
    cx.moveTo(X, cy); cx.lineTo(X + CW, cy);
    cx.moveTo(X + CW * 0.12, Y); cx.lineTo(X + CW * 0.12, Y + CH); cx.moveTo(X + CW * 0.88, Y); cx.lineTo(X + CW * 0.88, Y + CH);
    cx.moveTo(X + CW * 0.12, Y + CH * 0.25); cx.lineTo(X + CW * 0.88, Y + CH * 0.25); cx.moveTo(X + CW * 0.12, Y + CH * 0.75); cx.lineTo(X + CW * 0.88, Y + CH * 0.75);
    cx.moveTo(ccx, Y + CH * 0.25); cx.lineTo(ccx, Y + CH * 0.75);
  } else {
    cx.moveTo(X, cy); cx.lineTo(X + CW, cy); cx.moveTo(ccx + 34, cy); cx.arc(ccx, cy, 34, 0, Math.PI * 2);
    cx.rect(ccx - 38, Y, 76, 90); cx.rect(ccx - 38, Y + CH - 90, 76, 90);
    cx.moveTo(ccx + 110, Y); cx.arc(ccx, Y, 110, 0, Math.PI); cx.moveTo(ccx - 110, Y + CH); cx.arc(ccx, Y + CH, 110, Math.PI, Math.PI * 2);
  }
  cx.stroke();
  if (kind === 'padel') { cx.strokeStyle = 'rgba(234,242,240,.35)'; cx.lineWidth = 6; cx.strokeRect(m + 2, m + 2, w - 4, h - 4); }
  cx.fillStyle = ball; cx.beginPath(); cx.arc(ccx + CW * 0.22, Y + CH * 0.33, 9, 0, Math.PI * 2); cx.fill();
}
function showSport(k) {
  const s = SPORTS[k];
  $$('.sports-tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.sport === k ? 'true' : 'false'));
  $('#sp-title').textContent = s.title; $('#sp-meta').textContent = s.meta;
  $('#sp-list').innerHTML = s.items.map((i) => `<li>${esc(i)}</li>`).join('');
  drawCourt(k);
}
$$('.sports-tabs button').forEach((b) => b.addEventListener('click', () => showSport(b.dataset.sport)));
showSport('padel');
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => showSport(document.querySelector('.sports-tabs [aria-selected="true"]').dataset.sport));

/* ---------- Precios ---------- */
function setBill(annual) {
  $('#bill-m').setAttribute('aria-pressed', annual ? 'false' : 'true');
  $('#bill-a').setAttribute('aria-pressed', annual ? 'true' : 'false');
  $$('.price b').forEach((b) => { b.textContent = `USD ${annual ? b.dataset.a : b.dataset.m}`; });
  $$('[data-per]').forEach((s) => { s.textContent = annual ? 'por año' : 'por mes'; });
  $$('[data-sub-a]').forEach((p) => { p.textContent = annual ? p.dataset.subA : ''; });
}
$('#bill-m').addEventListener('click', () => setBill(false));
$('#bill-a').addEventListener('click', () => setBill(true));
$$('.plan-cta').forEach((a) => a.addEventListener('click', () => { $('#f-plan').value = a.dataset.plan; }));

/* ---------- Formulario de contacto ---------- */
const form = $('#demo-form'); const out = $('#form-out');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const msg = `Hola NOVANTIQ! Soy ${d.get('nombre')} del complejo ${d.get('club')}`
    + (d.get('canchas') ? ` (${d.get('canchas')})` : '')
    + (d.get('plan') ? `. Me interesa el plan ${d.get('plan')}` : '')
    + '. Quiero un lugar en el Programa Fundadores de NOVANTIQ SPORTS.';
  const url = salesLink(msg);
  if (url) {
    out.innerHTML = `Mensaje listo. <a href="${url}" target="_blank" rel="noopener">Abrir WhatsApp para enviarlo</a>.`;
    window.open(url, '_blank', 'noopener');
  } else {
    out.textContent = 'El número comercial todavía no está configurado (Panel NOVANTIQ → Ajustes comerciales).';
  }
});
$('#copy-num').addEventListener('click', () => {
  const b = $('#copy-num'); const txt = $('#wa-num-text').textContent;
  const done = () => { b.textContent = 'Copiado'; setTimeout(() => { b.textContent = 'Copiar'; }, 1600); };
  const fallback = () => getSelection().selectAllChildren($('#wa-num-text'));
  try { navigator.clipboard.writeText(txt).then(done).catch(fallback); } catch { fallback(); }
});
