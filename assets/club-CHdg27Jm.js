import{a as e,i as t,r as n,t as r}from"./supabase-Dff27ir3.js";import{A as i,C as a,D as o,E as s,T as c,_ as l,g as u,k as d,l as f,m as p,n as m,t as h,v as g,w as _,x as v,y}from"./ui-DZUkhcmO.js";/* empty css            */import{n as b,r as x}from"./api-CQHMsbaL.js";import{a as S,i as C,n as w,o as T,r as E,t as D}from"./pwa-DzkdyB55.js";document.documentElement.dataset.theme=`light`,D();var O=h(`#app`),k=(location.pathname.match(/\/club\/([a-z0-9-]+)/)||[])[1]||new URLSearchParams(location.search).get(`c`),A=[`Dom`,`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`],j={club:null,sport:null,date:null,avail:null,loadingAvail:!1,slot:null,facility:null,step:`pick`,minutes:null,durations:[],deposit:null},M=e=>e>0?Math.min(Math.max(Math.round(e*j.deposit.percent/100/100)*100,100),e):0;async function N(){if(!n)return _(O,g`<div class="center-box"><h2>Sistema no configurado</h2><p class="muted">Faltan las variables de conexión.</p></div>`);if(!k)return _(O,g`<div class="center-box"><h2>Complejo no indicado</h2><a class="btn" href="${r()}">Ir a NOVANTIQ SPORTS</a></div>`);try{[j.club,j.deposit]=await Promise.all([x(`public_get_club`,{p_slug:k}),x(`public_get_deposit_policy`,{p_slug:k}).catch(()=>null)]),j.deposit?.required||(j.deposit=null)}catch(e){return _(O,g`<div class="center-box"><h2>${e.code===`CLUB_NOT_FOUND`?`No encontramos este complejo`:`No pudimos cargar la página`}</h2>
      <p class="muted">${e.message}</p><button class="btn" onclick="location.reload()">Reintentar</button></div>`)}let e=j.club.establishment;document.title=`Reservá en ${e.name}`,e.brand_color&&(document.body.style.setProperty(`--brand`,e.brand_color),document.body.style.setProperty(`--brand-ink`,v(e.brand_color))),T({name:e.name,color:e.brand_color}),j.sport=j.club.sports.length===1?j.club.sports[0].id:null,j.date=e.today,F(),P()}async function P(){j.loadingAvail=!0,j.slot=null,z();try{j.avail=await x(`public_get_availability`,{p_slug:k,p_date:j.date,p_sport_id:j.sport,p_minutes:j.minutes}),j.minutes===null&&(j.durations=[...new Set(j.avail.facilities.flatMap(e=>e.durations||[]))].sort((e,t)=>e-t))}catch(e){j.avail={error:e}}j.loadingAvail=!1,z()}function F(){let{establishment:e}=j.club,n=e.name.trim()[0]?.toUpperCase()||`N`;_(O,g`<div class="club-page">
    ${e.is_demo?g`<div class="demo-ribbon">COMPLEJO DE DEMOSTRACIÓN — los datos son ficticios</div>`:``}
    ${e.is_preview?g`<div class="demo-ribbon">VISTA PREVIA — el complejo todavía no está publicado</div>`:``}
    <header class="club-hero"><div class="inner">
      <div class="club-logo">${e.logo_path?g`<img src="${t(e.logo_path)}" alt="Logo de ${e.name}">`:n}</div>
      <div><h1>${e.name}</h1><div class="muted small row">${e.address?g`<span>${y(`pin`)} ${[e.address,e.city].filter(Boolean).join(`, `)}</span>`:``}
        ${e.phone?g`<span>${y(`phone`)} ${e.phone}</span>`:``}</div></div>
    </div></header>
    <main class="club-wrap" id="main"></main>
    <footer class="club-footer"><div id="install-box" class="row" style="justify-content:center;margin-bottom:10px"></div>Reservas con <a href="${r()}">NOVANTIQ SPORTS</a></footer>
  </div>`),I(),K()}function I(){let e=h(`#main`);if(j.step===`done`)return U(e);let{establishment:t,sports:n}=j.club;_(e,g`
    ${t.booking_available?``:g`<div class="alert warning">${y(`alert`)}<div>${t.booking_unavailable_reason===`ONLINE_BOOKING_DISABLED`?`Las reservas online no están disponibles en este momento.`:`Este complejo no está recibiendo reservas online.`}
      ${t.phone?`Comunicate al ${t.phone}.`:``}</div></div>`}
    <div class="club-cols">
      <div class="stack-lg">
        ${n.length>1?g`<section><div class="step-title"><b>1</b> Elegí el deporte</div><div class="sport-chips">
          <button class="chip" data-sport="" aria-pressed="${!j.sport}">Todos</button>
          ${n.map(e=>g`<button class="chip" data-sport="${e.id}" aria-pressed="${j.sport===e.id}">${e.name}</button>`)}
        </div></section>`:``}
        <section><div class="step-title"><b>${n.length>1?2:1}</b> Elegí el día</div><div class="date-strip" id="dates"></div></section>
        <section><div class="step-title"><b>${n.length>1?3:2}</b> Elegí cancha y horario</div><div id="slots" class="stack"></div></section>
      </div>
      <aside class="card summary" id="summary"></aside>
    </div>
    <section class="card stack" aria-label="Información del complejo">
      <h3>Información</h3>
      ${t.description?g`<p class="muted">${t.description}</p>`:``}
      <div class="grid grid-2">
        <div class="stack small"><span class="label">Horarios</span>${L()}</div>
        <div class="stack small"><span class="label">Cómo llegar</span>
          <span>${[t.address,t.city,t.province].filter(Boolean).join(`, `)||`Consultá con el complejo`}</span>
          ${t.directions?g`<span class="muted">${t.directions}</span>`:``}
          ${t.maps_url?g`<a class="btn btn-sm" href="${t.maps_url}" target="_blank" rel="noopener">${y(`pin`)} Abrir en mapas</a>`:``}</div>
      </div>
      ${t.cancellation_policy||t.booking_rules?g`<div class="stack small"><span class="label">Reglas y cancelaciones</span>
        ${t.cancellation_policy?g`<span>${t.cancellation_policy}</span>`:``}${t.booking_rules?g`<span class="muted">${t.booking_rules}</span>`:``}</div>`:``}
      <div class="row">
        ${d(t.whatsapp_phone)?g`<a class="btn" href="${d(t.whatsapp_phone,`Hola! Quiero consultar por una cancha`)}" target="_blank" rel="noopener">${y(`chat`)} WhatsApp</a>`:``}
        <a class="btn btn-ghost" href="${r(`reserva.html`)}">Consultar o cancelar una reserva</a>
      </div>
    </section>
    <div class="mobile-bar" id="mobile-bar"></div>`),m(`[data-sport]`,e).forEach(e=>e.addEventListener(`click`,()=>{j.sport=e.dataset.sport||null,j.minutes=null,j.durations=[],I(),P()})),R(),z()}function L(){let e=j.club.hours;if(!e.length)return g`<span class="muted">Sin horario publicado</span>`;let t={};return e.forEach(e=>{(t[e.weekday]||=[]).push(`${e.opens_at}–${e.closes_at}`)}),[1,2,3,4,5,6,0].map(e=>g`<span class="row between"><span>${A[e]}</span><span>${t[e]?.join(`, `)||`Cerrado`}</span></span>`)}function R(){let e=j.club.establishment,t=Array.from({length:e.max_advance_days+1},(t,n)=>f(e.today,n));_(h(`#dates`),g`${t.map((e,t)=>{let n=new Date(`${e}T12:00:00Z`);return g`<button class="date-chip" data-date="${e}" aria-pressed="${e===j.date}">
      <span class="dow">${t===0?`Hoy`:t===1?`Mañ`:A[n.getUTCDay()]}</span><span class="day">${n.getUTCDate()}</span>
      <span class="mon">${p(e,null,{month:`short`}).replace(`.`,``)}</span></button>`})}`),m(`[data-date]`).forEach(e=>e.addEventListener(`click`,()=>{j.date=e.dataset.date,m(`[data-date]`).forEach(t=>t.setAttribute(`aria-pressed`,String(t===e))),P()}))}function z(){let e=h(`#slots`);if(!e)return;let t=j.club.establishment.currency;if(j.loadingAvail)_(e,g`${[1,2].map(()=>g`<div class="facility"><div class="skeleton" style="width:40%"></div><div class="skeleton" style="height:56px"></div></div>`)}`);else if(j.avail?.error)_(e,g`<div class="empty">${y(`alert`)}<h3>No pudimos cargar los horarios</h3><p>${j.avail.error.message}</p><button class="btn" id="retry">Reintentar</button></div>`),h(`#retry`).addEventListener(`click`,P);else{let n=j.avail?.facilities||[],r=n.some(e=>e.slots.some(e=>e.status===`available`));_(e,g`${j.durations.length>1?g`<div class="stack" style="gap:8px"><span class="label">Duración del turno</span><div class="sport-chips" id="durations">
        <button class="chip" data-min="" aria-pressed="${j.minutes===null}">Estándar</button>
        ${j.durations.map(e=>g`<button class="chip" data-min="${e}" aria-pressed="${j.minutes===e}">${u(e)}</button>`)}</div></div>`:``}
      ${n.length?``:g`<div class="empty">${y(`calendar`)}<h3>Sin canchas para mostrar</h3><p>${j.avail?.notice||`Probá con otro día o deporte.`}</p></div>`}
      ${n.length&&!r?g`<div class="alert info">${y(`calendar`)}<div>No quedan turnos libres para este día. Probá con otra fecha o anotate en la lista de espera.</div></div>`:``}
      ${n.map(e=>{let n=j.club.facilities.find(t=>t.id===e.id)||{};return g`<article class="facility"><div class="facility-head"><div><strong>${e.name}</strong>
          <div class="muted small">${[n.facility_type,`${e.slot_minutes} min`,...n.amenities||[]].filter(Boolean).join(` · `)}</div></div></div>
          ${e.slots.length?g`<div class="slots">${e.slots.map(n=>g`<button class="slot" data-f="${e.id}" data-s="${n.starts_at}"
            ${n.status!==`available`||!j.club.establishment.booking_available?s(`disabled`):``}
            aria-pressed="${j.slot?.starts_at===n.starts_at&&j.facility?.id===e.id}"
            aria-label="${e.name} ${n.local_start} ${n.status===`available`?a(n.price,t):`no disponible`}">
            <span class="t">${n.local_start}</span><span class="p">${n.status===`available`?a(n.price,t):n.status===`past`?`Finalizado`:`Ocupado`}</span></button>`)}</div>`:g`<p class="muted small">Cerrado este día.</p>`}</article>`})}
      ${n.length&&j.club.establishment.booking_available?g`<div class="waitlist-cta ${r?``:`strong`}"><div>${y(`bell`)}<span><strong>${r?`¿No te sirve ningún horario?`:`¿Querés que te avisemos?`}</strong>
        <span class="muted small"> Si se libera un turno, el complejo te escribe.</span></span></div><button class="btn ${r?``:`btn-primary`} btn-sm" id="waitlist">Anotarme en lista de espera</button></div>`:``}`),m(`[data-min]`,e).forEach(e=>e.addEventListener(`click`,()=>{j.minutes=e.dataset.min?Number(e.dataset.min):null,P()})),h(`#waitlist`,e)?.addEventListener(`click`,G),m(`.slot[data-s]`,e).forEach(t=>t.addEventListener(`click`,()=>{let r=n.find(e=>e.id===t.dataset.f);j.facility=r,j.slot=r.slots.find(e=>e.starts_at===t.dataset.s),m(`.slot`,e).forEach(e=>e.setAttribute(`aria-pressed`,String(e===t))),B(),matchMedia(`(max-width: 860px)`).matches&&h(`#summary`).scrollIntoView({behavior:`smooth`})}))}B()}function B(){let e=h(`#summary`);if(!e)return;let t=j.club.establishment,n=h(`#mobile-bar`);if(!j.slot){_(e,g`<h3>Tu reserva</h3><p class="muted small">Elegí un horario disponible para continuar.</p>`),n&&n.classList.add(`hidden`);return}let r=j.slot,i=j.facility;n&&(n.classList.remove(`hidden`),_(n,g`<div><strong>${r.local_start} · ${i.name}</strong><div class="small muted">${a(r.price,t.currency)}</div></div>
      <a class="btn btn-primary" href="#summary">Continuar</a>`)),_(e,g`<h3>Tu reserva</h3>
    <dl><dt>Día</dt><dd>${p(j.date,null,{weekday:`long`,day:`numeric`,month:`long`})}</dd>
      <dt>Horario</dt><dd>${r.local_start} a ${r.local_end}</dd><dt>Cancha</dt><dd>${i.name}</dd></dl>
    <div class="total"><span>Total</span><span>${a(r.price,t.currency)}</span></div>
    ${j.deposit&&r.price>0?g`<div class="deposit-note">${y(`lock`)}<div><strong>Seña para confirmar: ${a(M(r.price),t.currency)}</strong>
      <span class="small muted">Se paga con Mercado Pago al reservar (${j.deposit.percent} %). El resto, en el complejo. Tenés ${j.deposit.hold_minutes} minutos para pagarla.</span></div></div>`:``}
    <form id="book-form" class="stack" novalidate>
      <label class="field"><span>Nombre y apellido</span><input class="input" name="name" autocomplete="name" required minlength="2" maxlength="80"><small class="field-error"></small></label>
      <label class="field"><span>Celular (con código de área)</span><input class="input" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="11 2345 6789"><small class="field-error"></small></label>
      <label class="field"><span>Email <span class="muted">(opcional)</span></span><input class="input" name="email" type="email" autocomplete="email" maxlength="160"><small class="field-error"></small></label>
      <label class="field"><span>Comentario <span class="muted">(opcional)</span></span><input class="input" name="notes" maxlength="300"></label>
      <div class="sr-only" aria-hidden="true"><label>Sitio web <input name="website" tabindex="-1" autocomplete="off"></label></div>
      <label class="check"><input type="checkbox" name="optin" checked> Quiero recibir la confirmación y recordatorios por WhatsApp</label>
      <button class="btn btn-primary btn-lg btn-block" type="submit">${j.deposit&&r.price>0?`Reservar y pagar la seña`:`Confirmar reserva`}</button>
      <p class="tiny muted">${j.deposit&&r.price>0?`El saldo se paga en el complejo.`:`El pago se realiza en el complejo.`} ${t.cancellation_min_hours?`Podés cancelar online hasta ${t.cancellation_min_hours} h antes.`:``}</p>
    </form>`),h(`#book-form`).addEventListener(`submit`,H),m(`#book-form .input`).forEach(e=>e.addEventListener(`input`,()=>{e.removeAttribute(`aria-invalid`);let t=e.closest(`.field`)?.querySelector(`.field-error`);t&&(t.textContent=``)}))}function V(e){let t={},n=e.name.value.trim(),r=e.phone.value.replace(/\D/g,``),i=e.email.value.trim();n.length<2&&(t.name=`Ingresá tu nombre.`),(r.length<8||r.length>15)&&(t.phone=`Ingresá un celular válido con código de área.`),i&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i)&&(t.email=`El email no es válido.`);for(let n of[`name`,`phone`,`email`]){let r=e[n];r.setAttribute(`aria-invalid`,t[n]?`true`:`false`),r.closest(`.field`).querySelector(`.field-error`).textContent=t[n]||``}return!Object.keys(t).length}async function H(e){e.preventDefault();let t=e.currentTarget;if(!V(t))return;let n=t.querySelector(`[type=submit]`);await i(n,async()=>{try{j.result=await x(`public_create_booking`,{p_slug:k,p_facility_id:j.facility.id,p_starts_at:j.slot.starts_at,p_full_name:t.name.value,p_phone:t.phone.value,p_email:t.email.value||null,p_notes:t.notes.value||null,p_whatsapp_opt_in:t.optin.checked,p_website:t.website.value||null,p_minutes:j.minutes}),j.step=`done`,I(),window.scrollTo({top:0,behavior:`smooth`})}catch(e){if([`SLOT_UNAVAILABLE`,`SLOT_BLOCKED`,`TOO_SOON`,`SLOT_NOT_OFFERED`].includes(e.code))o(e.message,`error`),P();else throw e}})}function U(t){let n=j.result,r=n.establishment,i=`${e(`reserva.html`)}?c=${encodeURIComponent(n.code)}&t=${encodeURIComponent(n.manage_token)}`;if(n.deposit?.status===`pending`)return W(t,n,i);let s=n.status===`pending`;_(t,g`<section class="card stack-lg" style="max-width:560px;margin:0 auto;text-align:center">
    <div class="success-mark">${y(s?`clock`:`check`)}</div>
    <div><h2>${s?`Solicitud recibida`:`¡Reserva confirmada!`}</h2>
      <p class="muted">${s?`El complejo debe confirmar tu turno. Te vamos a avisar.`:`Te esperamos. Guardá tu código de reserva.`}</p></div>
    <div class="code-box mono" aria-label="Código de reserva">${n.code}</div>
    <dl style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;text-align:left;margin:0">
      <dt class="muted">Día</dt><dd style="margin:0;text-align:right;font-weight:600">${p(n.local_date,null,{weekday:`long`,day:`numeric`,month:`long`})}</dd>
      <dt class="muted">Horario</dt><dd style="margin:0;text-align:right;font-weight:600">${n.local_start} a ${n.local_end}</dd>
      <dt class="muted">Cancha</dt><dd style="margin:0;text-align:right;font-weight:600">${n.facility.name} (${n.facility.sport})</dd>
      <dt class="muted">Precio</dt><dd style="margin:0;text-align:right;font-weight:600">${a(n.price_amount,n.currency)} · se abona en el complejo</dd>
    </dl>
    ${r.address?g`<p class="small">${y(`pin`)} ${[r.address,r.city].filter(Boolean).join(`, `)}${r.directions?g`<br><span class="muted">${r.directions}</span>`:``}</p>`:``}
    <div class="stack">
      <a class="btn btn-primary" href="${i}">Ver o cancelar mi reserva</a>
      <button class="btn" id="copy">${y(`link`)} Copiar enlace de gestión</button>
      ${r.maps_url?g`<a class="btn btn-ghost" href="${r.maps_url}" target="_blank" rel="noopener">Cómo llegar</a>`:``}
      ${d(r.whatsapp_phone)?g`<a class="btn btn-ghost" href="${d(r.whatsapp_phone,`Hola! Tengo la reserva ${n.code}`)}" target="_blank" rel="noopener">${y(`chat`)} Escribir al complejo</a>`:``}
    </div>
    <p class="tiny muted">Guardá el enlace de gestión: es la forma segura de consultar o cancelar tu turno.</p>
    <button class="btn btn-ghost btn-sm" id="again">Hacer otra reserva</button>
  </section>`),h(`#copy`).addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(i),o(`Enlace copiado`,`success`)}catch{prompt(`Copiá el enlace:`,i)}}),h(`#again`).addEventListener(`click`,()=>{j.step=`pick`,j.slot=null,I(),P()})}function W(e,t,n){let r=new Date(t.deposit.expires_at).toLocaleTimeString(`es-AR`,{hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`,timeZone:t.establishment.timezone});_(e,g`<section class="card stack-lg" style="max-width:560px;margin:0 auto;text-align:center">
    <div class="success-mark pay">${y(`lock`)}</div>
    <div><h2>Falta pagar la seña</h2>
      <p class="muted">Guardamos tu turno hasta las <strong>${r} h</strong>. Si la seña no se paga a tiempo, el horario se libera.</p></div>
    <dl class="pay-sum"><dt>Turno</dt><dd>${p(t.local_date,null,{weekday:`long`,day:`numeric`,month:`long`})}, ${t.local_start} a ${t.local_end}</dd>
      <dt>Cancha</dt><dd>${t.facility.name}</dd>
      <dt>Seña</dt><dd class="big">${a(t.deposit.amount,t.deposit.currency)}</dd>
      <dt>Saldo en el complejo</dt><dd>${a(t.price_amount-t.deposit.amount,t.currency)}</dd></dl>
    <button class="btn btn-primary btn-lg btn-block" id="pay">Pagar ${a(t.deposit.amount,t.deposit.currency)} con Mercado Pago</button>
    <p class="tiny muted">Código de reserva <span class="mono">${t.code}</span>. Si cerrás esta página, podés pagar desde el enlace de tu reserva.</p>
    <a class="btn btn-ghost btn-sm" href="${n}">Ver mi reserva</a>
  </section>`),h(`#pay`).addEventListener(`click`,e=>i(e.currentTarget,async()=>{let{checkout_url:e}=await b(`payments-mercadopago`,{action:`checkout`,code:t.code,token:t.manage_token});location.href=e}))}function G(){let e=j.club.establishment,t=c({title:`Lista de espera`,body:g`<form id="wl" class="stack" novalidate>
      <p class="muted small" style="margin:0">Dejá tus datos y, si se libera un turno para <strong>${p(j.date,null,{weekday:`long`,day:`numeric`,month:`long`})}</strong>, ${e.name} se comunica con vos.
        No es una reserva: el turno se confirma recién cuando te escriban y lo aceptes.</p>
      <label class="field"><span>Nombre y apellido</span><input class="input" name="name" required minlength="2" maxlength="80" autocomplete="name"></label>
      <label class="field"><span>Celular (con código de área)</span><input class="input" name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="11 2345 6789"></label>
      ${j.club.sports.length>1?g`<label class="field"><span>Deporte</span><select class="input" name="sport"><option value="">Cualquiera</option>
        ${j.club.sports.map(e=>g`<option value="${e.id}" ${s(e.id===j.sport?`selected`:``)}>${e.name}</option>`)}</select></label>`:``}
      <div class="form-grid"><label class="field"><span>Desde <span class="muted">(opcional)</span></span><input class="input" type="time" name="from"></label>
        <label class="field"><span>Hasta <span class="muted">(opcional)</span></span><input class="input" type="time" name="to"></label></div>
      <div class="sr-only" aria-hidden="true"><label>Sitio web <input name="website" tabindex="-1" autocomplete="off"></label></div>
      <small class="field-error" id="wl-error"></small></form>`,footer:g`<button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" id="wl-go">Avisarme</button>`});h(`#wl-go`,t.el).addEventListener(`click`,e=>i(e.target,async()=>{let e=l(h(`#wl`,t.el)),n=h(`#wl-error`,t.el);n.textContent=``,e.name.trim().length<2?n.textContent=`Ingresá tu nombre.`:e.phone.replace(/\D/g,``).length<8?n.textContent=`Ingresá un celular válido con código de área.`:e.from&&!e.to||!e.from&&e.to||e.from&&e.to<=e.from?n.textContent=`Revisá el rango horario.`:(await x(`public_join_waitlist`,{p_slug:k,p_date:j.date,p_full_name:e.name,p_phone:e.phone,p_sport_id:e.sport||null,p_from_time:e.from||null,p_to_time:e.to||null,p_website:e.website||null}),t.close(),o(`¡Listo! Te anotamos en la lista de espera.`,`success`))}))}function K(){let e=h(`#install-box`);e&&!E()&&C(t=>{t?(_(e,g`<button class="btn btn-sm" id="install">${y(`smartphone`)} Instalar la app del complejo</button>`),h(`#install`).addEventListener(`click`,S)):w()?_(e,g`<span class="tiny muted">En iPhone: tocá Compartir y “Agregar a inicio” para tener la app del complejo.</span>`):_(e,``)})}N();