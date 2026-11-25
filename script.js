{
const ACCESS_KEY = 'e1b6179a-9822-4aea-a705-29be32e51123';

/* ---------- catalogue ---------- */
const READY = [
  { id: 'r01', ref: 'No. 01', img: 'assets/ready-01.webp', desc: 'Tousled auburn hair, freckles and a cheeky grin, in acorn-embroidered overalls with a knitted satchel.', artist: "Juanjuan's Liliput" },
  { id: 'r02', ref: 'No. 02', img: 'assets/ready-02.webp', desc: 'Rose-gold waves and a pearl crown, in a shimmering lilac-to-blue mermaid tail.', artist: "Juanjuan's Liliput" },
  { id: 'r03', ref: 'No. 03', img: 'assets/ready-03.webp', desc: 'Twin braids under a houndstooth beret, in cosy cream dungarees and a cocoa knit.', artist: "Juanjuan's Liliput" },
  { id: 'r04', ref: 'No. 04', img: 'assets/ready-04.webp', desc: 'Cascading chestnut curls and lace butterfly wings, in a floaty ivory gauze dress.', artist: "Luoli's Doll" },
  { id: 'r05', ref: 'No. 05', img: 'assets/ready-05.webp', desc: 'Platinum ringlets, a vintage clock tee and pink lace, with a little felt bear.', artist: "Luoli's Doll" }
];
const WIGS = [
  { id: 'w1', name: 'Blush Straight', img: 'assets/wig-blush-straight.webp', desc: 'Sleek mid-length straight hair in soft blush pink.' },
  { id: 'w2', name: 'Classic Bob', img: 'assets/wig-classic-bob.webp', desc: 'Chin-length bob with full, blunt bangs.' },
  { id: 'w3', name: 'Silky Long', img: 'assets/wig-silky-long.webp', desc: 'Long, glossy straight hair with a centre part.' },
  { id: 'w4', name: 'Soft Curls', img: 'assets/wig-soft-curls.webp', desc: 'Romantic loose waves with airy bangs.' },
  { id: 'w5', name: 'Ribbon Braids', img: 'assets/wig-ribbon-braids.webp', desc: 'Braided twin buns tied with pink satin bows.' }
];
const OUTFITS = [
  { id: 'o1', name: 'Little Graduate', img: 'assets/outfit-little-graduate.webp', desc: 'Navy graduation gown with gold bow, cap, lace socks and Mary Janes.' },
  { id: 'o2', name: 'Cosy Dreams', img: 'assets/outfit-cosy-dreams.webp', desc: 'Rose jacquard pyjama set with fluffy slippers and socks.' },
  { id: 'o3', name: 'Lilac Ballerina', img: 'assets/outfit-lilac-ballerina.webp', desc: 'Lilac leotard with layered tulle tutu and satin ballet flats.' },
  { id: 'o4', name: 'Garden Picnic', img: 'assets/outfit-garden-picnic.webp', desc: 'Sage floral pinafore over a puff-sleeve blouse, with T-strap shoes and socks.' },
  { id: 'o5', name: 'Weekend Explorer', img: 'assets/outfit-weekend-explorer.webp', desc: 'Corduroy jacket, tee and cargo shorts with sneakers and striped socks.' }
];
const KINDS = {
  ready: { list: READY, label: 'Ready-made doll', on: '✓ Interested', off: "I'm interested" },
  wig: { list: WIGS, label: 'Wig', on: '✓ Added', off: '+ Add' },
  outfit: { list: OUTFITS, label: 'Outfit', on: '✓ Added', off: '+ Add' }
};
const picks = { ready: new Set(), wig: new Set(), outfit: new Set() };
const find = (kind, id) => KINDS[kind].list.find(item => item.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- render cards ---------- */
const card = (kind, item) => {
  const title = kind === 'ready' ? '' : `<h3>${esc(item.name)}</h3>`;
  const alt = kind === 'ready' ? `Ready-made art doll: ${item.desc}` : `${item.name}: ${item.desc}`;
  return `<article class="shop-card">
    <button type="button" class="media" data-open="${kind}:${item.id}" aria-label="View details">
      <img src="${item.img}" loading="lazy" alt="${esc(alt)}">
    </button>
    <div class="meta">
      <div>${title}<p>${esc(item.desc)}</p></div>
      <button type="button" class="add-btn" data-pick="${kind}:${item.id}" aria-pressed="false">${KINDS[kind].off}</button>
    </div>
  </article>`;
};
document.querySelector('#rail-ready').innerHTML = READY.map(i => card('ready', i)).join('');
document.querySelector('#rail-wigs').innerHTML = WIGS.map(i => card('wig', i)).join('');
document.querySelector('#rail-wardrobe').innerHTML = OUTFITS.map(i => card('outfit', i)).join('');
document.querySelector('#ready-pick').innerHTML = READY.map(i =>
  `<label title="${esc(i.desc)}"><input type="checkbox" name="ready-doll" value="${i.id}"><img src="${i.img}" loading="lazy" alt="${esc(i.desc)}"></label>`
).join('');

/* ---------- rails ---------- */
const rails = [...document.querySelectorAll('.rail')];
const updateRailButtons = rail => {
  const max = rail.scrollWidth - rail.clientWidth - 2;
  document.querySelectorAll(`.rail-btn[data-rail="${rail.id}"]`).forEach(btn => {
    btn.disabled = btn.dataset.dir === '-1' ? rail.scrollLeft <= 2 : rail.scrollLeft >= max;
  });
};
const scrollRail = (rail, dir) => {
  const item = rail.firstElementChild;
  if (!item) return;
  const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
  rail.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: 'smooth' });
};
document.querySelectorAll('.rail-btn').forEach(btn => {
  btn.addEventListener('click', () => scrollRail(document.getElementById(btn.dataset.rail), Number(btn.dataset.dir)));
});
rails.forEach(rail => {
  rail.addEventListener('scroll', () => updateRailButtons(rail), { passive: true });
  rail.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); scrollRail(rail, e.key === 'ArrowRight' ? 1 : -1); }
  });
  updateRailButtons(rail);
});
const railObserver = new ResizeObserver(() => rails.forEach(updateRailButtons));
rails.forEach(rail => railObserver.observe(rail));

