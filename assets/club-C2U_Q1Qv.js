import{A as e,C as t,D as n,E as r,M as i,N as a,P as o,b as s,f as c,g as l,h as u,k as d,n as f,s as p,t as m,v as h,w as g,x as _}from"./ui-CecIe10a.js";document.documentElement.dataset.theme=`light`;var v=m(`#app`),y=(location.pathname.match(/\/club\/([a-z0-9-]+)/)||[])[1]||new URLSearchParams(location.search).get(`c`),b=[`Dom`,`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`],x={club:null,sport:null,date:null,avail:null,loadingAvail:!1,slot:null,facility:null,step:`pick`};async function S(){if(!i)return _(v,u`<div class="center-box"><h2>Sistema no configurado</h2><p class="muted">Faltan las variables de conexión.</p></div>`);if(!y)return _(v,u`<div class="center-box"><h2>Complejo no indicado</h2><a class="btn" href="${e()}">Ir a NOVANTIQ SPORTS</a></div>`);try{x.club=await d(`public_get_club`,{p_slug:y})}catch(e){return _(v,u`<div class="center-box"><h2>${e.code===`CLUB_NOT_FOUND`?`No encontramos este complejo`:`No pudimos cargar la página`}</h2>
      <p class="muted">${e.message}</p><button class="btn" onclick="location.reload()">Reintentar</button></div>`)}let t=x.club.establishment;document.title=`Reservá en ${t.name}`,t.brand_color&&(document.body.style.setProperty(`--brand`,t.brand_color),document.body.style.setProperty(`--brand-ink`,h(t.brand_color))),x.sport=x.club.sports.length===1?x.club.sports[0].id:null,x.date=t.today,w(),C()}async function C(){x.loadingAvail=!0,x.slot=null,O();try{x.avail=await d(`public_get_availability`,{p_slug:y,p_date:x.date,p_sport_id:x.sport})}catch(e){x.avail={error:e}}x.loadingAvail=!1,O()}function w(){let{establishment:t}=x.club,n=t.name.trim()[0]?.toUpperCase()||`N`;_(v,u`<div class="club-page">
    ${t.is_demo?u`<div class="demo-ribbon">COMPLEJO DE DEMOSTRACIÓN — los datos son ficticios</div>`:``}
    ${t.is_preview?u`<div class="demo-ribbon">VISTA PREVIA — el complejo todavía no está publicado</div>`:``}
    <header class="club-hero"><div class="inner">
      <div class="club-logo">${t.logo_path?u`<img src="${a(t.logo_path)}" alt="Logo de ${t.name}">`:n}</div>
      <div><h1>${t.name}</h1><div class="muted small row">${t.address?u`<span>${l(`pin`)} ${[t.address,t.city].filter(Boolean).join(`, `)}</span>`:``}
        ${t.phone?u`<span>${l(`phone`)} ${t.phone}</span>`:``}</div></div>
    </div></header>
    <main class="club-wrap" id="main"></main>
    <footer class="club-footer">Reservas con <a href="${e()}">NOVANTIQ SPORTS</a></footer>
  </div>`),T()}function T(){let t=m(`#main`);if(x.step===`done`)return M(t);let{establishment:n,sports:i}=x.club;_(t,u`
    ${n.booking_available?``:u`<div class="alert warning">${l(`alert`)}<div>${n.booking_unavailable_reason===`ONLINE_BOOKING_DISABLED`?`Las reservas online no están disponibles en este momento.`:`Este complejo no está recibiendo reservas online.`}
      ${n.phone?`Comunicate al ${n.phone}.`:``}</div></div>`}
    <div class="club-cols">
      <div class="stack-lg">
        ${i.length>1?u`<section><div class="step-title"><b>1</b> Elegí el deporte</div><div class="sport-chips">
          <button class="chip" data-sport="" aria-pressed="${!x.sport}">Todos</button>
          ${i.map(e=>u`<button class="chip" data-sport="${e.id}" aria-pressed="${x.sport===e.id}">${e.name}</button>`)}
        </div></section>`:``}
        <section><div class="step-title"><b>${i.length>1?2:1}</b> Elegí el día</div><div class="date-strip" id="dates"></div></section>
        <section><div class="step-title"><b>${i.length>1?3:2}</b> Elegí cancha y horario</div><div id="slots" class="stack"></div></section>
      </div>
      <aside class="card summary" id="summary"></aside>
    </div>
    <section class="card stack" aria-label="Información del complejo">
      <h3>Información</h3>
      ${n.description?u`<p class="muted">${n.description}</p>`:``}
      <div class="grid grid-2">
        <div class="stack small"><span class="label">Horarios</span>${E()}</div>
        <div class="stack small"><span class="label">Cómo llegar</span>
          <span>${[n.address,n.city,n.province].filter(Boolean).join(`, `)||`Consultá con el complejo`}</span>
          ${n.directions?u`<span class="muted">${n.directions}</span>`:``}
          ${n.maps_url?u`<a class="btn btn-sm" href="${n.maps_url}" target="_blank" rel="noopener">${l(`pin`)} Abrir en mapas</a>`:``}</div>
      </div>
      ${n.cancellation_policy||n.booking_rules?u`<div class="stack small"><span class="label">Reglas y cancelaciones</span>
        ${n.cancellation_policy?u`<span>${n.cancellation_policy}</span>`:``}${n.booking_rules?u`<span class="muted">${n.booking_rules}</span>`:``}</div>`:``}
      <div class="row">
        ${r(n.whatsapp_phone)?u`<a class="btn" href="${r(n.whatsapp_phone,`Hola! Quiero consultar por una cancha`)}" target="_blank" rel="noopener">${l(`chat`)} WhatsApp</a>`:``}
        <a class="btn btn-ghost" href="${e(`reserva.html`)}">Consultar o cancelar una reserva</a>
      </div>
    </section>
    <div class="mobile-bar" id="mobile-bar"></div>`),f(`[data-sport]`,t).forEach(e=>e.addEventListener(`click`,()=>{x.sport=e.dataset.sport||null,T(),C()})),D(),O()}function E(){let e=x.club.hours;if(!e.length)return u`<span class="muted">Sin horario publicado</span>`;let t={};return e.forEach(e=>{(t[e.weekday]||=[]).push(`${e.opens_at}–${e.closes_at}`)}),[1,2,3,4,5,6,0].map(e=>u`<span class="row between"><span>${b[e]}</span><span>${t[e]?.join(`, `)||`Cerrado`}</span></span>`)}function D(){let e=x.club.establishment,t=Array.from({length:e.max_advance_days+1},(t,n)=>p(e.today,n));_(m(`#dates`),u`${t.map((e,t)=>{let n=new Date(`${e}T12:00:00Z`);return u`<button class="date-chip" data-date="${e}" aria-pressed="${e===x.date}">
      <span class="dow">${t===0?`Hoy`:t===1?`Mañ`:b[n.getUTCDay()]}</span><span class="day">${n.getUTCDate()}</span>
      <span class="mon">${c(e,null,{month:`short`}).replace(`.`,``)}</span></button>`})}`),f(`[data-date]`).forEach(e=>e.addEventListener(`click`,()=>{x.date=e.dataset.date,f(`[data-date]`).forEach(t=>t.setAttribute(`aria-pressed`,String(t===e))),C()}))}function O(){let e=m(`#slots`);if(!e)return;let n=x.club.establishment.currency;if(x.loadingAvail)_(e,u`${[1,2].map(()=>u`<div class="facility"><div class="skeleton" style="width:40%"></div><div class="skeleton" style="height:56px"></div></div>`)}`);else if(x.avail?.error)_(e,u`<div class="empty">${l(`alert`)}<h3>No pudimos cargar los horarios</h3><p>${x.avail.error.message}</p><button class="btn" id="retry">Reintentar</button></div>`),m(`#retry`).addEventListener(`click`,C);else{let r=x.avail?.facilities||[],i=r.some(e=>e.slots.some(e=>e.status===`available`));_(e,u`${r.length?``:u`<div class="empty">${l(`calendar`)}<h3>Sin canchas para mostrar</h3><p>${x.avail?.notice||`Probá con otro día o deporte.`}</p></div>`}
      ${r.length&&!i?u`<div class="alert info">${l(`calendar`)}<div>No quedan turnos libres para este día. Probá con otra fecha.</div></div>`:``}
      ${r.map(e=>{let r=x.club.facilities.find(t=>t.id===e.id)||{};return u`<article class="facility"><div class="facility-head"><div><strong>${e.name}</strong>
          <div class="muted small">${[r.facility_type,`${e.slot_minutes} min`,...r.amenities||[]].filter(Boolean).join(` · `)}</div></div></div>
          ${e.slots.length?u`<div class="slots">${e.slots.map(r=>u`<button class="slot" data-f="${e.id}" data-s="${r.starts_at}"
            ${r.status!==`available`||!x.club.establishment.booking_available?t(`disabled`):``}
            aria-pressed="${x.slot?.starts_at===r.starts_at&&x.facility?.id===e.id}"
            aria-label="${e.name} ${r.local_start} ${r.status===`available`?s(r.price,n):`no disponible`}">
            <span class="t">${r.local_start}</span><span class="p">${r.status===`available`?s(r.price,n):r.status===`past`?`Finalizado`:`Ocupado`}</span></button>`)}</div>`:u`<p class="muted small">Cerrado este día.</p>`}</article>`})}`),f(`.slot[data-s]`,e).forEach(t=>t.addEventListener(`click`,()=>{let n=r.find(e=>e.id===t.dataset.f);x.facility=n,x.slot=n.slots.find(e=>e.starts_at===t.dataset.s),f(`.slot`,e).forEach(e=>e.setAttribute(`aria-pressed`,String(e===t))),k(),matchMedia(`(max-width: 860px)`).matches&&m(`#summary`).scrollIntoView({behavior:`smooth`})}))}k()}function k(){let e=m(`#summary`);if(!e)return;let t=x.club.establishment,n=m(`#mobile-bar`);if(!x.slot){_(e,u`<h3>Tu reserva</h3><p class="muted small">Elegí un horario disponible para continuar.</p>`),n&&n.classList.add(`hidden`);return}let r=x.slot,i=x.facility;n&&(n.classList.remove(`hidden`),_(n,u`<div><strong>${r.local_start} · ${i.name}</strong><div class="small muted">${s(r.price,t.currency)}</div></div>
      <a class="btn btn-primary" href="#summary">Continuar</a>`)),_(e,u`<h3>Tu reserva</h3>
    <dl><dt>Día</dt><dd>${c(x.date,null,{weekday:`long`,day:`numeric`,month:`long`})}</dd>
      <dt>Horario</dt><dd>${r.local_start} a ${r.local_end}</dd><dt>Cancha</dt><dd>${i.name}</dd></dl>
    <div class="total"><span>Total</span><span>${s(r.price,t.currency)}</span></div>
    <form id="book-form" class="stack" novalidate>
      <label class="field"><span>Nombre y apellido</span><input class="input" name="name" autocomplete="name" required minlength="2" maxlength="80"><small class="field-error"></small></label>
      <label class="field"><span>Celular (con código de área)</span><input class="input" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="11 2345 6789"><small class="field-error"></small></label>
      <label class="field"><span>Email <span class="muted">(opcional)</span></span><input class="input" name="email" type="email" autocomplete="email" maxlength="160"><small class="field-error"></small></label>
      <label class="field"><span>Comentario <span class="muted">(opcional)</span></span><input class="input" name="notes" maxlength="300"></label>
      <div class="sr-only" aria-hidden="true"><label>Sitio web <input name="website" tabindex="-1" autocomplete="off"></label></div>
      <label class="check"><input type="checkbox" name="optin" checked> Quiero recibir la confirmación y recordatorios por WhatsApp</label>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Confirmar reserva</button>
      <p class="tiny muted">El pago se realiza en el complejo. ${t.cancellation_min_hours?`Podés cancelar online hasta ${t.cancellation_min_hours} h antes.`:``}</p>
    </form>`),m(`#book-form`).addEventListener(`submit`,j),f(`#book-form .input`).forEach(e=>e.addEventListener(`input`,()=>{e.removeAttribute(`aria-invalid`);let t=e.closest(`.field`)?.querySelector(`.field-error`);t&&(t.textContent=``)}))}function A(e){let t={},n=e.name.value.trim(),r=e.phone.value.replace(/\D/g,``),i=e.email.value.trim();n.length<2&&(t.name=`Ingresá tu nombre.`),(r.length<8||r.length>15)&&(t.phone=`Ingresá un celular válido con código de área.`),i&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i)&&(t.email=`El email no es válido.`);for(let n of[`name`,`phone`,`email`]){let r=e[n];r.setAttribute(`aria-invalid`,t[n]?`true`:`false`),r.closest(`.field`).querySelector(`.field-error`).textContent=t[n]||``}return!Object.keys(t).length}async function j(e){e.preventDefault();let t=e.currentTarget;if(!A(t))return;let r=t.querySelector(`[type=submit]`);await n(r,async()=>{try{x.result=await d(`public_create_booking`,{p_slug:y,p_facility_id:x.facility.id,p_starts_at:x.slot.starts_at,p_full_name:t.name.value,p_phone:t.phone.value,p_email:t.email.value||null,p_notes:t.notes.value||null,p_whatsapp_opt_in:t.optin.checked,p_website:t.website.value||null}),x.step=`done`,T(),window.scrollTo({top:0,behavior:`smooth`})}catch(e){if([`SLOT_UNAVAILABLE`,`SLOT_BLOCKED`,`TOO_SOON`,`SLOT_NOT_OFFERED`].includes(e.code))g(e.message,`error`),C();else throw e}})}function M(e){let t=x.result,n=t.establishment,i=`${o(`reserva.html`)}?c=${encodeURIComponent(t.code)}&t=${encodeURIComponent(t.manage_token)}`,a=t.status===`pending`;_(e,u`<section class="card stack-lg" style="max-width:560px;margin:0 auto;text-align:center">
    <div class="success-mark">${l(a?`clock`:`check`)}</div>
    <div><h2>${a?`Solicitud recibida`:`¡Reserva confirmada!`}</h2>
      <p class="muted">${a?`El complejo debe confirmar tu turno. Te vamos a avisar.`:`Te esperamos. Guardá tu código de reserva.`}</p></div>
    <div class="code-box mono" aria-label="Código de reserva">${t.code}</div>
    <dl style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;text-align:left;margin:0">
      <dt class="muted">Día</dt><dd style="margin:0;text-align:right;font-weight:600">${c(t.local_date,null,{weekday:`long`,day:`numeric`,month:`long`})}</dd>
      <dt class="muted">Horario</dt><dd style="margin:0;text-align:right;font-weight:600">${t.local_start} a ${t.local_end}</dd>
      <dt class="muted">Cancha</dt><dd style="margin:0;text-align:right;font-weight:600">${t.facility.name} (${t.facility.sport})</dd>
      <dt class="muted">Precio</dt><dd style="margin:0;text-align:right;font-weight:600">${s(t.price_amount,t.currency)} · se abona en el complejo</dd>
    </dl>
    ${n.address?u`<p class="small">${l(`pin`)} ${[n.address,n.city].filter(Boolean).join(`, `)}${n.directions?u`<br><span class="muted">${n.directions}</span>`:``}</p>`:``}
    <div class="stack">
      <a class="btn btn-primary" href="${i}">Ver o cancelar mi reserva</a>
      <button class="btn" id="copy">${l(`link`)} Copiar enlace de gestión</button>
      ${n.maps_url?u`<a class="btn btn-ghost" href="${n.maps_url}" target="_blank" rel="noopener">Cómo llegar</a>`:``}
      ${r(n.whatsapp_phone)?u`<a class="btn btn-ghost" href="${r(n.whatsapp_phone,`Hola! Tengo la reserva ${t.code}`)}" target="_blank" rel="noopener">${l(`chat`)} Escribir al complejo</a>`:``}
    </div>
    <p class="tiny muted">Guardá el enlace de gestión: es la forma segura de consultar o cancelar tu turno.</p>
    <button class="btn btn-ghost btn-sm" id="again">Hacer otra reserva</button>
  </section>`),m(`#copy`).addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(i),g(`Enlace copiado`,`success`)}catch{prompt(`Copiá el enlace:`,i)}}),m(`#again`).addEventListener(`click`,()=>{x.step=`pick`,x.slot=null,T(),C()})}S();