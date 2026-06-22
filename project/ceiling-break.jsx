// The Ceiling Break — Neuroid Performance Marketing hero loop.
// Mounted as a child of the starter Stage (animations.jsx), reads window.useTime().

(function () {
  const ink = '#0C0C0C';
  const yellow = '#FEEF24';
  const red = '#FF2600';
  const grey = '#8A8A8A';
  const faint = 'rgba(12,12,12,0.06)';
  const hair = 'rgba(12,12,12,0.16)';
  const MONO = "'JetBrains Mono','SFMono-Regular',ui-monospace,Menlo,monospace";

  // ── helpers ────────────────────────────────────────────────
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

  // map raw time -> eased progress over [s,e]
  function prog(t, s, e, ease) {
    const p = clamp((t - s) / (e - s), 0, 1);
    return ease ? ease(p) : p;
  }
  // trapezoid fade: 0 before inS, ramps to 1 by inE, holds, ramps to 0 by outE
  function fade(t, inS, inE, outS, outE) {
    if (t < inS) return 0;
    if (t < inE) return easeOutQuad((t - inS) / (inE - inS));
    if (outS == null) return 1;
    if (t < outS) return 1;
    if (t < outE) return 1 - easeOutQuad((t - outS) / (outE - outS));
    return 0;
  }

  // partial polyline by fraction of total length; returns {d, tip:[x,y]}
  function polyAt(points, p) {
    if (p <= 0) return { d: '', tip: points[0] };
    const segs = [];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const len = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      segs.push(len); total += len;
    }
    const target = p * total;
    let acc = 0;
    let d = 'M ' + points[0][0] + ' ' + points[0][1];
    let tip = points[0];
    for (let i = 1; i < points.length; i++) {
      const len = segs[i - 1];
      if (acc + len <= target) {
        d += ' L ' + points[i][0] + ' ' + points[i][1];
        tip = points[i]; acc += len;
      } else {
        const r = (target - acc) / len;
        const x = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * r;
        const y = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * r;
        d += ' L ' + x + ' ' + y;
        tip = [x, y];
        break;
      }
    }
    return { d, tip };
  }

  // ── geometry ───────────────────────────────────────────────
  const AX_X = 160, BASE_Y = 560, TOP = 120, RIGHT = 1120, CEIL_Y = 300;

  const RISE = [
    [160, 520], [225, 508], [290, 486], [350, 452], [410, 408],
    [470, 360], [525, 326], [580, 308], [640, 301], [730, 300], [820, 300],
  ];
  const BREAK = [
    [820, 300], [858, 300], [858, 266], [900, 266], [900, 222],
    [946, 222], [946, 168], [1000, 168], [1000, 104], [1080, 104],
  ];
  const NODE_Y = 628;
  const NODES = [
    { x: 300, label: 'ECONOMICS' },
    { x: 540, label: 'DISTRIBUTION' },
    { x: 780, label: 'CREATIVE' },
    { x: 1020, label: 'RETENTION' },
  ];
  const CONSTRAINT = 1;
  const LOCK_T = 2.72;

  // ── label overlay ──────────────────────────────────────────
  function Label(props) {
    const base = {
      position: 'absolute',
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      opacity: props.opacity,
      transform: 'translateY(' + (1 - props.opacity) * 6 + 'px)',
      willChange: 'opacity, transform',
    };
    return React.createElement('div', { style: Object.assign(base, props.style) }, props.children);
  }

  function CeilingBreak() {
    const t = window.useTime ? window.useTime() : 0;

    // phase progressions
    const pRise = prog(t, 0.3, 1.95, easeInOutCubic);
    const rise = polyAt(RISE, pRise);

    const pCeil = prog(t, 1.15, 1.75);
    const ceilX = lerp(AX_X, RIGHT, easeOutCubic(pCeil));

    // scanner
    const pScan = prog(t, 2.3, 3.5);
    const scanX = lerp(250, 1080, pScan);
    const scanOn = t > 2.2 && t < 3.7;
    const scanOpacity = fade(t, 2.25, 2.45, 3.45, 3.75);

    // constraint lock
    const lockP = clamp((t - LOCK_T) / 0.45, 0, 1);
    const locked = t >= LOCK_T;
    const ringP = clamp((t - LOCK_T) / 0.7, 0, 1);

    // connector L path  node -> up -> along ceiling to break point
    const CONN = [[540, NODE_Y], [540, CEIL_Y], [820, CEIL_Y]];
    const pConn = prog(t, 3.55, 4.15, easeInOutCubic);
    const conn = polyAt(CONN, pConn);
    const connOpacity = fade(t, 3.55, 3.7, 5.6, 6.0);

    // breakthrough
    const pBreak = prog(t, 4.05, 5.75, easeOutCubic);
    const brk = polyAt(BREAK, pBreak);
    const breakTipX = brk.tip[0];

    // area fill reveal + opacity
    const fillOpacity = fade(t, 4.3, 5.4, 6.5, 7.0) * 0.9;

    // number tick
    const pNum = prog(t, 4.05, 5.8, easeOutCubic);
    const roas = (1 + 3.8 * pNum).toFixed(1);
    const numOpacity = fade(t, 4.1, 4.4, 6.5, 7.0);

    // global loop fade
    const gOpacity = fade(t, 0, 0.4, 6.55, 7.0);

    // node pulse glow when scanner crosses
    const nodeEls = NODES.map((n, i) => {
      const isC = i === CONSTRAINT;
      const passGlow = scanOn ? clamp(1 - Math.abs(scanX - n.x) / 40, 0, 1) : 0;
      const fillY = isC ? lockP : 0;
      const sq = 13;
      const fillCol = isC && locked
        ? yellow
        : 'rgba(12,12,12,' + (0.04 + passGlow * 0.5) + ')';
      const strokeCol = (isC && locked) ? ink : ink;
      const labCol = (isC && locked) ? ink : grey;
      const labWeight = (isC && locked) ? 700 : 600;
      return React.createElement('g', { key: i },
        // highlight chip behind constraint label once locked
        (isC && locked) ? React.createElement('rect', {
          x: n.x - 58, y: NODE_Y + 14, width: 116, height: 20,
          fill: yellow, opacity: lockP,
        }) : null,
        React.createElement('rect', {
          x: n.x - sq / 2, y: NODE_Y - sq / 2, width: sq, height: sq,
          fill: fillCol, stroke: strokeCol, strokeWidth: 1.6,
        }),
        // pulse ring on lock
        (isC && ringP > 0 && ringP < 1) ? React.createElement('rect', {
          x: n.x - sq / 2 - ringP * 22, y: NODE_Y - sq / 2 - ringP * 22,
          width: sq + ringP * 44, height: sq + ringP * 44,
          fill: 'none', stroke: yellow, strokeWidth: 2, opacity: 1 - ringP,
        }) : null,
        React.createElement('text', {
          x: n.x, y: NODE_Y + 28, textAnchor: 'middle',
          fontFamily: MONO, fontSize: 10.5, fontWeight: labWeight,
          letterSpacing: '0.12em', fill: labCol,
        }, n.label),
      );
    });

    const tip = pRise > 0 && pRise < 1 ? rise.tip : null;

    return React.createElement('div', {
      'data-screen-label': 'T' + Math.floor(t) + 'S',
      'data-label': 'Ceiling Break',
      style: {
        position: 'absolute', inset: 0, opacity: gOpacity,
        fontFamily: MONO, willChange: 'opacity',
      },
    },
      // ── SVG base ──
      React.createElement('svg', {
        width: 1280, height: 720, viewBox: '0 0 1280 720',
        style: { position: 'absolute', inset: 0, display: 'block' },
      },
        React.createElement('defs', null,
          // fine halftone dots
          React.createElement('pattern', {
            id: 'halftone', width: 9, height: 9, patternUnits: 'userSpaceOnUse',
          },
            React.createElement('circle', { cx: 4.5, cy: 4.5, r: 2.1, fill: yellow }),
          ),
          // vertical gradient mask: dense at bottom, fades up
          React.createElement('linearGradient', { id: 'fillFade', x1: 0, y1: BASE_Y, x2: 0, y2: CEIL_Y - 40, gradientUnits: 'userSpaceOnUse' },
            React.createElement('stop', { offset: '0%', stopColor: '#fff', stopOpacity: 1 }),
            React.createElement('stop', { offset: '70%', stopColor: '#fff', stopOpacity: 0.5 }),
            React.createElement('stop', { offset: '100%', stopColor: '#fff', stopOpacity: 0 }),
          ),
          React.createElement('mask', { id: 'fillMask' },
            React.createElement('rect', { x: 0, y: 0, width: 1280, height: 720, fill: 'url(#fillFade)' }),
          ),
          React.createElement('clipPath', { id: 'breakClip' },
            React.createElement('rect', { x: 820, y: 0, width: Math.max(0, breakTipX - 820), height: 720 }),
          ),
        ),

        // faint dot grid background (dashboard texture)
        React.createElement('g', { opacity: 0.5 },
          Array.from({ length: 19 }).map((_, c) =>
            Array.from({ length: 11 }).map((_, r) =>
              React.createElement('circle', {
                key: c + '-' + r, cx: AX_X + c * 50, cy: TOP + r * 44, r: 1.1, fill: faint,
              })
            )
          )
        ),

        // axes
        React.createElement('line', { x1: AX_X, y1: TOP - 4, x2: AX_X, y2: BASE_Y, stroke: ink, strokeWidth: 1.6 }),
        React.createElement('line', { x1: AX_X, y1: BASE_Y, x2: RIGHT + 8, y2: BASE_Y, stroke: ink, strokeWidth: 1.6 }),
        // axis ticks
        [0, 1, 2, 3, 4].map((i) =>
          React.createElement('line', {
            key: 'ty' + i, x1: AX_X - 5, y1: BASE_Y - i * 100, x2: AX_X, y2: BASE_Y - i * 100,
            stroke: ink, strokeWidth: 1.6,
          })
        ),
        React.createElement('text', { x: AX_X - 14, y: TOP + 6, textAnchor: 'end', fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.14em', fill: grey, transform: 'rotate(-90 ' + (AX_X - 14) + ' ' + (TOP + 6) + ')' }, 'REVENUE'),
        React.createElement('text', { x: RIGHT, y: BASE_Y + 24, textAnchor: 'end', fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.14em', fill: grey }, 'TIME →'),

        // dotted ceiling line
        React.createElement('line', {
          x1: AX_X, y1: CEIL_Y, x2: ceilX, y2: CEIL_Y,
          stroke: ink, strokeWidth: 2, strokeDasharray: '2 7', strokeLinecap: 'round',
          opacity: 0.85,
        }),

        // ── halftone area fill under breakthrough ──
        fillOpacity > 0 ? React.createElement('g', { clipPath: 'url(#breakClip)', opacity: fillOpacity },
          React.createElement('g', { mask: 'url(#fillMask)' },
            React.createElement('path', {
              d: 'M 820 ' + BASE_Y + ' L ' + BREAK.map((p) => p[0] + ' ' + p[1]).join(' L ') + ' L 1080 ' + BASE_Y + ' Z',
              fill: 'url(#halftone)',
            }),
          ),
        ) : null,

        // node rail
        React.createElement('line', { x1: 260, y1: NODE_Y, x2: 1060, y2: NODE_Y, stroke: hair, strokeWidth: 1.4 }),

        // connector (release) — drawn under breakthrough
        connOpacity > 0 ? React.createElement('path', {
          d: conn.d, fill: 'none', stroke: yellow, strokeWidth: 2.4,
          strokeDasharray: '3 5', strokeLinecap: 'round', opacity: connOpacity,
        }) : null,

        // rising / plateau line (ink)
        React.createElement('path', {
          d: rise.d, fill: 'none', stroke: ink, strokeWidth: 3,
          strokeLinejoin: 'round', strokeLinecap: 'round',
        }),
        // rising head dot
        tip ? React.createElement('circle', { cx: tip[0], cy: tip[1], r: 5, fill: ink }) : null,

        // breakthrough line (yellow, over ink with subtle ink core)
        pBreak > 0 ? React.createElement('path', {
          d: brk.d, fill: 'none', stroke: yellow, strokeWidth: 4.5,
          strokeLinejoin: 'miter', strokeLinecap: 'square',
        }) : null,
        pBreak > 0 ? React.createElement('path', {
          d: brk.d, fill: 'none', stroke: ink, strokeWidth: 1.4,
          strokeLinejoin: 'miter', strokeLinecap: 'square',
        }) : null,
        // breakthrough head dot
        (pBreak > 0 && pBreak < 1) ? React.createElement('g', null,
          React.createElement('rect', { x: brk.tip[0] - 7, y: brk.tip[1] - 7, width: 14, height: 14, fill: yellow, stroke: ink, strokeWidth: 2 }),
        ) : null,

        // nodes
        React.createElement('g', null, nodeEls),

        // scanner sweep
        scanOn ? React.createElement('g', { opacity: scanOpacity },
          React.createElement('rect', { x: scanX - 26, y: NODE_Y - 60, width: 52, height: 120, fill: yellow, opacity: 0.16 }),
          React.createElement('line', { x1: scanX, y1: NODE_Y - 60, x2: scanX, y2: NODE_Y + 50, stroke: ink, strokeWidth: 1.4, strokeDasharray: '4 4' }),
        ) : null,
      ),

      // ── phase labels ──
      React.createElement(Label, {
        opacity: fade(t, 1.3, 1.55, 3.5, 3.9),
        style: { left: 850, top: 268, color: ink },
      }, 'THE CEILING'),

      // CONSTRAINT FOUND chip
      React.createElement('div', {
        style: {
          position: 'absolute', left: 540, top: 686, transform: 'translateX(-50%)',
          opacity: fade(t, 2.95, 3.2, 4.4, 4.8), fontFamily: MONO, fontWeight: 700,
          fontSize: 12, letterSpacing: '0.18em', color: ink,
          display: 'flex', alignItems: 'center', gap: 7,
        },
      },
        React.createElement('span', { style: { width: 7, height: 7, background: yellow, display: 'inline-block', boxShadow: '0 0 0 1px ' + ink } }),
        'CONSTRAINT FOUND',
      ),

      // COMPOUNDING SCALE
      React.createElement('div', {
        style: {
          position: 'absolute', left: 600, top: 150,
          opacity: fade(t, 4.7, 5.0, 6.55, 7.0), fontFamily: MONO, fontWeight: 700,
          fontSize: 13, letterSpacing: '0.18em', color: ink,
          display: 'flex', alignItems: 'center', gap: 8,
        },
      },
        React.createElement('span', { style: { display: 'inline-flex', gap: 3 } },
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: yellow } }),
          React.createElement('span', { style: { width: 7, height: 7, background: red } }),
        ),
        'COMPOUNDING SCALE',
      ),

      // ── ticking number ──
      React.createElement('div', {
        style: {
          position: 'absolute', left: 205, top: 116, textAlign: 'left',
          opacity: numOpacity, fontFamily: MONO,
        },
      },
        React.createElement('div', {
          style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: grey, marginBottom: 2 },
        }, 'BLENDED ROAS'),
        React.createElement('div', {
          style: { fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
        },
          roas,
          React.createElement('span', { style: { color: yellow, WebkitTextStroke: '1px ' + ink } }, '×'),
        ),
      ),
    );
  }

  window.CeilingBreak = CeilingBreak;
})();