/* ---------- menu, year, details ---------- */
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
  });
});

/* ---------- form refs ---------- */
const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');
const submitButton = form.querySelector('.submit-button');
const buttonLabel = submitButton.innerHTML;
const chips = document.querySelector('#addon-chips');
const tray = document.querySelector('#pick-tray');
const traySummary = document.querySelector('#pick-summary');
const storyLabel = form.querySelector('.story-label');
const storyField = form.elements.story;

const setType = type => {
  form.querySelectorAll('input[name="type"]').forEach(r => { r.checked = r.value === type; });
  showType();
};
const showType = () => {
  const type = form.querySelector('input[name="type"]:checked')?.value;
  form.querySelectorAll('.type-block').forEach(b => { b.hidden = b.dataset.for !== type; });
  form.elements.recipient.required = type === 'custom';
  storyField.required = type === 'custom';
  form.querySelector('.story-req').hidden = type !== 'custom';
  if (type === 'ready') {
    storyLabel.textContent = 'Anything you’d like to ask?';
    storyField.placeholder = 'Questions about the doll, delivery, or how you’d like to style it.';
  } else {
    storyLabel.textContent = 'Tell us the story';
    storyField.placeholder = 'Who is the doll for, what should it feel like, and which details matter most?';
  }
};
form.querySelectorAll('input[name="type"]').forEach(r => r.addEventListener('change', showType));
document.querySelectorAll('[data-type]').forEach(link => link.addEventListener('click', () => setType(link.dataset.type)));

