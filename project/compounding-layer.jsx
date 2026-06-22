// The Compounding Layer — Neuroid CRO & Retention hero loop (Fig.03).
// Companion to ceiling-break.jsx / signal-match.jsx; same system.

(function () {
  const ink = '#0C0C0C';
  const yellow = '#FEEF24';
  const red = '#FF2600';
  const grey = '#8A8A8A';
  const faint = 'rgba(12,12,12,0.06)';
  const hair = 'rgba(12,12,12,0.16)';
  const MONO = "'JetBrains Mono','SFMono-Regular',ui-monospace,Menlo,monospace";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
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

  // ── geometry ───────────────────────────────────────────────
  const C = { x: 420, y: 360 };   // retention loop center
  const R = 130;
  const JOIN = 1.3, LAP = 0.8;     // customer joins loop, lap duration
  const ENTRY_X0 = 110;

  // stack
  const SX = 770, SBASE = 600, BH = 28, PITCH = 32;
  const barW = (k) => 230 + k * 14;            // bars widen as value compounds
  const barCY = (k) => SBASE - 16 - k * PITCH;  // center y of bar k (0 = bottom)
  const barCX = (k) => SX + barW(k) / 2;

  const DROPS = [1.9, 2.7, 3.5, 4.3, 5.1, 5.9];  // 6 laps → 6 bars
  const N = DROPS.length;

  function custPos(t) {
    if (t < JOIN) {
      const e = easeInOutCubic(clamp((t - 0.4) / (JOIN - 0.4), 0, 1));
      return [lerp(ENTRY_X0, C.x - R, e), C.y];
    }
    const th = Math.PI + (2 * Math.PI * (t - JOIN)) / LAP;
    return [C.x + R * Math.cos(th), C.y + R * Math.sin(th)];
  }

  function Label(props) {
    const base = {
      position: 'absolute', fontFamily: MONO, fontWeight: 700, fontSize: 13,
      letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      opacity: props.opacity, transform: 'translateY(' + (1 - props.opacity) * 6 + 'px)',
      willChange: 'opacity, transform', color: ink,
    };
    return React.createElement('div', { style: Object.assign(base, props.style) }, props.children);
  }

  function CompoundingLayer() {
    const t = window.useTime ? window.useTime() : 0;
    const gOpacity = fade(t, 0, 0.4, 7.5, 8.0);

    const cust = custPos(t);
    const onLoop = t >= JOIN;
    const loopOpacity = fade(t, 1.05, 1.5, null);

    // counter
    let smoothCount = 0;
    DROPS.forEach((td) => { smoothCount += clamp((t - (td + 0.4)) / 0.3, 0, 1); });
    const ltv = (1 + 0.53 * smoothCount).toFixed(1);
    const aov = Math.round((28 * smoothCount) / N);
    const numOpacity = fade(t, 1.8, 2.1, 7.5, 8.0);

    // coins in flight
    const coinEls = DROPS.map((td, k) => {
      const p = clamp((t - td) / 0.45, 0, 1);
      if (p <= 0 || p >= 1) return null;
      const src = custPos(td);
      const tx = barCX(k), ty = barCY(k);
      const e = easeInOutCubic(p);
      const x = lerp(src[0], tx, e);
      const y = lerp(src[1], ty, e) - 46 * Math.sin(p * Math.PI);
      return React.createElement('rect', {
        key: 'c' + k, x: x - 6, y: y - 6, width: 12, height: 12,
        fill: yellow, stroke: ink, strokeWidth: 1.6,
        transform: `rotate(${p * 180} ${x} ${y})`,
      });
    });

    // stack bars
    const barEls = DROPS.map((td, k) => {
      const land = td + 0.4;
      const grow = prog(t, land, land + 0.32, easeOutBack);
      if (grow <= 0) return null;
      const w = barW(k), cy = barCY(k);
      const sc = clamp(grow, 0, 1);
      return React.createElement('g', { key: 'b' + k, transform: `translate(${SX + w / 2}, ${cy}) scale(${sc}) translate(${-(SX + w / 2)}, ${-cy})`, style: { transformOrigin: 'center' } },
        React.createElement('rect', { x: SX, y: cy - BH / 2, width: w, height: BH, fill: yellow, stroke: ink, strokeWidth: 2 }),
        React.createElement('rect', { x: SX + 1.5, y: cy - BH / 2 + 1.5, width: w - 3, height: BH - 3, fill: 'url(#htY3)', opacity: 0.55 }),
        React.createElement('rect', { x: SX + w - 11, y: cy - 3, width: 6, height: 6, fill: red }),
      );
    });

    return React.createElement('div', {
      'data-screen-label': 'T' + Math.floor(t) + 'S',
      'data-label': 'Compounding Layer',
      style: { position: 'absolute', inset: 0, opacity: gOpacity, fontFamily: MONO, willChange: 'opacity' },
    },
      React.createElement('svg', { width: 1280, height: 720, viewBox: '0 0 1280 720', style: { position: 'absolute', inset: 0, display: 'block' } },
        React.createElement('defs', null,
          React.createElement('pattern', { id: 'htY3', width: 6, height: 6, patternUnits: 'userSpaceOnUse' },
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

        // captions
        React.createElement('text', { x: C.x, y: 150, textAnchor: 'middle', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', fill: grey }, 'RETENTION LOOP'),
        React.createElement('text', { x: barCX(0), y: 150, textAnchor: 'middle', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', fill: grey }, 'RETAINED VALUE'),

        // entry path
        React.createElement('line', { x1: ENTRY_X0, y1: C.y, x2: C.x - R, y2: C.y, stroke: hair, strokeWidth: 1.6, strokeDasharray: '2 6' }),

        // retention loop
        React.createElement('circle', { cx: C.x, cy: C.y, r: R, fill: 'none', stroke: yellow, strokeWidth: 3, opacity: loopOpacity }),
        React.createElement('circle', { cx: C.x, cy: C.y, r: R, fill: 'none', stroke: ink, strokeWidth: 1, opacity: loopOpacity * 0.9 }),
        // direction arrow on loop (top)
        loopOpacity > 0 ? React.createElement('path', { d: `M ${C.x - 8} ${C.y - R - 6} L ${C.x + 4} ${C.y - R} L ${C.x - 8} ${C.y - R + 6}`, fill: 'none', stroke: ink, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: loopOpacity }) : null,
        // lap tally inside loop
        React.createElement('text', { x: C.x, y: C.y - 4, textAnchor: 'middle', fontFamily: MONO, fontSize: 46, fontWeight: 700, letterSpacing: '-0.04em', fill: ink, opacity: loopOpacity }, '×' + smoothCount.toFixed(0)),
        React.createElement('text', { x: C.x, y: C.y + 26, textAnchor: 'middle', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', fill: grey, opacity: loopOpacity }, 'REPEAT PURCHASE'),

        // stack baseline
        React.createElement('line', { x1: SX - 14, y1: SBASE, x2: SX + barW(N - 1) + 14, y2: SBASE, stroke: ink, strokeWidth: 2 }),

        // bars + coins
        React.createElement('g', null, barEls),
        React.createElement('g', null, coinEls),

        // customer node
        (t > 0.4) ? React.createElement('g', null,
          onLoop ? React.createElement('circle', { cx: cust[0], cy: cust[1], r: 13, fill: 'none', stroke: yellow, strokeWidth: 2, opacity: 0.5 }) : null,
          React.createElement('rect', { x: cust[0] - 7, y: cust[1] - 7, width: 14, height: 14, fill: ink }),
          React.createElement('rect', { x: cust[0] - 2.5, y: cust[1] - 2.5, width: 5, height: 5, fill: yellow }),
        ) : null,
      ),

      // counter
      React.createElement('div', {
        style: { position: 'absolute', left: 205, top: 116, textAlign: 'left', opacity: numOpacity, fontFamily: MONO },
      },
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: grey, marginBottom: 2, whiteSpace: 'nowrap' } }, 'CUSTOMER LTV'),
        React.createElement('div', { style: { fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' } },
          ltv,
          React.createElement('span', { style: { color: yellow, WebkitTextStroke: '1px ' + ink } }, '×'),
        ),
        React.createElement('div', { style: { fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: grey, marginTop: 8, fontVariantNumeric: 'tabular-nums' } },
          'AOV ', React.createElement('span', { style: { color: ink } }, '+' + aov + '%'),
        ),
      ),

      // phase labels
      React.createElement(Label, { opacity: fade(t, 0.5, 0.8, 1.9, 2.3), style: { left: 150, top: C.y + 34 } }, 'ONE CUSTOMER'),
      React.createElement(Label, { opacity: fade(t, 1.6, 1.9, 6.4, 6.9), style: { left: C.x, top: C.y + R + 26, transform: 'translateX(-50%)' } }, 'LTV COMPOUNDS'),

      // payoff line
      React.createElement('div', {
        style: { position: 'absolute', left: 640, top: 660, transform: 'translateX(-50%)', opacity: fade(t, 3.2, 3.6, 7.2, 7.6), fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', color: ink, display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' },
      },
        React.createElement('span', { style: { display: 'inline-flex', gap: 3 } },
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: red } }),
        ),
        'THE LAYER THAT COMPOUNDS YOUR SPEND',
      ),
    );
  }

  window.CompoundingLayer = CompoundingLayer;
})();
