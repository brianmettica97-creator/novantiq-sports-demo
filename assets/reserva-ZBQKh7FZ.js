import{A as e,D as t,b as n,c as r,f as i,g as a,h as o,k as s,l as c,r as l,t as u,w as d,x as f}from"./ui-CecIe10a.js";document.documentElement.dataset.theme=`light`;var p=u(`#app`),m=new URLSearchParams(location.search),h={code:m.get(`c`),token:m.get(`t`),phone:null};h.token&&history.replaceState(null,``,location.pathname);function g(e=``){f(p,o`<div class="stack-lg"><div><h1>Consultar mi reserva</h1><p class="muted">Ingresá el código que recibiste y el celular con el que reservaste.</p></div>
    ${e?o`<div class="alert warning">${a(`alert`)}<div>${e}</div></div>`:``}
    <form class="card stack" id="f">
      <label class="field"><span>Código de reserva</span><input class="input mono" name="code" required placeholder="NQ-XXXXXX" value="${h.code||``}"></label>
      <label class="field"><span>Celular</span><input class="input" name="phone" type="tel" required placeholder="11 2345 6789"></label>
      <button class="btn btn-primary btn-block">Buscar</button>
    </form></div>`),u(`#f`).addEventListener(`submit`,async e=>{e.preventDefault(),h={code:e.target.code.value,phone:e.target.phone.value,token:null},await t(e.target.querySelector(`button`),_)})}async function _(){let e=await s(`public_get_booking`,{p_code:h.code,p_token:h.token,p_phone:h.phone});if(!e.found)return g(e.message);v(e)}function v(m){let g=m.establishment;f(p,o`<div class="stack-lg">
    <div class="row between"><h1 style="margin:0">Tu reserva</h1>${r(l,m.status)}</div>
    <div class="card stack">
      <div class="mono" style="font:700 22px var(--font-display);letter-spacing:.06em">${m.code}</div>
      <div class="list-row"><span class="muted">Complejo</span><strong>${g.name}</strong></div>
      <div class="list-row"><span class="muted">Día</span><strong>${i(m.local_date,null,{weekday:`long`,day:`numeric`,month:`long`})}</strong></div>
      <div class="list-row"><span class="muted">Horario</span><strong>${m.local_start} a ${m.local_end}</strong></div>
      <div class="list-row"><span class="muted">Cancha</span><strong>${m.facility.name} · ${m.facility.sport}</strong></div>
      <div class="list-row"><span class="muted">Precio</span><strong>${n(m.price_amount,m.currency)}</strong></div>
      ${g.address?o`<div class="list-row"><span class="muted">Dirección</span><strong>${[g.address,g.city].filter(Boolean).join(`, `)}</strong></div>`:``}
    </div>
    ${m.can_cancel?o`<button class="btn btn-danger btn-block" id="cancel">Cancelar reserva</button>`:[`pending`,`confirmed`].includes(m.status)?o`<div class="alert info">${a(`clock`)}<div>Las cancelaciones online se aceptan hasta ${g.cancellation_min_hours} h antes. Comunicate con el complejo${g.phone?` al ${g.phone}`:``}.</div></div>`:``}
    <a class="btn btn-ghost" href="${e(`club/${g.slug}`)}">Volver al complejo</a></div>`),u(`#cancel`)?.addEventListener(`click`,async e=>{await c({title:`Cancelar reserva`,message:`¿Seguro que querés cancelar el turno del ${i(m.local_date)} a las ${m.local_start}?`,confirmText:`Sí, cancelar`,danger:!0})&&await t(e.target,async()=>{await s(`public_cancel_booking`,{p_code:h.code,p_token:h.token,p_phone:h.phone}),d(`Reserva cancelada`,`success`),await _()})})}h.code&&h.token?_().catch(e=>g(e.message)):g();