/* ---------- selection state ---------- */
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const sync = () => {
  document.querySelectorAll('[data-pick]').forEach(btn => {
    const [kind, id] = btn.dataset.pick.split(':');
    const on = picks[kind].has(id);
    btn.classList.toggle('is-added', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? KINDS[kind].on : KINDS[kind].off;
  });
  form.querySelectorAll('input[name="ready-doll"]').forEach(box => { box.checked = picks.ready.has(box.value); });

  const addOns = [...['wig', 'outfit'].flatMap(kind => [...picks[kind]].map(id => ({ kind, item: find(kind, id) })))];
  chips.innerHTML = addOns.length
    ? addOns.map(({ kind, item }) => `<span class="chip">${KINDS[kind].label}: ${esc(item.name)}<button type="button" data-unpick="${kind}:${item.id}" aria-label="Remove ${esc(item.name)}">×</button></span>`).join('')
    : '<p class="empty">No add-ons yet — browse wigs or the wardrobe to add some.</p>';

  const parts = [];
  if (picks.ready.size) parts.push(plural(picks.ready.size, 'doll'));
  if (picks.wig.size) parts.push(plural(picks.wig.size, 'wig'));
  if (picks.outfit.size) parts.push(plural(picks.outfit.size, 'outfit'));
  tray.hidden = parts.length === 0;
  document.body.classList.toggle('has-picks', parts.length > 0);
  traySummary.textContent = `Your selection · ${parts.join(' · ')}`;
  refreshLightboxAction();
};
const toggle = (kind, id) => {
  if (picks[kind].has(id)) picks[kind].delete(id);
  else {
    picks[kind].add(id);
    if (kind === 'ready') setType('ready');
  }
  sync();
};
document.addEventListener('click', e => {
  const pick = e.target.closest('[data-pick]');
  if (pick) { const [k, id] = pick.dataset.pick.split(':'); toggle(k, id); return; }
  const unpick = e.target.closest('[data-unpick]');
  if (unpick) { const [k, id] = unpick.dataset.unpick.split(':'); picks[k].delete(id); sync(); return; }
  const open = e.target.closest('[data-open]');
  if (open) { const [k, id] = open.dataset.open.split(':'); openLightbox(k, id, open); }
});
form.querySelectorAll('input[name="ready-doll"]').forEach(box => box.addEventListener('change', () => {
  if (box.checked) picks.ready.add(box.value); else picks.ready.delete(box.value);
  sync();
}));

/* ---------- lightbox ---------- */
const lb = document.querySelector('#lightbox');
const lbPanel = lb.querySelector('.lb-panel');
const lbAction = document.querySelector('#lb-action');
let lbCurrent = null;
let lbReturn = null;
function refreshLightboxAction() {
  if (!lbCurrent) return;
  const on = picks[lbCurrent.kind].has(lbCurrent.id);
  lbAction.textContent = on ? KINDS[lbCurrent.kind].on : KINDS[lbCurrent.kind].off;
}
function openLightbox(kind, id, trigger) {
  const item = find(kind, id);
  lbCurrent = { kind, id };
  lbReturn = trigger;
  document.querySelector('#lb-img').src = item.img;
  document.querySelector('#lb-img').alt = kind === 'ready' ? item.desc : item.name;
  document.querySelector('#lb-kind').textContent = KINDS[kind].label;
  document.querySelector('#lb-title').textContent = kind === 'ready' ? 'One of a kind' : item.name;
  document.querySelector('#lb-desc').textContent = item.desc;
  document.querySelector('#lb-credit').textContent = item.artist ? `Artist: ${item.artist}` : '';
  lbPanel.classList.toggle('wide', kind === 'wig');
  refreshLightboxAction();
  lb.hidden = false;
  document.body.classList.add('lb-open');
  lb.querySelector('.lb-close').focus();
}
const closeLightbox = () => {
  lb.hidden = true;
  document.body.classList.remove('lb-open');
  lbCurrent = null;
  if (lbReturn) lbReturn.focus();
};
lbAction.addEventListener('click', () => { if (lbCurrent) toggle(lbCurrent.kind, lbCurrent.id); });
lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });

/* ---------- submit ---------- */
form.addEventListener('submit', async event => {
  event.preventDefault();
  status.className = 'form-status';
  const type = form.querySelector('input[name="type"]:checked')?.value;
  const fail = msg => { status.textContent = msg; status.classList.add('error'); };

  if (!form.checkValidity()) { form.reportValidity(); return fail('Please complete the required fields before sending.'); }
  if (type === 'ready' && picks.ready.size === 0) return fail('Please choose at least one ready-made doll.');

  const data = new FormData(form);
  if (data.get('botcheck')) return;

  const list = (kind, fmt) => [...picks[kind]].map(id => fmt(find(kind, id))).join('; ') || 'None';
  const payload = {
    access_key: ACCESS_KEY,
    subject: `DOLLORA inquiry — ${type === 'ready' ? 'Ready-made' : 'Custom portrait'} — ${data.get('name')}`,
    from_name: 'DOLLORA website',
    replyto: data.get('email'),
    Name: data.get('name'),
    Email: data.get('email'),
    Type: type === 'ready' ? 'Ready-made doll' : 'Custom portrait'
  };
  if (type === 'ready') {
    payload['Ready-made dolls'] = list('ready', d => `${d.ref} — ${d.desc} (Artist: ${d.artist})`);
  } else {
    const features = data.getAll('features');
    payload['This doll is for'] = data.get('recipient');
    payload['Personalization interests'] = features.length ? features.join(', ') : 'Not selected';
  }
  payload.Wigs = list('wig', w => w.name);
  payload.Outfits = list('outfit', o => o.name);
  payload[type === 'ready' ? 'Message' : 'Story'] = data.get('story') || '—';
  payload.Acknowledgement = 'Visitor confirmed this is an early, non-binding inquiry.';

  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending… <span>↗</span>';
  status.textContent = '';
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
    form.reset();
    Object.values(picks).forEach(set => set.clear());
    showType();
    sync();
    status.textContent = 'Thank you — your inquiry has been received. We will reply to your email soon.';
    status.classList.add('success');
  } catch (error) {
    fail('Sorry, something went wrong. Please try again, or send us a DM on Instagram @dollora.art.');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = buttonLabel;
  }
});

showType();
sync();
}
