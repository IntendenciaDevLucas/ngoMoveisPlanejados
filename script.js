(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const WHATS = '553173646406';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navegação ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('#menuToggle');
  const links = $('#navLinks');
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Hero: slides + brilho ---------- */
  const slides = $$('.slide');
  const dotsBox = $('#heroDots');
  let current = 0, timer;
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Foto ${i + 1}`);
    b.addEventListener('click', () => { goSlide(i); restart(); });
    dotsBox.appendChild(b);
  });
  const dots = $$('button', dotsBox);
  function goSlide(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('on');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    // reinicia a animação da barrinha
    void dots[current].offsetWidth;
    dots[current].classList.add('on');
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => goSlide(current + 1), 6000);
  }
  dots[0].classList.add('on');
  restart();

  const hero = $('#inicio');
  const glow = $('#heroGlow');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    glow.style.left = `${e.clientX - r.left}px`;
    glow.style.top = `${e.clientY - r.top}px`;
  });

  /* ---------- Animação de entrada ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const observeReveal = root => $$('.reveal', root).forEach(el => io.observe(el));
  observeReveal(document);

  /* ---------- Ambientes ---------- */
  const ambientes = [
    {
      nome: 'Sala & Home theater', img: 'fotos/home-theater.jpg',
      desc: 'Painéis de TV, racks suspensos e estantes que organizam a sala e escondem fios, com iluminação que deixa o cinema em casa ainda melhor.',
      itens: ['Painel ripado ou liso com LED', 'Rack suspenso com nichos para aparelhos', 'Passagem de fios embutida', 'Estantes e cristaleiras']
    },
    {
      nome: 'Cozinha', img: 'fotos/cozinha-integrada.jpg',
      desc: 'Cozinhas integradas que aproveitam cada canto: torres quentes, gavetões, cantos mágicos e bancadas pensadas para quem cozinha de verdade.',
      itens: ['Torre quente para forno e micro-ondas', 'Gavetões com corrediça de amortecimento', 'Ilhas e bancadas americanas', 'Aéreos com LED sob o armário']
    },
    {
      nome: 'Home office & biblioteca', img: 'fotos/biblioteca-home-office.jpg',
      desc: 'Um canto de trabalho bonito e funcional, com espaço para livros, arquivos e equipamentos, sem tirar o aconchego da casa.',
      itens: ['Bancada na medida certa para o seu dia a dia', 'Estantes de fora a fora', 'Gaveteiros e arquivos', 'Calha de tomadas embutida']
    },
    {
      nome: 'Escritório & estantes', img: 'fotos/escritorio-estante.jpg',
      desc: 'Estantes, nichos e armários sob medida para escritórios, consultórios e espaços comerciais que precisam passar boa impressão.',
      itens: ['Estantes com nichos iluminados', 'Armários com portas de correr', 'Recepções e balcões', 'Projetos para espaços comerciais']
    },
    {
      nome: 'Banheiro & lavabo', img: 'fotos/lavabo.jpg',
      desc: 'Gabinetes, espelheiras e nichos resistentes à umidade, com acabamento que transforma o lavabo no cartão de visitas da casa.',
      itens: ['Gabinetes suspensos', 'Espelheiras com LED', 'Materiais resistentes à umidade', 'Nichos e prateleiras']
    },
    {
      nome: 'Área externa', img: 'fotos/deck-area-externa.jpg',
      desc: 'Área gourmet, churrasqueira e varanda com móveis preparados para sol e chuva, prontos para receber os amigos.',
      itens: ['Armários de área gourmet', 'Bancadas para churrasqueira', 'Materiais para ambientes externos', 'Integração com deck e pergolado']
    }
  ];

  const tabsBox = $('#ambTabs');
  const panel = $('#ambPanel');
  ambientes.forEach((a, i) => {
    const b = document.createElement('button');
    b.className = 'tab';
    b.setAttribute('role', 'tab');
    b.textContent = a.nome;
    b.addEventListener('click', () => showAmb(i));
    b.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + ambientes.length) % ambientes.length;
        showAmb(n); tabsBox.children[n].focus();
      }
    });
    tabsBox.appendChild(b);
  });
  ambientes.forEach(a => { new Image().src = a.img; }); // pré-carrega

  let ambAtual = -1;
  function fillAmb(i) {
    const a = ambientes[i];
    $('#ambImg').src = a.img;
    $('#ambImg').alt = a.nome;
    $('#ambNum').textContent = String(i + 1).padStart(2, '0');
    $('#ambTitle').textContent = a.nome;
    $('#ambDesc').textContent = a.desc;
    $('#ambList').innerHTML = a.itens.map(t => `<li>${t}</li>`).join('');
    $('#ambCta').dataset.amb = a.nome;
  }
  function showAmb(i) {
    if (i === ambAtual) return;
    [...tabsBox.children].forEach((t, k) => {
      t.setAttribute('aria-selected', k === i);
      t.tabIndex = k === i ? 0 : -1;
    });
    if (ambAtual === -1 || reduceMotion) { fillAmb(i); ambAtual = i; return; }
    ambAtual = i;
    panel.classList.add('swap');
    setTimeout(() => { fillAmb(i); panel.classList.remove('swap'); }, 300);
  }
  showAmb(0);

  /* ---------- Portfólio ---------- */
  const projetos = [
    { img: 'fotos/home-theater.jpg', cat: 'social', tag: 'Sala & Home', titulo: 'Home theater', texto: 'Painel com LED, rack suspenso e nichos para os aparelhos.' },
    { img: 'fotos/cozinha-integrada.jpg', cat: 'cozinha', tag: 'Cozinha', titulo: 'Cozinha integrada', texto: 'Armários de fora a fora, torre quente e bancada aproveitando a integração.' },
    { img: 'fotos/biblioteca-home-office.jpg', cat: 'trabalho', tag: 'Escritório', titulo: 'Biblioteca & home office', texto: 'Estante do piso ao teto com bancada de trabalho.' },
    { img: 'fotos/lavabo.jpg', cat: 'banho', tag: 'Banheiro', titulo: 'Lavabo', texto: 'Gabinete suspenso e acabamento que impressiona as visitas.' },
    { img: 'fotos/escritorio-estante.jpg', cat: 'trabalho', tag: 'Escritório', titulo: 'Escritório com estante', texto: 'Nichos, portas e organização para o dia a dia de trabalho.' },
    { img: 'fotos/deck-area-externa.jpg', cat: 'externo', tag: 'Área externa', titulo: 'Deck & área externa', texto: 'Móveis preparados para sol e chuva.' }
  ];
  const grid = $('#grid');
  grid.innerHTML = projetos.map((p, i) => `
    <article class="card reveal" data-cat="${p.cat}" data-i="${i}" tabindex="0" role="button" aria-label="Ampliar ${p.titulo}">
      <img src="${p.img}" alt="${p.titulo}" loading="lazy">
      <button type="button" class="fav" aria-pressed="false" aria-label="Favoritar ${p.titulo}"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.2 4.4 2.5h1.8c.8-1.3 2.2-2.5 4.4-2.5 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg></button>
      <span class="zoom"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M11 8v6M8 11h6"/></svg></span>
      <div class="card-info"><small>${p.tag}</small><h3>${p.titulo}</h3><p>${p.texto}</p></div>
    </article>`).join('');
  observeReveal(grid);

  // Favoritos: ficam salvos no navegador e entram na mensagem do orçamento
  let favoritos = new Set();
  try { favoritos = new Set(JSON.parse(localStorage.getItem('ngo-favs') || '[]')); } catch (_) {}
  const favNote = document.createElement('p');
  favNote.className = 'fav-note';
  grid.after(favNote);
  function syncFavs() {
    $$('.card', grid).forEach(c => {
      const on = favoritos.has(projetos[+c.dataset.i].titulo);
      c.classList.toggle('faved', on);
      $('.fav', c).setAttribute('aria-pressed', on);
    });
    const n = favoritos.size;
    favNote.innerHTML = n
      ? `♥ ${n} projeto${n > 1 ? 's' : ''} favoritado${n > 1 ? 's' : ''}. Eles vão junto no seu <a href="#orcamento">pedido de orçamento</a>.`
      : 'Toque no ♥ dos projetos que você mais gostou para mandar junto no orçamento.';
    try { localStorage.setItem('ngo-favs', JSON.stringify([...favoritos])); } catch (_) {}
  }
  grid.addEventListener('click', e => {
    const f = e.target.closest('.fav');
    if (!f) return;
    e.stopPropagation();
    const t = projetos[+f.closest('.card').dataset.i].titulo;
    favoritos.has(t) ? favoritos.delete(t) : favoritos.add(t);
    f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop');
    syncFavs();
    updatePreview();
  }, true);
  syncFavs();

  $$('#filters .chip').forEach(chip => chip.addEventListener('click', () => {
    $$('#filters .chip').forEach(c => c.classList.toggle('active', c === chip));
    const f = chip.dataset.f;
    $$('.card', grid).forEach(card => {
      const show = f === 'todos' || card.dataset.cat === f;
      if (show) {
        card.classList.remove('hide');
        card.classList.add('in');
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('fade')));
      } else {
        card.classList.add('fade');
        setTimeout(() => card.classList.contains('fade') && card.classList.add('hide'), 400);
      }
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  let lbIndex = 0, lastFocus = null;
  const visiveis = () => $$('.card:not(.hide)', grid).map(c => +c.dataset.i);
  function openLb(i) {
    lastFocus = document.activeElement;
    lbIndex = i; renderLb();
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }
  function closeLb() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  }
  function renderLb() {
    const p = projetos[lbIndex];
    $('#lbImg').src = p.img; $('#lbImg').alt = p.titulo;
    $('#lbCap').textContent = p.titulo;
  }
  function stepLb(d) {
    const v = visiveis(); if (!v.length) return;
    const pos = v.indexOf(lbIndex);
    lbIndex = v[(pos + d + v.length) % v.length]; renderLb();
  }
  grid.addEventListener('click', e => { const c = e.target.closest('.card'); c && openLb(+c.dataset.i); });
  grid.addEventListener('keydown', e => {
    if (e.target.closest('.fav')) return;
    const c = e.target.closest('.card');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLb(+c.dataset.i); }
  });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => stepLb(-1));
  $('#lbNext').addEventListener('click', () => stepLb(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') stepLb(1);
    if (e.key === 'ArrowLeft') stepLb(-1);
  });
  let touchX = null;
  lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Estúdio de acabamentos ---------- */
  const portas = [
    { nome: 'Freijó', cor: '#a8774a', wood: true },
    { nome: 'Carvalho claro', cor: '#c9a47a', wood: true },
    { nome: 'Nogueira', cor: '#5e3c24', wood: true },
    { nome: 'Off-white', cor: '#e9e2d6' },
    { nome: 'Verde sálvia', cor: '#8a9a80' },
    { nome: 'Grafite', cor: '#3a3a3c' }
  ];
  const bancadas = [
    { nome: 'Quartzo branco', cor: '#efece6' },
    { nome: 'Granito preto', cor: '#1d1d1f' },
    { nome: 'Mármore travertino', cor: '#d8c6a8' },
    { nome: 'Cinza concreto', cor: '#8d8b87' }
  ];
  // tampo = nome do segundo material em cada ambiente; wizard = opção marcada no orçamento
  const salas = {
    cozinha: { nome: 'Cozinha', tampo: 'Bancada', wizard: 'Cozinha' },
    quarto: { nome: 'Quarto', tampo: 'Tampo dos criados', wizard: 'Quarto' },
    office: { nome: 'Home office', tampo: 'Tampo da mesa', wizard: 'Home office' },
    banho: { nome: 'Banheiro', tampo: 'Bancada', wizard: 'Banheiro / Lavabo' },
    sala: { nome: 'Sala de TV', tampo: 'Tampo do rack', wizard: 'Sala / Home theater' }
  };
  const estudio = { ambiente: 'cozinha', porta: portas[0], bancada: bancadas[0], puxador: 'preto', led: true };
  const puxadorNomes = { preto: 'Perfil preto', dourado: 'Dourado', cava: 'Cava (sem puxador)' };

  function makeSwatches(box, list, label, key) {
    list.forEach((item, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw' + (item.wood ? ' wood' : '') + (i === 0 ? ' on' : '');
      b.style.backgroundColor = item.cor;
      b.title = item.nome;
      b.setAttribute('aria-label', item.nome);
      b.setAttribute('aria-pressed', i === 0);
      b.addEventListener('click', () => {
        $$('.sw', box).forEach(s => { s.classList.toggle('on', s === b); s.setAttribute('aria-pressed', s === b); });
        estudio[key] = item;
        label.textContent = item.nome;
        draw();
      });
      box.appendChild(b);
    });
  }
  makeSwatches($('#swDoor'), portas, $('#lblDoor'), 'porta');
  makeSwatches($('#swTop'), bancadas, $('#lblTop'), 'bancada');

  $$('#segHandle button').forEach(b => b.addEventListener('click', () => {
    $$('#segHandle button').forEach(x => x.classList.toggle('on', x === b));
    estudio.puxador = b.dataset.v;
    $('#lblHandle').textContent = puxadorNomes[b.dataset.v];
    draw();
  }));
  $('#ledToggle').addEventListener('change', e => {
    estudio.led = e.target.checked;
    $$('#kitchen .led').forEach(l => l.classList.toggle('off', !estudio.led));
  });
  $$('#segRoom .chip').forEach(b => b.addEventListener('click', () => {
    $$('#segRoom .chip').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
    estudio.ambiente = b.dataset.v;
    $('#lblRoom').textContent = salas[b.dataset.v].nome;
    $('#lblTopName').textContent = salas[b.dataset.v].tampo;
    const stage = $('#kitchen');
    if (reduceMotion) { draw(); return; }
    stage.classList.add('swap');
    setTimeout(() => { draw(); stage.classList.remove('swap'); }, 250);
  }));

  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  // Desenha uma porta com veio, sombreado e puxador
  function door(g, x, y, w, h, opts = {}) {
    const { porta, puxador } = estudio;
    g.appendChild(el('rect', { x, y, width: w, height: h, rx: 2, fill: porta.cor }));
    if (porta.wood) g.appendChild(el('rect', { x, y, width: w, height: h, rx: 2, fill: 'url(#grain)' }));
    g.appendChild(el('rect', { x, y, width: w, height: h, rx: 2, fill: 'url(#shade)' }));
    g.appendChild(el('rect', { x: x + .5, y: y + .5, width: w - 1, height: h - 1, rx: 2, fill: 'none', stroke: '#000', 'stroke-opacity': .35 }));

    const pos = opts.handle || 'bottom';
    if (pos === 'none') return;
    if (puxador === 'cava') {
      // rebaixo na borda da porta
      const cy = pos === 'top' ? y + 3 : pos === 'bottom' ? y + h - 9 : y + 3;
      g.appendChild(el('rect', { x: x + 4, y: cy, width: w - 8, height: 6, rx: 1, fill: '#000', 'fill-opacity': .45 }));
      return;
    }
    const cor = puxador === 'dourado' ? '#d4ae6a' : '#141414';
    if (opts.vertical) {
      const hx = opts.side === 'left' ? x + 8 : x + w - 11;
      const hy = pos === 'top' ? y + 14 : y + h / 2 - 28;
      g.appendChild(el('rect', { x: hx, y: hy, width: 3, height: 56, rx: 1.5, fill: cor }));
    } else {
      const hy = pos === 'top' ? y + 10 : y + h - 13;
      const hw = Math.min(70, w * .55);
      g.appendChild(el('rect', { x: x + (w - hw) / 2, y: hy, width: hw, height: 3, rx: 1.5, fill: cor }));
    }
  }

  // Peças de apoio usadas por todos os ambientes
  const rect = (g, a) => g.appendChild(el('rect', a));
  const painel = (g, x, y, w, h) => door(g, x, y, w, h, { handle: 'none' });
  const slab = (g, x, y, w, h) => {
    rect(g, { x, y, width: w, height: h, rx: 2, fill: estudio.bancada.cor });
    rect(g, { x, y: y + h - 2, width: w, height: 2, fill: '#000', 'fill-opacity': .25 });
  };
  const luz = (g, x, y, w, h) => rect(g, { x, y, width: w, height: h, fill: 'url(#ledGlow)', class: 'led' + (estudio.led ? '' : ' off') });
  const ripado = (g, x, y, w, h, passo) => {
    for (let lx = x + passo; lx < x + w - 2; lx += passo)
      g.appendChild(el('line', { x1: lx, y1: y + 2, x2: lx, y2: y + h - 2, stroke: '#000', 'stroke-opacity': .3, 'stroke-width': 1.5 }));
  };
  const plantinha = (g, x, y) => {
    rect(g, { x: x - 9, y: y - 23, width: 18, height: 23, rx: 4, fill: '#d9d2c4' });
    g.appendChild(el('path', { d: `M${x} ${y - 23} C ${x - 6} ${y - 40}, ${x - 13} ${y - 45}, ${x - 17} ${y - 53} M${x} ${y - 23} C ${x + 4} ${y - 41}, ${x + 13} ${y - 47}, ${x + 17} ${y - 55} M${x} ${y - 23} C ${x} ${y - 39}, ${x} ${y - 47}, ${x + 1} ${y - 59}`, stroke: '#7d8f6a', 'stroke-width': 2, fill: 'none' }));
  };
  const livros = (g, x, base, larg) => {
    const cores = ['#6b4a36', '#b9a48c', '#3f4a3f', '#8a6d4b', '#d8cfc1', '#5a3b2c'];
    let cx = x;
    for (let k = 0; cx < x + larg - 8; k++) {
      const w = 6 + (k * 7) % 5, h = 30 + (k * 13) % 16;
      rect(g, { x: cx, y: base - h, width: w, height: h, fill: cores[k % cores.length] });
      cx += w + 1;
    }
  };

  const ambientesSVG = {
    cozinha(g) {
      // aéreos
      const gap = 3, dw = (400 - gap * 3) / 4;
      for (let i = 0; i < 4; i++) door(g, 40 + i * (dw + gap), 40, dw, 108, { handle: 'bottom' });
      // revestimento + LED sob os aéreos
      rect(g, { x: 40, y: 150, width: 403, height: 95, fill: '#2a2622' });
      luz(g, 40, 150, 403, 70);
      // bancada (termina antes da torre)
      slab(g, 34, 245, 409, 14);
      plantinha(g, 339, 245);
      // gaveteiro + portas
      [0, 1, 2].forEach(k => door(g, 40, 262 + k * 36.7, 110, 34, { handle: 'top' }));
      const px = 153, pdw = (440 - px - gap * 2) / 3;
      for (let i = 0; i < 3; i++) door(g, px + i * (pdw + gap), 262, pdw, 108, { handle: 'top' });
      rect(g, { x: 40, y: 368, width: 400, height: 4, fill: '#000', 'fill-opacity': .5 });
      // torre quente
      const tx = 446, tw = 114, ty = 40;
      rect(g, { x: tx, y: ty, width: tw, height: 330, fill: '#000', 'fill-opacity': .25 });
      door(g, tx, ty, tw, 92, { handle: 'bottom' });
      rect(g, { x: tx + 4, y: ty + 96, width: tw - 8, height: 58, rx: 3, fill: '#111' });
      rect(g, { x: tx + 10, y: ty + 102, width: tw - 40, height: 46, rx: 2, fill: '#262626' });
      g.appendChild(el('circle', { cx: tx + tw - 17, cy: ty + 114, r: 4, fill: '#555' }));
      rect(g, { x: tx + 4, y: ty + 158, width: tw - 8, height: 72, rx: 3, fill: '#111' });
      rect(g, { x: tx + 12, y: ty + 172, width: tw - 24, height: 50, rx: 2, fill: '#2b2017' });
      rect(g, { x: tx + 20, y: ty + 164, width: tw - 40, height: 3, rx: 1.5, fill: '#888' });
      door(g, tx, ty + 234, tw, 96, { handle: 'top' });
    },

    quarto(g) {
      // guarda-roupa com maleiro
      const gap = 3, dw = (250 - gap * 2) / 3;
      for (let i = 0; i < 3; i++) door(g, 30 + i * (dw + gap), 30, dw, 62, { handle: 'bottom' });
      for (let i = 0; i < 3; i++) door(g, 30 + i * (dw + gap), 95, dw, 272, { vertical: true, side: i === 0 ? 'right' : 'left' });
      rect(g, { x: 30, y: 367, width: 250, height: 5, fill: '#000', 'fill-opacity': .5 });
      // cabeceira ripada com LED
      painel(g, 300, 110, 270, 232);
      ripado(g, 300, 110, 270, 232, 15);
      luz(g, 300, 110, 270, 70);
      // criados-mudos suspensos
      [306, 512].forEach(x => {
        slab(g, x - 2, 294, 56, 7);
        door(g, x, 301, 52, 40, { handle: 'top' });
      });
      // abajur
      rect(g, { x: 532, y: 280, width: 12, height: 14, fill: '#cbbfa9' });
      g.appendChild(el('path', { d: 'M524 280 L552 280 L546 262 L530 262 Z', fill: '#efe5d2' }));
      // cama
      rect(g, { x: 364, y: 336, width: 142, height: 36, rx: 3, fill: '#2a2622' });
      rect(g, { x: 366, y: 306, width: 138, height: 32, rx: 6, fill: '#ece6dc' });
      rect(g, { x: 372, y: 290, width: 60, height: 20, rx: 8, fill: '#f6f2ea' });
      rect(g, { x: 438, y: 290, width: 60, height: 20, rx: 8, fill: '#f6f2ea' });
      rect(g, { x: 366, y: 318, width: 138, height: 24, rx: 5, fill: '#b9a48c' });
    },

    office(g) {
      // estante com nichos iluminados
      painel(g, 30, 30, 230, 342);
      const nichos = [[40, 40, 101, 80], [149, 40, 101, 80], [40, 128, 101, 80], [149, 128, 101, 80], [40, 216, 210, 66]];
      nichos.forEach(([x, y, w, h], k) => {
        rect(g, { x, y, width: w, height: h, fill: '#1a1714' });
        luz(g, x, y, w, 34);
        if (k === 3) plantinha(g, x + w / 2, y + h);
        else livros(g, x + 6, y + h, k === 4 ? 120 : w - 12);
      });
      door(g, 38, 290, 105, 76, { handle: 'top' });
      door(g, 147, 290, 105, 76, { handle: 'top' });
      // prateleira com LED
      painel(g, 300, 112, 260, 10);
      luz(g, 300, 122, 260, 60);
      livros(g, 312, 112, 70);
      plantinha(g, 520, 112);
      // monitor
      rect(g, { x: 360, y: 172, width: 110, height: 66, rx: 3, fill: '#111' });
      rect(g, { x: 364, y: 176, width: 102, height: 58, fill: '#26303b' });
      rect(g, { x: 410, y: 238, width: 10, height: 12, fill: '#222' });
      rect(g, { x: 396, y: 247, width: 38, height: 3, rx: 1.5, fill: '#222' });
      // mesa: tampo, pé painel e gaveteiro
      slab(g, 288, 250, 282, 12);
      painel(g, 292, 262, 14, 110);
      [0, 1, 2].forEach(k => door(g, 470, 264 + k * 36, 96, 34, { handle: 'top' }));
    },

    banho(g) {
      // revestimento
      rect(g, { x: 120, y: 40, width: 360, height: 332, fill: '#25211d' });
      // espelho com LED atrás
      const led = el('rect', { x: 182, y: 62, width: 236, height: 166, rx: 12, fill: 'none', stroke: '#ffd89a', 'stroke-width': 12, 'stroke-opacity': .35, class: 'led' + (estudio.led ? '' : ' off') });
      g.appendChild(led);
      rect(g, { x: 190, y: 70, width: 220, height: 150, rx: 6, fill: '#3a4148' });
      g.appendChild(el('path', { d: 'M215 205 L285 85 M245 205 L300 110', stroke: '#fff', 'stroke-opacity': .12, 'stroke-width': 6 }));
      // bancada, cuba e torneira
      slab(g, 150, 246, 300, 12);
      rect(g, { x: 255, y: 228, width: 90, height: 18, rx: 8, fill: '#f4f1ec' });
      g.appendChild(el('path', { d: 'M318 228 L318 206 Q318 200 312 200 L300 200', stroke: '#bdbdbd', 'stroke-width': 3, fill: 'none' }));
      // gabinete suspenso com LED de piso
      door(g, 156, 258, 142.5, 72, { handle: 'top' });
      door(g, 301.5, 258, 142.5, 72, { handle: 'top' });
      luz(g, 156, 330, 288, 42);
      // torre lateral
      door(g, 480, 60, 70, 300, { vertical: true, side: 'left' });
      // toalha
      rect(g, { x: 60, y: 150, width: 40, height: 4, rx: 2, fill: '#999' });
      rect(g, { x: 62, y: 152, width: 36, height: 70, rx: 3, fill: '#d8cfc1' });
    },

    sala(g) {
      // painel ripado com LED
      painel(g, 160, 30, 280, 342);
      ripado(g, 160, 30, 280, 342, 12);
      luz(g, 160, 30, 280, 80);
      // TV
      rect(g, { x: 200, y: 110, width: 200, height: 115, rx: 3, fill: '#0b0b0b' });
      rect(g, { x: 204, y: 114, width: 192, height: 107, fill: '#151a20' });
      // rack suspenso
      slab(g, 110, 262, 380, 8);
      const gap = 3, dw = (376 - gap * 3) / 4;
      for (let i = 0; i < 4; i++) door(g, 112 + i * (dw + gap), 270, dw, 52, { handle: 'top' });
      luz(g, 112, 322, 376, 46);
      // nichos laterais
      rect(g, { x: 34, y: 60, width: 96, height: 190, fill: '#1a1714' });
      [60, 123, 186, 250].forEach(y => painel(g, 30, y - 4, 104, 6));
      livros(g, 42, 120, 50);
      plantinha(g, 82, 182);
      livros(g, 40, 244, 70);
      // vaso de chão
      rect(g, { x: 510, y: 330, width: 34, height: 42, rx: 6, fill: '#d9d2c4' });
      g.appendChild(el('path', { d: 'M527 330 C 515 300, 500 290, 492 276 M527 330 C 532 296, 545 284, 556 270 M527 330 C 526 300, 528 284, 530 262', stroke: '#7d8f6a', 'stroke-width': 3, fill: 'none' }));
    }
  };

  function draw() {
    const g = $('#scene');
    g.replaceChildren();
    rect(g, { x: 0, y: 0, width: 600, height: 440, fill: '#1c1916' });
    rect(g, { x: 0, y: 372, width: 600, height: 68, fill: '#141210' });
    ambientesSVG[estudio.ambiente](g);
    $('#kitchen').setAttribute('aria-label', `Prévia de ${salas[estudio.ambiente].nome.toLowerCase()} planejado(a) com os acabamentos escolhidos`);
  }
  draw();

  /* ---------- Linha do tempo ---------- */
  const steps = $$('#timeline .step');
  const tlIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const idx = steps.indexOf(en.target);
      steps.forEach((s, k) => k <= idx && setTimeout(() => s.classList.add('lit'), reduceMotion ? 0 : k * 120));
    });
  }, { threshold: 0.6 });
  steps.forEach(s => tlIO.observe(s));

  /* ---------- Assistente de orçamento ---------- */
  const wizard = $('#wizard');
  const pickAmb = $('#pickAmb');
  const opcoesAmb = ['Cozinha', 'Sala / Home theater', 'Quarto', 'Closet', 'Banheiro / Lavabo', 'Home office', 'Cabeceira e cama', 'Área de serviço', 'Área externa / Gourmet'];
  pickAmb.innerHTML = opcoesAmb.map(o => `<button type="button" data-v="${o}" aria-pressed="false">${o}</button>`).join('');
  $$('button', pickAmb).forEach(b => b.addEventListener('click', () => {
    const on = b.classList.toggle('on');
    b.setAttribute('aria-pressed', on);
    clearError(); updatePreview();
  }));

  $$('.pick.single').forEach(group => $$('button', group).forEach(b => {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      $$('button', group).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      clearError(); updatePreview();
    });
  }));

  // Botões que já marcam um ambiente no orçamento
  const marcarAmb = nome => {
    const mapa = {
      'Sala & Home theater': 'Sala / Home theater', 'Cozinha': 'Cozinha',
      'Home office & biblioteca': 'Home office', 'Escritório & estantes': 'Home office',
      'Banheiro & lavabo': 'Banheiro / Lavabo', 'Área externa': 'Área externa / Gourmet'
    };
    const alvo = $$('button', pickAmb).find(b => b.dataset.v === (mapa[nome] || nome));
    if (alvo && !alvo.classList.contains('on')) alvo.click();
  };
  $('#ambCta').addEventListener('click', e => marcarAmb(e.currentTarget.dataset.amb));
  let usarEstudio = false;
  $('#studioCta').addEventListener('click', () => { usarEstudio = true; marcarAmb(salas[estudio.ambiente].wizard); updatePreview(); });

  let step = 1;
  const total = 3;
  const btnNext = $('#wzNext'), btnBack = $('#wzBack'), err = $('#wzError');
  const clearError = () => { err.textContent = ''; };
  const valorUnico = nome => { const b = $(`.pick.single[data-name="${nome}"] button.on`); return b ? b.dataset.v : ''; };

  function mensagem() {
    const amb = $$('button.on', pickAmb).map(b => b.dataset.v);
    const nome = $('#fName').value.trim();
    const cidade = $('#fCity').value.trim();
    const extra = $('#fMsg').value.trim();
    const linhas = [`Olá! Vim pelo site da NGO${nome ? `, meu nome é ${nome}` : ''}.`, 'Gostaria de um orçamento de móveis planejados.', ''];
    if (amb.length) linhas.push(`Ambientes: ${amb.join(', ')}`);
    if (valorUnico('imovel')) linhas.push(`Imóvel: ${valorUnico('imovel')}`);
    if (valorUnico('momento')) linhas.push(`Momento: ${valorUnico('momento')}`);
    if (cidade) linhas.push(`Local: ${cidade}`);
    if (usarEstudio) linhas.push(`Simulei no site (${salas[estudio.ambiente].nome}): portas ${estudio.porta.nome}, ${salas[estudio.ambiente].tampo.toLowerCase()} ${estudio.bancada.nome},puxador ${puxadorNomes[estudio.puxador].toLowerCase()}${estudio.led ? ', com LED' : ''}`);
    if (favoritos.size) linhas.push(`Projetos do site que gostei: ${[...favoritos].join(', ')}`);
    if (extra) linhas.push('', extra);
    return linhas.join('\n');
  }
  function updatePreview() { $('#preview').textContent = mensagem(); }
  ['#fName', '#fCity', '#fMsg'].forEach(s => $(s).addEventListener('input', () => { clearError(); updatePreview(); }));

  function showStep(n) {
    step = n;
    $$('.wz-step', wizard).forEach(f => f.classList.toggle('active', +f.dataset.step === n));
    $('#wzStep').textContent = n;
    $('#wzBar').style.width = `${(n / total) * 100}%`;
    btnBack.hidden = n === 1;
    btnNext.textContent = n === total ? 'Enviar no WhatsApp' : 'Continuar';
    clearError();
    if (n === total) updatePreview();
  }
  function validar() {
    if (step === 1 && !$('button.on', pickAmb)) return 'Escolha pelo menos um ambiente.';
    if (step === 2 && (!valorUnico('imovel') || !valorUnico('momento'))) return 'Selecione o tipo de imóvel e o momento da obra.';
    if (step === 3 && !$('#fName').value.trim()) { $('#fName').focus(); return 'Diga como podemos te chamar.'; }
    return '';
  }
  btnNext.addEventListener('click', () => {
    const problema = validar();
    if (problema) { err.textContent = problema; return; }
    if (step < total) { showStep(step + 1); return; }
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(mensagem())}`, '_blank', 'noopener');
  });
  btnBack.addEventListener('click', () => step > 1 && showStep(step - 1));
  wizard.addEventListener('submit', e => e.preventDefault());
  showStep(1);

  /* ---------- Rodapé ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
