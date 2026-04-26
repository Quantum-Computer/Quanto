const RESEARCH = [
  ["Category Theory", "Rig Categories in Quantum Circuits"],
  ["Quantum Machine Learning", "QML Models & Optimization"],
  ["Dynamical Lie Algebras", "Barren Plateau Analysis"],
  ["Topological Quantum Theory", "TQFTs & Anyonic Systems"],
  ["ZX-Calculus", "Monads, Comonads & Beyond"],
  ["Contextuality & Magic", "Simplices & Non-Classicality"],
  ["Quantum Information Geometry", "Manifolds & Fisher Information"],
  ["Quantum Algorithms", "From Theory to Implementation"],
];

const CARDS = [
  ["Rig Categories", "Recent advances in categorical structures for quantum circuits."],
  ["QML Demo", "Variational models, kernels, and quantum neural networks."],
  ["Dynamical Lie Algebras", "Analyze expressibility and trainability of circuits."],
  ["ZX-Calculus", "Mathematics behind graphical quantum reasoning."],
  ["Contextuality & Magic", "Understanding non-classicality through geometry."],
  ["Topological Quantum Field Theory", "From knots and manifolds to quantum invariants."],
];

function mountLists() {
  const list = document.getElementById("researchList");
  RESEARCH.forEach(([title, subtitle]) => {
    const li = document.createElement("li");
    li.innerHTML = `<div><strong>${title}</strong><span>${subtitle}</span></div><b>›</b>`;
    list.appendChild(li);
  });

  const grid = document.getElementById("cardGrid");
  CARDS.forEach(([title, text]) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `<h4>${title}</h4><p>${text}</p><button>Explore</button>`;
    grid.appendChild(el);
  });
}

function fit(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

function initBg() {
  const canvas = document.getElementById("bg");
  canvas.style.height = `${window.innerHeight}px`;
  let { ctx, w, h } = fit(canvas);
  const stars = Array.from({ length: 180 }, () => ({ x: Math.random() * w, y: Math.random() * h, s: Math.random() * 2 }));

  function draw(t) {
    ctx.fillStyle = "rgba(2,5,20,.25)";
    ctx.fillRect(0, 0, w, h);
    stars.forEach((s, i) => {
      s.y += 0.2 + s.s * 0.2;
      if (s.y > h) s.y = 0;
      ctx.fillStyle = `hsla(${220 + i % 40}, 80%, 72%, .5)`;
      ctx.fillRect(s.x, s.y, s.s, s.s);
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  window.addEventListener("resize", () => {
    canvas.style.height = `${window.innerHeight}px`;
    ({ ctx, w, h } = fit(canvas));
  });
}

function initOrb() {
  const canvas = document.getElementById("orbCanvas");
  let pointer = { x: 0, y: 0, on: false };
  let { ctx, w, h } = fit(canvas);

  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.on = true;
  });
  canvas.addEventListener("pointerleave", () => (pointer.on = false));
  window.addEventListener("resize", () => ({ ctx, w, h } = fit(canvas)));

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.53;
    const r = Math.min(w, h) * 0.28;

    const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.6);
    glow.addColorStop(0, "rgba(172,96,255,.28)");
    glow.addColorStop(1, "rgba(40,10,88,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${240 + i * 5},95%,70%,${0.38 - i * 0.014})`;
      ctx.lineWidth = 1;
      const rx = r;
      const ry = Math.abs(Math.cos((i / 16) * Math.PI)) * r;
      ctx.ellipse(cx, cy, rx, Math.max(6, ry), 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    const influence = pointer.on ? (pointer.x - cx) / 120 : Math.sin(t * 0.0006) * 2;
    for (let i = 0; i < 12; i++) {
      const ang = (Math.PI * 2 * i) / 12 + t * 0.0003;
      const x = cx + Math.cos(ang + influence * 0.05) * r * 0.9;
      const y = cy + Math.sin(ang * 1.2) * r * 0.55;
      ctx.beginPath();
      ctx.fillStyle = i % 3 === 0 ? "#ff67f5" : "#6fc5ff";
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgba(154,178,255,.55)";
    ctx.lineWidth = 2;
    ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

mountLists();
initBg();
initOrb();
