// The Signal Match — Neuroid Performance Creatives & UGC hero loop (Fig.02).
// Companion to ceiling-break.jsx; same system. Mounted as a child of the Stage.

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
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

  function prog(t, s, e, ease) {
    const p = clamp((t - s) / (e - s), 0, 1);
    return ease ? ease(p) : p;
  }
  function fade(t, inS, inE, outS, outE) {
    if (t < inS) return 0;
    if (t < inE) return easeOutQuad((t - inS) / (inE - inS));
    if (outS == null) return 1;
    if (t < outS) return 1;
    if (t < outE) return 1 - easeOutQuad((t - outS) / (outE - outS));
    return 0;
  }

  // ── geometry ───────────────────────────────────────────────
  const INSIGHT = { x: 235, y: 372 };
  const FW = 152, FH = 56, FX = 494;          // creative frame box
  const FY = [196, 286, 376, 466, 556];        // frame centers
  const FRAMES = [
    { label: 'UGC VIDEO', kind: 'video' },
    { label: 'STATIC', kind: 'static' },
    { label: 'PODCAST', kind: 'audio' },
    { label: 'MOTION', kind: 'motion' },
    { label: 'CAROUSEL', kind: 'carousel' },
  ];
  const PX = 968;                              // person column x
  const PY = [200, 300, 376, 458, 556];        // person centers
  const PR = [13, 11, 12, 11, 13];             // distinct head radii

  const buildT = (i) => 1.7 + i * 0.32;        // frame build-in times
  // correct matches that light yellow + tick the counter
  const MATCHES = [
    { f: 0, p: 0, t: 3.8 },
    { f: 1, p: 1, t: 4.2 },
    { f: 2, p: 2, t: 4.7 },
    { f: 4, p: 4, t: 5.1 },
    { f: 3, p: 3, t: 5.7 },   // resolves after the wrong-match beat
  ];
  // wrong-match beat: samey STATIC reaches person 3, who turns away
  const GHOST = { f: 1, p: 3, in: 4.9, hold: 5.35, out: 5.6 };

  function frameRect(i) { return { x: FX, y: FY[i] - FH / 2, w: FW, h: FH }; }

  // ── creative-format glyphs (distinct line marks) ───────────
  function glyph(kind, gx, gy, col) {
    const sw = 1.6;
    const common = { fill: 'none', stroke: col, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (kind === 'video') {
      return [
        React.createElement('rect', { key: 'a', x: gx, y: gy + 2, width: 30, height: 22, ...common }),
        React.createElement('path', { key: 'b', d: `M ${gx + 12} ${gy + 8} L ${gx + 12} ${gy + 18} L ${gx + 21} ${gy + 13} Z`, fill: col, stroke: 'none' }),
      ];
    }
    if (kind === 'static') {
      return [
        React.createElement('rect', { key: 'a', x: gx, y: gy + 2, width: 30, height: 22, ...common }),
        React.createElement('circle', { key: 'b', cx: gx + 9, cy: gy + 9, r: 2.4, fill: col, stroke: 'none' }),
        React.createElement('path', { key: 'c', d: `M ${gx + 3} ${gy + 22} L ${gx + 13} ${gy + 14} L ${gx + 20} ${gy + 19} L ${gx + 27} ${gy + 12}`, ...common }),
      ];
    }
    if (kind === 'audio') {
      const bars = [10, 18, 8, 22, 12];
      return bars.map((h, k) =>
        React.createElement('line', { key: k, x1: gx + 3 + k * 6, y1: gy + 13 + (24 - h) / 2 - 0, x2: gx + 3 + k * 6, y2: gy + 13 - (24 - h) / 2 + h, stroke: col, strokeWidth: 2.4, strokeLinecap: 'round',
          // center bars vertically around gy+13
          ...{ y1: gy + 13 + h / 2, y2: gy + 13 - h / 2 } }),
      );
    }
    if (kind === 'motion') {
      return [
        React.createElement('path', { key: 'a', d: `M ${gx + 2} ${gy + 5} l 9 8 l -9 8`, ...common }),
        React.createElement('path', { key: 'b', d: `M ${gx + 13} ${gy + 5} l 9 8 l -9 8`, ...common }),
        React.createElement('path', { key: 'c', d: `M ${gx + 24} ${gy + 5} l 6 8 l -6 8`, ...common }),
      ];
    }
    // carousel
    return [
      React.createElement('rect', { key: 'a', x: gx + 8, y: gy + 4, width: 18, height: 18, ...common }),
      React.createElement('rect', { key: 'b', x: gx + 4, y: gy + 8, width: 18, height: 18, ...common }),
      React.createElement('rect', { key: 'c', x: gx, y: gy + 12, width: 18, height: 18, ...common }),
    ];
  }

  function person(i, x, y, lit, turned, fadeP) {
    const r = PR[i];
    const col = lit ? ink : (turned ? grey : ink);
    const op = turned ? 0.45 : 1;
    const flip = turned ? `translate(${x},${y}) scale(-1,1) translate(${-x},${-y})` : '';
    return React.createElement('g', { transform: flip, opacity: op, style: { transition: 'none' } },
      lit ? React.createElement('rect', { x: x - r - 7, y: y - r - 7, width: (r + 7) * 2, height: (r + 18) * 2, fill: yellow, opacity: 0.16 * fadeP }) : null,
      React.createElement('circle', { cx: x, cy: y - 4, r: r, fill: lit ? yellow : 'none', stroke: col, strokeWidth: 2 }),
      React.createElement('path', { d: `M ${x - r - 4} ${y + r + 14} q ${r + 4} ${-(r + 10)} ${(r + 4) * 2} 0`, fill: 'none', stroke: col, strokeWidth: 2, strokeLinecap: 'round' }),
    );
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

  function SignalMatch() {
    const t = window.useTime ? window.useTime() : 0;

    const gOpacity = fade(t, 0, 0.4, 7.5, 8.0);

    // insight node
    const insightIn = prog(t, 0.3, 1.15, easeOutCubic);
    const pulse = 1 + 0.06 * Math.sin(t * 4.2);
    const insR = 16 * insightIn * pulse;

    // counter — ticks on each correct match
    let smoothCount = 0;
    MATCHES.forEach((m) => { smoothCount += clamp((t - m.t) / 0.3, 0, 1); });
    const reach = (1 + 0.48 * smoothCount).toFixed(1);
    const numOpacity = fade(t, 3.4, 3.7, 7.5, 8.0);

    // ── build SVG children ──
    const branches = FRAMES.map((f, i) => {
      const bIn = prog(t, buildT(i), buildT(i) + 0.45, easeOutCubic);
      if (bIn <= 0) return null;
      const fr = frameRect(i);
      const x2 = lerp(INSIGHT.x + 14, fr.x, easeOutCubic(bIn));
      const y2 = lerp(INSIGHT.y, fr.y + fr.h / 2, easeOutCubic(bIn));
      return React.createElement('line', {
        key: 'br' + i, x1: INSIGHT.x + 14, y1: INSIGHT.y, x2, y2,
        stroke: hair, strokeWidth: 1.4,
      });
    });

    const frameEls = FRAMES.map((f, i) => {
      const bIn = prog(t, buildT(i), buildT(i) + 0.5, easeOutCubic);
      if (bIn <= 0) return null;
      const fr = frameRect(i);
      const lit = MATCHES.some((m) => m.f === i && t >= m.t);
      const litP = lit ? clamp((t - MATCHES.find((m) => m.f === i).t) / 0.4, 0, 1) : 0;
      const col = lit ? ink : ink;
      const gx = fr.x + 14, gy = fr.y + 13;
      return React.createElement('g', { key: 'fr' + i, opacity: bIn, transform: `translate(${(1 - bIn) * -14},0)` },
        lit ? React.createElement('rect', { x: fr.x - 3, y: fr.y - 3, width: fr.w + 6, height: fr.h + 6, fill: yellow, opacity: 0.14 * litP }) : null,
        React.createElement('rect', { x: fr.x, y: fr.y, width: fr.w, height: fr.h, fill: lit ? 'rgba(254,239,36,0.10)' : 'none', stroke: lit ? ink : ink, strokeWidth: lit ? 2.2 : 1.6 }),
        // inner halftone
        React.createElement('rect', { x: fr.x + 1, y: fr.y + 1, width: fr.w - 2, height: fr.h - 2, fill: lit ? 'url(#htY)' : 'url(#htK)', opacity: lit ? 0.5 : 0.32 }),
        glyph(f.kind, gx, gy, lit ? ink : ink),
        React.createElement('text', { x: fr.x + 58, y: fr.y + 27, fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fill: ink }, f.label),
        React.createElement('text', { x: fr.x + 58, y: fr.y + 42, fontFamily: MONO, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.16em', fill: grey }, lit ? 'MATCHED' : 'VARIANT'),
        lit ? React.createElement('rect', { x: fr.x + fr.w - 13, y: fr.y + 7, width: 6, height: 6, fill: yellow, stroke: ink, strokeWidth: 1 }) : null,
      );
    });

    // signal lines (correct matches)
    const signalEls = MATCHES.map((m, i) => {
      const rev = prog(t, m.t, m.t + 0.45, easeOutCubic);
      if (rev <= 0) return null;
      const fr = frameRect(m.f);
      const x1 = fr.x + fr.w, y1 = fr.y + fr.h / 2;
      const x2t = PX - PR[m.p] - 14, y2t = PY[m.p] - 4;
      const cx = lerp(x1, x2t, rev), cy = lerp(y1, y2t, rev);
      const connected = t >= m.t + 0.4;
      return React.createElement('g', { key: 'sg' + i },
        React.createElement('line', { x1, y1, x2: cx, y2: cy, stroke: connected ? yellow : ink, strokeWidth: connected ? 2.4 : 1.8, strokeLinecap: 'round' }),
        React.createElement('circle', { cx: cx, cy: cy, r: connected ? 0 : 3, fill: ink }),
      );
    });

    // ghost (wrong) line
    const ghostIn = fade(t, GHOST.in, GHOST.in + 0.3, GHOST.hold, GHOST.out);
    let ghostEl = null;
    if (ghostIn > 0) {
      const fr = frameRect(GHOST.f);
      const x1 = fr.x + fr.w, y1 = fr.y + fr.h / 2;
      const x2 = PX - PR[GHOST.p] - 14, y2 = PY[GHOST.p] - 4;
      ghostEl = React.createElement('line', {
        x1, y1, x2, y2, stroke: grey, strokeWidth: 1.6,
        strokeDasharray: '4 5', strokeLinecap: 'round', opacity: ghostIn * 0.8,
      });
    }

    // persons
    const personEls = PY.map((y, i) => {
      const appear = fade(t, 0.6 + i * 0.1, 1.0 + i * 0.1, null);
      const lit = MATCHES.some((m) => m.p === i && t >= m.t + 0.35);
      const litP = lit ? clamp((t - (MATCHES.find((m) => m.p === i).t + 0.35)) / 0.4, 0, 1) : 0;
      const turned = (i === GHOST.p) && t >= GHOST.in + 0.15 && t < GHOST.out + 0.1 && !lit;
      return React.createElement('g', { key: 'p' + i, opacity: appear },
        person(i, PX, y, lit, turned, litP),
      );
    });

    return React.createElement('div', {
      'data-screen-label': 'T' + Math.floor(t) + 'S',
      'data-label': 'Signal Match',
      style: { position: 'absolute', inset: 0, opacity: gOpacity, fontFamily: MONO, willChange: 'opacity' },
    },
      React.createElement('svg', {
        width: 1280, height: 720, viewBox: '0 0 1280 720',
        style: { position: 'absolute', inset: 0, display: 'block' },
      },
        React.createElement('defs', null,
          React.createElement('pattern', { id: 'htK', width: 7, height: 7, patternUnits: 'userSpaceOnUse' },
            React.createElement('circle', { cx: 3.5, cy: 3.5, r: 1.1, fill: ink })),
          React.createElement('pattern', { id: 'htY', width: 7, height: 7, patternUnits: 'userSpaceOnUse' },
            React.createElement('circle', { cx: 3.5, cy: 3.5, r: 1.3, fill: '#caa800' })),
        ),

        // faint dot grid
        React.createElement('g', { opacity: 0.5 },
          Array.from({ length: 24 }).map((_, c) =>
            Array.from({ length: 11 }).map((_, r) =>
              React.createElement('circle', { key: c + '-' + r, cx: 60 + c * 50, cy: 130 + r * 44, r: 1.1, fill: faint })
            )
          )
        ),

        // column captions
        React.createElement('text', { x: FX + FW / 2, y: 150, textAnchor: 'middle', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', fill: grey }, 'CREATIVE'),
        React.createElement('text', { x: PX, y: 150, textAnchor: 'middle', fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', fill: grey }, 'AUDIENCE'),

        React.createElement('g', null, branches),
        ghostEl,
        React.createElement('g', null, signalEls),
        React.createElement('g', null, frameEls),

        // insight node
        insightIn > 0 ? React.createElement('g', null,
          React.createElement('rect', { x: INSIGHT.x - insR - 8 - 6 * Math.abs(Math.sin(t * 4.2)), y: INSIGHT.y - insR - 8 - 6 * Math.abs(Math.sin(t * 4.2)), width: (insR + 8 + 6 * Math.abs(Math.sin(t * 4.2))) * 2, height: (insR + 8 + 6 * Math.abs(Math.sin(t * 4.2))) * 2, fill: 'none', stroke: yellow, strokeWidth: 1.5, opacity: 0.35 }),
          React.createElement('rect', { x: INSIGHT.x - insR, y: INSIGHT.y - insR, width: insR * 2, height: insR * 2, fill: yellow, stroke: ink, strokeWidth: 2 }),
        ) : null,

        React.createElement('g', null, personEls),
      ),

      // ticking counter (mirrors ROAS)
      React.createElement('div', {
        style: { position: 'absolute', left: 205, top: 116, textAlign: 'left', opacity: numOpacity, fontFamily: MONO },
      },
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: grey, marginBottom: 2, whiteSpace: 'nowrap' } }, 'INCREMENTAL REACH'),
        React.createElement('div', { style: { fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' } },
          reach,
          React.createElement('span', { style: { color: yellow, WebkitTextStroke: '1px ' + ink } }, '✕'),
        ),
      ),

      // phase labels
      React.createElement(Label, { opacity: fade(t, 0.6, 0.9, 2.4, 2.8), style: { left: INSIGHT.x, top: INSIGHT.y + 64, transform: 'translateX(-50%)' } }, 'ONE INSIGHT'),
      React.createElement(Label, { opacity: fade(t, 1.9, 2.2, 3.9, 4.3), style: { left: FX + FW / 2, top: 632, transform: 'translateX(-50%)' } }, 'DIVERSE CREATIVE'),
      React.createElement(Label, { opacity: fade(t, 3.9, 4.2, 5.4, 5.8), style: { left: PX, top: 632, transform: 'translateX(-50%)' } }, 'THE RIGHT PERSON'),

      // wrong-match beat label
      React.createElement('div', {
        style: { position: 'absolute', left: PX, top: 666, transform: 'translateX(-50%)', opacity: fade(t, 5.0, 5.3, 6.8, 7.3), fontFamily: MONO, fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', color: ink, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' },
      },
        React.createElement('span', { style: { display: 'inline-flex', gap: 3 } },
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: red } }),
        ),
        'DIVERSITY = REACH',
      ),
    );
  }

  window.SignalMatch = SignalMatch;
})();
