// Built for Recall — Neuroid Socials, Campaigns & IPs hero loop (Fig.04).
// Same system as ceiling-break / signal-match / compounding-layer.

(function () {
  const ink = '#0C0C0C';
  const yellow = '#FEEF24';
  const red = '#FF2600';
  const grey = '#8A8A8A';
  const faint = 'rgba(12,12,12,0.06)';
  const MONO = "'JetBrains Mono','SFMono-Regular',ui-monospace,Menlo,monospace";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

  function prog(t, s, e, ease) { const p = clamp((t - s) / (e - s), 0, 1); return ease ? ease(p) : p; }
  function fade(t, inS, inE, outS, outE) {
    if (t < inS) return 0;
    if (t < inE) return easeOutQuad((t - inS) / (inE - inS));
    if (outS == null) return 1;
    if (t < outS) return 1;
    if (t < outE) return 1 - easeOutQuad((t - outS) / (outE - outS));
    return 0;
  }

  // ── grid geometry ──────────────────────────────────────────
  const COLS = 4, ROWS = 3, TW = 128, TH = 118, GX = 22, GY = 22;
  const GRIDW = COLS * TW + (COLS - 1) * GX;
  const GRIDH = ROWS * TH + (ROWS - 1) * GY;
  const LEFT = 640 - GRIDW / 2, TOP = 360 - GRIDH / 2 - 6;
  const CX = 640, CY = TOP + GRIDH / 2;
  const KINDS = ['reel', 'campaign', 'ip', 'static', 'post', 'reel', 'campaign', 'carousel', 'ip', 'reel', 'campaign', 'static'];
  const IMPRINT = [1, 4, 6, 9, 10];
  const N = 12;

  function slot(i) {
    const c = i % COLS, r = Math.floor(i / COLS);
    return { x: LEFT + c * (TW + GX), y: TOP + r * (TH + GY) };
  }
  function burstStart(i) {
    return {
      x: 640 + Math.sin(i * 12.9 + 1) * 440,
      y: 360 + Math.cos(i * 7.7 + 2) * 300,
      rot: Math.sin(i * 3.3) * 26,
    };
  }
  function imprintT(i) {
    const s = slot(i);
    const d = Math.hypot(s.x + TW / 2 - CX, s.y + TH / 2 - CY);
    return 2.3 + (d / 360) * 1.0;
  }

  // ── tile interior glyphs ───────────────────────────────────
  function glyph(kind, cx, cy, col) {
    const cm = { fill: 'none', stroke: col, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (kind === 'reel') return [
      React.createElement('path', { key: 'a', d: `M ${cx - 7} ${cy - 11} L ${cx - 7} ${cy + 11} L ${cx + 12} ${cy} Z`, fill: col, stroke: 'none' }),
    ];
    if (kind === 'campaign' || kind === 'static') return [
      React.createElement('rect', { key: 'a', x: cx - 20, y: cy - 14, width: 40, height: 28, ...cm }),
      React.createElement('circle', { key: 'b', cx: cx - 10, cy: cy - 5, r: 3, fill: col, stroke: 'none' }),
      React.createElement('path', { key: 'c', d: `M ${cx - 18} ${cy + 11} L ${cx - 5} ${cy + 1} L ${cx + 4} ${cy + 7} L ${cx + 18} ${cy - 4}`, ...cm }),
    ];
    if (kind === 'ip') return [
      // voxel-N stacked blocks
      React.createElement('rect', { key: 'a', x: cx - 14, y: cy - 4, width: 11, height: 11, fill: col }),
      React.createElement('rect', { key: 'b', x: cx - 5, y: cy - 9, width: 11, height: 11, fill: col }),
      React.createElement('rect', { key: 'c', x: cx + 4, y: cy - 14, width: 11, height: 11, fill: col }),
      React.createElement('rect', { key: 'd', x: cx + 4, y: cy - 3, width: 11, height: 11, fill: col, opacity: 0.45 }),
    ];
    if (kind === 'post') return [0, 1, 2].map((k) =>
      React.createElement('line', { key: k, x1: cx - 18, y1: cy - 10 + k * 10, x2: cx + (k === 2 ? 6 : 18), y2: cy - 10 + k * 10, stroke: col, strokeWidth: 2.4, strokeLinecap: 'round' })
    );
    // carousel
    return [
      React.createElement('rect', { key: 'a', x: cx - 4, y: cy - 12, width: 20, height: 20, ...cm }),
      React.createElement('rect', { key: 'b', x: cx - 10, y: cy - 8, width: 20, height: 20, ...cm }),
      React.createElement('rect', { key: 'c', x: cx - 16, y: cy - 4, width: 20, height: 20, ...cm }),
    ];
  }

  function Label(props) {
    const base = {
      position: 'absolute', fontFamily: MONO, fontWeight: 700, fontSize: 13,
      letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      opacity: props.opacity, transform: 'translate(-50%,' + (1 - props.opacity) * 6 + 'px)',
      willChange: 'opacity, transform', color: ink,
    };
    return React.createElement('div', { style: Object.assign(base, props.style) }, props.children);
  }

  function BuiltForRecall() {
    const t = window.useTime ? window.useTime() : 0;
    const gOpacity = fade(t, 0, 0.4, 7.5, 8.0);

    // counter — brand recall ticks during meter fill
    const meterP = prog(t, 4.3, 6.1, easeOutCubic);
    const recall = Math.round(236 * meterP);
    const numOpacity = fade(t, 4.0, 4.3, 7.5, 8.0);

    // memory pulse ring
    const pulseP = prog(t, 2.3, 3.9);
    const ringR = pulseP > 0 && pulseP < 1 ? lerp(0, 380, pulseP) : null;

    // tiles
    const tileEls = [];
    for (let i = 0; i < N; i++) {
      const s = slot(i);
      const bs = burstStart(i);
      const ti = 0.3 + i * 0.055;
      const p = prog(t, ti, ti + 0.7, easeOutBack);
      if (p <= 0) continue;
      const dx = (bs.x - s.x) * (1 - p);
      const dy = (bs.y - s.y) * (1 - p);
      const rot = bs.rot * (1 - clamp(p, 0, 1));
      const sc = lerp(0.55, 1, clamp(p, 0, 1));
      const isImp = IMPRINT.includes(i);
      const it = imprintT(i);
      const lit = isImp && t >= it;
      const flash = lit ? clamp(1 - (t - it) / 0.5, 0, 1) : 0;     // bright flash decays
      const echo = lit ? clamp((t - it) / 0.4, 0, 1) : 0;          // afterglow settles in
      const tcx = s.x + TW / 2, tcy = s.y + TH / 2;
      tileEls.push(
        React.createElement('g', {
          key: 't' + i,
          transform: `translate(${dx},${dy}) rotate(${rot} ${tcx} ${tcy}) scale(${sc}) translate(${(1 - sc) * tcx / sc * 0},0)`,
          style: { transformBox: 'view-box', transformOrigin: `${tcx}px ${tcy}px` },
          opacity: clamp(p, 0, 1),
        },
          // afterglow echo (offset ghost) — persists once imprinted
          lit ? React.createElement('rect', { x: s.x + 9, y: s.y + 9, width: TW, height: TH, fill: yellow, opacity: 0.22 * echo }) : null,
          lit ? React.createElement('rect', { x: s.x + 9, y: s.y + 9, width: TW, height: TH, fill: 'none', stroke: yellow, strokeWidth: 1.5, opacity: 0.4 * echo }) : null,
          // tile body
          React.createElement('rect', { x: s.x, y: s.y, width: TW, height: TH, fill: lit ? 'rgba(254,239,36,0.14)' : 'none', stroke: ink, strokeWidth: lit ? 2.4 : 1.8 }),
          React.createElement('rect', { x: s.x + 2, y: s.y + 2, width: TW - 4, height: TH - 4, fill: lit ? 'url(#htY4)' : 'url(#htK4)', opacity: lit ? 0.5 : 0.3 }),
          glyph(KINDS[i], tcx, s.y + 52, ink),
          // tiny kind label
          React.createElement('text', { x: tcx, y: s.y + TH - 14, textAnchor: 'middle', fontFamily: MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', fill: lit ? ink : grey }, lit ? 'RECALLED' : KINDS[i].toUpperCase()),
          // imprint flash overlay
          flash > 0 ? React.createElement('rect', { x: s.x, y: s.y, width: TW, height: TH, fill: yellow, opacity: 0.55 * flash }) : null,
          lit ? React.createElement('rect', { x: s.x + TW - 13, y: s.y + 7, width: 6, height: 6, fill: red }) : null,
        )
      );
    }

    // recall meter
    const mX = LEFT, mW = GRIDW, mY = TOP + GRIDH + 40, mH = 16;
    const meterOpacity = fade(t, 4.1, 4.4, null);
    const fillW = mW * meterP;

    return React.createElement('div', {
      'data-screen-label': 'T' + Math.floor(t) + 'S',
      'data-label': 'Built for Recall',
      style: { position: 'absolute', inset: 0, opacity: gOpacity, fontFamily: MONO, willChange: 'opacity' },
    },
      React.createElement('svg', { width: 1280, height: 720, viewBox: '0 0 1280 720', style: { position: 'absolute', inset: 0, display: 'block' } },
        React.createElement('defs', null,
          React.createElement('pattern', { id: 'htK4', width: 7, height: 7, patternUnits: 'userSpaceOnUse' },
            React.createElement('circle', { cx: 3.5, cy: 3.5, r: 1.0, fill: ink })),
          React.createElement('pattern', { id: 'htY4', width: 6, height: 6, patternUnits: 'userSpaceOnUse' },
            React.createElement('circle', { cx: 3, cy: 3, r: 1.2, fill: '#caa800' })),
        ),

        // faint dot grid
        React.createElement('g', { opacity: 0.5 },
          Array.from({ length: 24 }).map((_, c) =>
            Array.from({ length: 11 }).map((_, r) =>
              React.createElement('circle', { key: c + '-' + r, cx: 60 + c * 50, cy: 130 + r * 44, r: 1.1, fill: faint })
            )
          )
        ),

        // memory pulse ring
        ringR != null ? React.createElement('circle', { cx: CX, cy: CY, r: ringR, fill: 'none', stroke: yellow, strokeWidth: 2.5, opacity: (1 - pulseP) * 0.8 }) : null,
        ringR != null ? React.createElement('circle', { cx: CX, cy: CY, r: ringR * 0.7, fill: 'none', stroke: ink, strokeWidth: 1, opacity: (1 - pulseP) * 0.35 }) : null,

        React.createElement('g', null, tileEls),

        // recall meter
        meterOpacity > 0 ? React.createElement('g', { opacity: meterOpacity },
          React.createElement('rect', { x: mX, y: mY, width: mW, height: mH, fill: 'none', stroke: ink, strokeWidth: 1.6 }),
          React.createElement('rect', { x: mX, y: mY, width: fillW, height: mH, fill: yellow }),
          React.createElement('rect', { x: mX, y: mY, width: fillW, height: mH, fill: 'url(#htY4)', opacity: 0.5 }),
          // target tick at 100%
          React.createElement('line', { x1: mX + mW, y1: mY - 6, x2: mX + mW, y2: mY + mH + 6, stroke: ink, strokeWidth: 1.6 }),
          React.createElement('text', { x: mX, y: mY - 10, fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', fill: grey }, 'RECALL METER'),
          React.createElement('text', { x: mX + mW, y: mY - 10, textAnchor: 'end', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', fill: grey }, 'PEAK RECALL'),
        ) : null,
      ),

      // counter
      React.createElement('div', {
        style: { position: 'absolute', left: 205, top: 116, textAlign: 'left', opacity: numOpacity, fontFamily: MONO },
      },
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: grey, marginBottom: 2, whiteSpace: 'nowrap' } }, 'BRAND RECALL'),
        React.createElement('div', { style: { fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' } },
          recall,
          React.createElement('span', { style: { color: yellow, fontSize: '0.5em', fontWeight: 700, marginLeft: '0.08em', verticalAlign: '0.42em' } }, '%'),
        ),
      ),

      // phase labels
      React.createElement(Label, { opacity: fade(t, 0.5, 0.8, 2.2, 2.6), style: { left: 640, top: 660 } }, 'CONTENT THAT LANDS'),
      React.createElement(Label, { opacity: fade(t, 2.6, 2.9, 4.2, 4.6), style: { left: 640, top: 660 } }, 'IT STICKS'),

      // payoff line
      React.createElement('div', {
        style: { position: 'absolute', left: 640, top: 660, transform: 'translateX(-50%)', opacity: fade(t, 4.6, 5.0, 7.2, 7.6), fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', color: ink, display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' },
      },
        React.createElement('span', { style: { display: 'inline-flex', gap: 3 } },
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: red } }),
        ),
        'BUILT FOR RECALL',
      ),
    );
  }

  window.BuiltForRecall = BuiltForRecall;
})();
