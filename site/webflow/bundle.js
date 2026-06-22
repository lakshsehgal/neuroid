/* ============================================================
   Neuroid — Portfolio: self-contained injectable bundle
   ------------------------------------------------------------
   Renders the entire Portfolio page (styles + markup + engine)
   into any host page as ONE custom-code script. Used for the
   Webflow custom-code route, but host-agnostic.

   Asset resolution:
   - Provide window.__NRD_ASSETS = { 'logos/woodenstreet.png': 'https://cdn…', … }
     to map each local asset path to a hosted URL (e.g. Webflow CDN).
   - Otherwise paths fall back to window.__NRD_BASE + 'assets/…'
     (set __NRD_BASE to '' for a co-hosted /assets folder).
   Videos always stream from Cloudinary (absolute URLs).
   ============================================================ */
(function () {
  "use strict";

  var BASE = (typeof window.__NRD_BASE === 'string') ? window.__NRD_BASE : '';
  var MAP  = window.__NRD_ASSETS || {};
  // resolve an "assets/…" or "_ds/…fonts/…" path to a hosted URL
  function A(path) { return MAP[path] || (BASE + path); }

  var INK = 'var(--neuroid-ink)', YEL = 'var(--neuroid-yellow)';

  /* ---------------- Styles (tokens inlined; no external CSS dep) ---------------- */
  var css = '' +
  '@font-face{font-family:"FH Lecturis";src:url("' + A('_ds/fonts/FHLecturis-Bold.otf') + '") format("opentype");font-weight:700;font-style:normal;font-display:swap;}' +
  '@font-face{font-family:"DM Sans";src:url("' + A('_ds/fonts/DMSans-Variable.ttf') + '") format("truetype");font-weight:100 1000;font-stretch:75% 125%;font-style:normal;font-display:swap;}' +
  '@font-face{font-family:"DM Sans";src:url("' + A('_ds/fonts/DMSans-Italic-Variable.ttf') + '") format("truetype");font-weight:100 1000;font-stretch:75% 125%;font-style:italic;font-display:swap;}' +
  '@font-face{font-family:"PP Editorial New";src:url("' + A('_ds/fonts/PPEditorialNew-Italic.otf') + '") format("opentype");font-weight:400;font-style:normal;font-display:swap;}' +
  '@font-face{font-family:"PP Editorial New";src:url("' + A('_ds/fonts/PPEditorialNew-Italic.otf') + '") format("opentype");font-weight:400;font-style:italic;font-display:swap;}' +
  '.nrd-portfolio{' +
    '--neuroid-ink:#0C0C0C;--neuroid-yellow:#FEEF24;--neuroid-red:#FF2600;--neuroid-paper:#FFFFFF;' +
    '--neuroid-grey:#8A8A8A;--neuroid-grey-dark:#B5B5B5;' +
    '--font-sans:"DM Sans",system-ui,-apple-system,Segoe UI,sans-serif;' +
    '--font-serif:"PP Editorial New",Georgia,"Times New Roman",serif;' +
    '--font-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;' +
    '--ease-out:cubic-bezier(0.16,1,0.3,1);--ease-snap:cubic-bezier(0.5,0,0,1);--dur-fast:120ms;' +
    'font-family:var(--font-sans);background:#F4F1EA;color:var(--neuroid-ink);}' +
  '.nrd-portfolio *{box-sizing:border-box;}' +
  '.nrd-portfolio .nrd-highlight{background:var(--neuroid-yellow);color:var(--neuroid-ink);font-family:var(--font-serif);font-style:italic;font-weight:400;padding:0 0.12em;-webkit-box-decoration-break:clone;box-decoration-break:clone;}' +
  '.nrd-portfolio .nrd-pixels{display:inline-flex;gap:5px;}' +
  '.nrd-portfolio .nrd-pixels i{width:8px;height:8px;background:var(--neuroid-yellow);}' +
  '.nrd-portfolio .nrd-pixels i:last-child{background:var(--neuroid-red);}' +
  '@keyframes nrd-marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}' +
  '@keyframes nrd-marquee-rev{from{transform:translateX(-50%);}to{transform:translateX(0);}}' +
  '@keyframes nrd-pop{0%{opacity:0;transform:scale(0.96);}100%{opacity:1;transform:scale(1);}}' +
  '.nrd-portfolio .nrd-btn{display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-sans);font-weight:700;line-height:1;letter-spacing:-0.01em;border-radius:0;cursor:pointer;text-decoration:none;border:1.5px solid var(--neuroid-ink);transition:transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap),background var(--dur-fast) var(--ease-out);}' +
  '.nrd-portfolio .nrd-btn--sm{font-size:13px;padding:8px 14px;gap:7px;}' +
  '.nrd-portfolio .nrd-btn--md{font-size:15px;padding:12px 20px;gap:9px;}' +
  '.nrd-portfolio .nrd-btn--lg{font-size:17px;padding:16px 28px;gap:10px;}' +
  '.nrd-portfolio .nrd-btn--primary{background:var(--neuroid-yellow);color:var(--neuroid-ink);}' +
  '.nrd-portfolio .nrd-btn--inverse{background:var(--neuroid-ink);color:var(--neuroid-paper);}' +
  '.nrd-portfolio .nrd-btn--full{width:100%;}' +
  '.nrd-portfolio .nrd-btn--block{box-shadow:3px 3px 0 0 var(--neuroid-ink);}' +
  '.nrd-portfolio .nrd-btn--block:active{transform:translate(3px,3px);box-shadow:0 0 0 0 var(--neuroid-ink);}' +
  '.nrd-portfolio .nav-desktop{display:flex;align-items:center;gap:6px;}' +
  '.nrd-portfolio .nav-mobile-btn{display:none;}' +
  '.nrd-portfolio .nav-desktop-cta{display:inline-flex;}' +
  '@media (max-width:919px){.nrd-portfolio .nav-desktop{display:none;}.nrd-portfolio .nav-desktop-cta{display:none;}.nrd-portfolio .nav-mobile-btn{display:flex;}}' +
  '.nrd-portfolio #nrd-mobileMenu{display:none;}.nrd-portfolio #nrd-mobileMenu.open{display:block;}' +
  '@media (prefers-reduced-motion:reduce){.nrd-portfolio *{animation:none !important;}}';

  var styleEl = document.createElement('style');
  styleEl.setAttribute('data-nrd-portfolio', '');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------------- Markup ---------------- */
  var root = document.createElement('div');
  root.className = 'nrd-portfolio';
  root.style.cssText = 'overflow-x:hidden;';
  root.innerHTML =
  '<header style="position:sticky;top:0;z-index:50;background:rgba(244,241,234,0.92);backdrop-filter:blur(8px);border-bottom:1.5px solid var(--neuroid-ink);">' +
    '<div style="max-width:1320px;margin:0 auto;padding:14px clamp(18px,4vw,56px);display:flex;align-items:center;justify-content:space-between;gap:24px;">' +
      '<a href="#nrd-top" style="display:flex;align-items:center;flex:none;text-decoration:none;"><img src="' + A('assets/brand/neuroid-logo-black.svg') + '" alt="Neuroid" style="height:40px;width:auto;display:block;"></a>' +
      '<nav style="display:flex;align-items:center;gap:8px;font-family:var(--font-sans);font-weight:600;font-size:14px;">' +
        '<div class="nav-desktop">' +
          '<a href="#" style="text-decoration:none;color:var(--neuroid-ink);padding:8px 14px;letter-spacing:-0.01em;">Home</a>' +
          '<a href="#nrd-work" style="text-decoration:none;color:var(--neuroid-ink);padding:8px 14px;letter-spacing:-0.01em;border-bottom:2px solid var(--neuroid-ink);">Work</a>' +
          '<a href="#" style="text-decoration:none;color:var(--neuroid-ink);padding:8px 14px;letter-spacing:-0.01em;">Services</a>' +
          '<a href="#" style="text-decoration:none;color:var(--neuroid-ink);padding:8px 14px;letter-spacing:-0.01em;">About</a>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<a class="nav-desktop-cta" href="mailto:hello@neuroidmedia.com" style="text-decoration:none;"><span class="nrd-btn nrd-btn--primary nrd-btn--block nrd-btn--sm">Book a Growth Audit</span></a>' +
          '<button class="nav-mobile-btn" id="nrd-hamburger" aria-label="Menu" style="background:none;border:1.5px solid var(--neuroid-ink);width:42px;height:38px;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;padding:0;">' +
            '<span style="width:18px;height:2px;background:var(--neuroid-ink);display:block;"></span><span style="width:18px;height:2px;background:var(--neuroid-ink);display:block;"></span><span style="width:18px;height:2px;background:var(--neuroid-ink);display:block;"></span>' +
          '</button>' +
        '</div>' +
      '</nav>' +
    '</div>' +
    '<div id="nrd-mobileMenu" style="border-top:1.5px solid var(--neuroid-ink);background:var(--neuroid-paper);padding:8px clamp(18px,4vw,56px) 18px;">' +
      '<a href="#" data-close style="display:block;text-decoration:none;color:var(--neuroid-ink);padding:12px 0;font-weight:600;border-bottom:1px solid rgba(12,12,12,0.1);">Home</a>' +
      '<a href="#nrd-work" data-close style="display:block;text-decoration:none;color:var(--neuroid-ink);padding:12px 0;font-weight:600;border-bottom:1px solid rgba(12,12,12,0.1);">Work</a>' +
      '<a href="#" data-close style="display:block;text-decoration:none;color:var(--neuroid-ink);padding:12px 0;font-weight:600;border-bottom:1px solid rgba(12,12,12,0.1);">Services</a>' +
      '<a href="#" data-close style="display:block;text-decoration:none;color:var(--neuroid-ink);padding:12px 0;font-weight:600;border-bottom:1px solid rgba(12,12,12,0.1);">About</a>' +
      '<div style="padding-top:14px;"><a href="mailto:hello@neuroidmedia.com" style="text-decoration:none;"><span class="nrd-btn nrd-btn--primary nrd-btn--block nrd-btn--full nrd-btn--md">Book a Growth Audit</span></a></div>' +
    '</div>' +
  '</header>' +

  '<section id="nrd-top" style="position:relative;background:radial-gradient(circle at center, rgba(12,12,12,0.07) 1.3px, transparent 1.9px) 0 0 / 22px 22px, #F4F1EA;padding:clamp(48px,7vw,96px) clamp(18px,4vw,56px) clamp(40px,5vw,64px);border-bottom:1.5px solid var(--neuroid-ink);overflow:hidden;">' +
    '<div style="max-width:1320px;margin:0 auto;">' +
      '<div data-reveal style="display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:26px;color:var(--neuroid-ink);"><span style="width:8px;height:8px;background:var(--neuroid-red);display:inline-block;flex:none;"></span><span>Portfolio - Selected creative</span></div>' +
      '<h1 data-reveal style="font-family:var(--font-sans);font-weight:700;letter-spacing:-0.04em;line-height:0.98;font-size:clamp(2.7rem,7.2vw,6rem);margin:0;max-width:16ch;text-wrap:balance;">A wall of work that actually <span class="nrd-highlight" style="font-family:var(--font-serif);font-style:italic;font-weight:400;">performed</span><span style="display:inline-block;width:0.15em;height:0.15em;background:var(--neuroid-red);vertical-align:baseline;margin-left:0.04em;"></span></h1>' +
      '<p data-reveal style="font-size:clamp(1.05rem,1.6vw,1.32rem);line-height:1.5;max-width:600px;margin:30px 0 0;color:var(--neuroid-grey);">Hundreds of scroll-stopping creatives - performance video, UGC, social and ad films - built for D2C brands and shipped at a volume most studios can’t touch. This is a slice.</p>' +
    '</div>' +
  '</section>' +

  '<section style="border-bottom:1.5px solid var(--neuroid-ink);background:var(--neuroid-ink);color:var(--neuroid-paper);"><div id="nrd-statCells" style="max-width:1320px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(50%,180px),1fr));"></div></section>' +

  '<section id="nrd-work" style="padding:clamp(44px,6vw,80px) clamp(18px,4vw,56px) clamp(56px,8vw,104px);border-bottom:1.5px solid var(--neuroid-ink);">' +
    '<div style="max-width:1320px;margin:0 auto;">' +
      '<div data-reveal style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px 32px;margin-bottom:clamp(26px,3.4vw,40px);">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:9px;font-family:var(--font-mono);font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--neuroid-red);margin-bottom:16px;"><span>/</span><span>The creative wall</span></div>' +
          '<h2 style="font-family:var(--font-sans);font-weight:700;letter-spacing:-0.035em;line-height:1.02;font-size:clamp(1.7rem,3.4vw,2.8rem);margin:0;max-width:18ch;">Every tile shipped, tested &amp; <span class="nrd-highlight">scaled</span><span style="display:inline-block;width:0.16em;height:0.16em;background:var(--neuroid-red);vertical-align:baseline;margin-left:0.05em;"></span></h2>' +
        '</div>' +
        '<div id="nrd-resultCount" style="font-family:var(--font-mono);font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--neuroid-grey);padding-bottom:6px;"></div>' +
      '</div>' +
      '<div id="nrd-galleryTiles" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(150px,15.5vw,210px),1fr));gap:clamp(12px,1.4vw,18px);"></div>' +
    '</div>' +
  '</section>' +

  '<section style="padding:clamp(48px,7vw,88px) 0;border-bottom:1.5px solid var(--neuroid-ink);overflow:hidden;">' +
    '<div style="max-width:1320px;margin:0 auto;padding:0 clamp(18px,4vw,56px);">' +
      '<div data-reveal style="display:flex;align-items:center;gap:9px;font-family:var(--font-mono);font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--neuroid-red);margin-bottom:18px;"><span>/</span><span>Made for</span></div>' +
      '<h2 data-reveal style="font-family:var(--font-sans);font-weight:700;letter-spacing:-0.035em;line-height:1.04;font-size:clamp(1.5rem,3vw,2.4rem);margin:0 0 clamp(32px,4.5vw,52px);max-width:22ch;">The brands behind the work - <span style="font-family:var(--font-serif);font-style:italic;font-weight:400;">100+</span> and counting.</h2>' +
    '</div>' +
    '<div data-reveal style="display:flex;flex-direction:column;gap:16px;padding:0 clamp(18px,4vw,56px);-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);">' +
      '<div style="overflow:hidden;"><div id="nrd-logoRowA"></div></div>' +
      '<div style="overflow:hidden;"><div id="nrd-logoRowB"></div></div>' +
    '</div>' +
  '</section>' +

  '<section id="nrd-contact" style="position:relative;background:var(--neuroid-yellow);padding:clamp(64px,10vw,140px) clamp(18px,4vw,56px);border-bottom:1.5px solid var(--neuroid-ink);overflow:hidden;">' +
    '<div aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(circle at center, rgba(12,12,12,0.08) 1.4px, transparent 2px);background-size:24px 24px;pointer-events:none;"></div>' +
    '<div data-reveal style="position:relative;max-width:1000px;margin:0 auto;text-align:center;">' +
      '<h2 style="font-family:var(--font-sans);font-weight:700;letter-spacing:-0.04em;line-height:0.98;font-size:clamp(2.4rem,6.4vw,5.4rem);margin:0;text-wrap:balance;">Want work like <span style="font-family:var(--font-serif);font-style:italic;font-weight:400;">this</span>?<span style="display:inline-block;width:0.15em;height:0.15em;background:var(--neuroid-red);vertical-align:baseline;margin-left:0.04em;"></span></h2>' +
      '<p style="font-size:clamp(1.05rem,1.7vw,1.35rem);line-height:1.5;max-width:660px;margin:26px auto 0;">A creative engine that ships volume and actually performs - plugged into the media that scales it.</p>' +
      '<div style="display:flex;justify-content:center;margin-top:38px;"><a href="mailto:hello@neuroidmedia.com" style="text-decoration:none;"><span class="nrd-btn nrd-btn--inverse nrd-btn--block nrd-btn--lg">Book a Growth Audit</span></a></div>' +
      '<div style="font-family:var(--font-mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;margin-top:30px;">New Delhi, India · hello@neuroidmedia.com</div>' +
    '</div>' +
  '</section>' +

  '<footer style="background:var(--neuroid-ink);color:var(--neuroid-paper);padding:clamp(56px,7vw,88px) clamp(18px,4vw,56px) 40px;">' +
    '<div style="max-width:1320px;margin:0 auto;">' +
      '<div style="display:flex;flex-wrap:wrap;gap:48px;justify-content:space-between;">' +
        '<div style="flex:1 1 320px;min-width:260px;">' +
          '<img src="' + A('assets/brand/neuroid-logo.svg') + '" alt="Neuroid" style="height:30px;margin-bottom:20px;">' +
          '<p style="font-size:1.05rem;line-height:1.5;max-width:340px;margin:0;color:var(--neuroid-grey-dark);">An integrated growth &amp; creative studio for <span style="font-family:var(--font-serif);font-style:italic;color:#fff;">D2C brands</span>.</p>' +
          '<div class="nrd-pixels" style="margin-top:24px;"><i></i><i></i><i></i></div>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:48px;">' +
          '<div>' +
            '<div style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--neuroid-grey-dark);margin-bottom:16px;">Explore</div>' +
            '<a href="#" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">Home</a>' +
            '<a href="#nrd-work" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">Work</a>' +
            '<a href="#" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">Services</a>' +
            '<a href="#" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">About</a>' +
          '</div>' +
          '<div>' +
            '<div style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--neuroid-grey-dark);margin-bottom:16px;">Connect</div>' +
            '<a href="https://instagram.com" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">Instagram</a>' +
            '<a href="https://linkedin.com" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">LinkedIn</a>' +
            '<a href="mailto:hello@neuroidmedia.com" style="display:block;text-decoration:none;color:#fff;font-size:14px;padding:6px 0;">Email</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:56px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.16);display:flex;flex-wrap:wrap;gap:12px 24px;justify-content:space-between;font-family:var(--font-mono);font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--neuroid-grey-dark);">' +
        '<span>New Delhi, India · +91 6397-917-909</span><span>www.neuroidmedia.com</span>' +
      '</div>' +
    '</div>' +
  '</footer>';

  document.body.appendChild(root);
  var lbMount = document.createElement('div');
  document.body.appendChild(lbMount);

  /* ---------------- Data ---------------- */
  function items() {
    var CL = 'https://res.cloudinary.com/dbuklvo6b/video/upload/f_auto,q_auto,w_480/';
    var Vraw = [
      ['v1782043217/UNO_Luxe_V2_lefbae','UNO Luxe','film'],['v1782042891/Yoho_Pitstop_H1_V2_3_jdlfvv','Yoho','perf'],
      ['v1782042845/H1_CupJi_V1_3_nb1jzu','Cup Ji','ugc'],['v1782042844/PU_3___Hook_2_1_egyvbl','Period Underwear','ugc'],
      ['v1782042843/9X16_V1_r2yjdc','Spirit Animal','perf'],['v1782042842/Karassa_UGC_2_2_w1avqf','Karassa','ugc'],
      ['v1782042839/Svarn_Jewels_CC146_inm6hs','Svarn Jewels','perf'],['v1782042838/CC15_V3_ad3uqu','Jewelsmars','perf'],
      ['v1782042836/CC60_FRECKLES_VIDEO_silix5','Freckles','ugc'],['v1782042833/Svarn_Jewels_CC140_wkdu2m','Svarn Jewels','social'],
      ['v1782042831/CC33_PowerShift_Pants_video_jfrtn6','PowerShift','perf'],['v1782042826/Period_Underwear___Hook_2_oc2mad','Period Underwear','ugc'],
      ['v1782042826/CC14_Girls_Leggings_V2_l7z8a6','Superbottoms','perf'],['v1782042820/CC14_1_smi6hm','Superbottoms','perf'],
      ['v1782042817/9x16_V3_bscyvw','Lifelong','perf'],['v1782042816/CC5_Final_x5ejpn','Kisah','film'],
      ['v1782042815/CC11_Understyling_your_eyes_npetnn','Huesfab','social'],['v1782042814/CC101_Bedtime_Supremacy_ptdoos','Silverfied','social'],
      ['v1782042812/CC115_Bestseller_Rings_ajsz9s','Jewelsmars','perf'],['v1782042807/CC60_Silverfied_Screen_Freeze_Product_final_lmtvvo','Silverfied','social'],
      ['v1782042806/CC67_Silverfied_Stack_you_forget_to_take_off_fkuonn','Silverfied','social'],['v1782042805/CC56_silvercied_Msgs_in_DM_Final_srazws','Silverfied','social'],
      ['v1782042799/Sequence_01_1_f4rpm7','Wooden Street','film'],['v1782042791/CC27_Huesfab_All_collection_Final_vi2rjm','Huesfab','social'],
      ['v1782042790/PU_02_May_H2.wav_1_lvicth','Period Underwear','ugc'],['v1782042780/CC12_ceratine_Final_svatid','Ceratine','perf'],
      ['v1782042777/Polo_Gif_ybhdjd','Mackly','social'],['v1782042777/9x16_cova4q','Vaaree','perf'],
      ['v1782042774/CC3___Hard_Launch_-_Short_Kurta_oxl7wu','Kisah','film']
    ];
    var V = Vraw.map(function (r) { return { type: 'video', src: CL + r[0] + '.mp4', brand: r[1], cat: r[2] }; });
    var Sraw = [
      ['c01.png','Wooden Street'],['c02.png','Jewelsmars'],['c03.png','Lifelong'],['c04.png','Silverfied'],['c05.png','Kisah'],['c06.png','Yoho'],
      ['c07.png','Superbottoms'],['c08.png','Huesfab'],['c09.png','Vaaree'],['c10.jpg','Mackly'],['c11.jpg','Nourish You'],['c12.jpg','Spirit Animal'],
      ['c13.jpg','Awenest'],['c14.jpg','Ghani Putri'],['c15.jpg','Loving Crafts'],['c16.jpg','Chowkhat'],['c17.jpg','Supersox'],['c18.jpg','Vedansh'],
      ['c19.jpg','Jaipuri Crown'],['c20.jpg','Gataca'],['c21.jpg','Truth & Hair'],['c22.png','Deep Impact'],['c23.png','Evara'],['c24.jpg','Wooden Street'],
      ['c25.jpg','Jewelsmars'],['c26.jpg','Lifelong']
    ];
    var statics = Sraw.map(function (r) { return { type: 'img', src: A('assets/creatives/' + r[0]), brand: r[1], cat: 'static' }; });
    var out = [], n = Math.max(V.length, statics.length);
    for (var i = 0; i < n; i++) { if (i < V.length) out.push(V[i]); if (i % 2 === 1 && (i >> 1) < statics.length) out.push(statics[i >> 1]); }
    statics.forEach(function (s, i) { if (i % 2 === 0) out.push(s); });
    return out;
  }

  /* ---------------- Video visibility loop ---------------- */
  var _vids = new Set(), _visTimer = null;
  function registerVideo(el) {
    _vids.add(el);
    if (!_visTimer) {
      var tick = function () {
        var vh = window.innerHeight, vw = window.innerWidth;
        _vids.forEach(function (v) {
          if (!v.isConnected) { _vids.delete(v); return; }
          var r = v.getBoundingClientRect();
          var on = r.bottom > -80 && r.top < vh + 80 && r.right > 0 && r.left < vw;
          if (on) { if (v.paused) v.play().catch(function () {}); } else if (!v.paused) v.pause();
        });
      };
      _visTimer = setInterval(tick, 450); setTimeout(tick, 60);
    }
  }

  /* ---------------- Gallery ---------------- */
  function buildGallery() {
    var its = items(), grid = root.querySelector('#nrd-galleryTiles');
    root.querySelector('#nrd-resultCount').textContent = its.length + ' creatives';
    its.forEach(function (it) {
      var tile = document.createElement('div');
      tile.style.cssText = 'position:relative;aspect-ratio:9 / 16;overflow:hidden;border:1.5px solid ' + INK + ';background:' + INK + ';cursor:pointer;transition:transform .22s var(--ease-snap), box-shadow .22s var(--ease-snap);box-shadow:0 0 0 0 ' + YEL + ';';
      var media;
      if (it.type === 'video') {
        media = document.createElement('video');
        media.src = it.src; media.loop = true; media.playsInline = true; media.preload = 'none';
        media.muted = true; media.defaultMuted = true; media.setAttribute('muted', '');
        media.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:' + INK + ';';
        registerVideo(media);
      } else {
        media = document.createElement('img');
        media.src = it.src; media.loading = 'lazy'; media.alt = it.brand;
        media.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:rgba(12,12,12,0.05);';
      }
      var chip = document.createElement('div');
      chip.textContent = it.type === 'video' ? 'Video' : 'Still';
      chip.style.cssText = 'position:absolute;top:10px;left:10px;z-index:3;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';background:' + (it.type === 'video' ? YEL : '#fff') + ';border:1px solid ' + INK + ';padding:3px 6px;line-height:1;pointer-events:none;';
      var overlay = document.createElement('div');
      overlay.setAttribute('data-ov', '');
      overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:flex-end;padding:13px;background:linear-gradient(to top, rgba(12,12,12,0.72) 0%, rgba(12,12,12,0.0) 52%);opacity:0;transition:opacity .22s ease;z-index:2;pointer-events:none;';
      overlay.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;font-family:var(--font-sans);font-weight:700;font-size:13px;letter-spacing:-0.01em;color:#fff;">View<span style="font-size:15px;line-height:1;">↗</span></span>';
      tile.appendChild(media); tile.appendChild(chip); tile.appendChild(overlay);
      tile.addEventListener('mouseenter', function () { tile.style.transform = 'translate(-3px,-3px)'; tile.style.boxShadow = '7px 7px 0 0 ' + YEL; overlay.style.opacity = '1'; });
      tile.addEventListener('mouseleave', function () { tile.style.transform = 'none'; tile.style.boxShadow = '0 0 0 0 ' + YEL; overlay.style.opacity = '0'; });
      tile.addEventListener('click', function () { openLightbox(it); });
      grid.appendChild(tile);
    });
  }

  /* ---------------- Stats ---------------- */
  function buildStats() {
    var stats = [['200+','Creatives / month'],['100+','D2C brands'],['7.5x','Peak ROAS'],['₹450Cr+','Revenue influenced']];
    var wrap = root.querySelector('#nrd-statCells');
    stats.forEach(function (s) {
      var cell = document.createElement('div');
      cell.style.cssText = 'padding:clamp(22px,3vw,34px) clamp(18px,2.4vw,32px);border-right:1px solid rgba(255,255,255,0.16);border-bottom:1px solid rgba(255,255,255,0.16);';
      var num = document.createElement('div'); num.textContent = s[0];
      num.style.cssText = 'font-family:var(--font-sans);font-weight:700;letter-spacing:-0.04em;line-height:1;font-size:clamp(2rem,4vw,3.1rem);color:var(--neuroid-yellow);';
      var lab = document.createElement('div'); lab.textContent = s[1];
      lab.style.cssText = 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--neuroid-grey-dark);margin-top:10px;';
      cell.appendChild(num); cell.appendChild(lab); wrap.appendChild(cell);
    });
  }

  /* ---------------- Logo marquees ---------------- */
  function makeCell(b) {
    var cell = document.createElement('div');
    cell.style.cssText = 'flex:none;width:180px;height:84px;margin-right:16px;display:flex;align-items:center;justify-content:center;padding:16px 26px;border:1px solid var(--neuroid-ink);background:var(--neuroid-paper);transition:background .22s var(--ease-snap), box-shadow .22s var(--ease-snap), transform .22s var(--ease-snap);';
    var img = document.createElement('img');
    img.src = A('assets/logos/' + b[1]); img.alt = b[0]; img.loading = 'lazy';
    img.style.cssText = 'max-width:100%;max-height:38px;width:auto;object-fit:contain;mix-blend-mode:multiply;filter:grayscale(1);opacity:0.82;transition:filter .22s var(--ease-snap), opacity .22s var(--ease-snap);';
    cell.appendChild(img);
    cell.addEventListener('mouseenter', function () { cell.style.background = 'var(--neuroid-yellow)'; cell.style.boxShadow = '3px 3px 0 0 var(--neuroid-ink)'; cell.style.transform = 'translate(-1px,-1px)'; img.style.filter = 'none'; img.style.opacity = '1'; });
    cell.addEventListener('mouseleave', function () { cell.style.background = 'var(--neuroid-paper)'; cell.style.boxShadow = 'none'; cell.style.transform = 'none'; img.style.filter = 'grayscale(1)'; img.style.opacity = '0.82'; });
    return cell;
  }
  function buildLogoRow(mountId, brands, reverse, dur) {
    var track = document.createElement('div');
    track.style.cssText = 'display:flex;width:max-content;will-change:transform;animation:' + (reverse ? 'nrd-marquee-rev' : 'nrd-marquee') + ' ' + dur + ' linear infinite;';
    [false, true].forEach(function (isClone) {
      var set = document.createElement('div'); set.style.cssText = 'display:flex;flex:none;';
      if (isClone) set.setAttribute('aria-hidden', 'true');
      brands.forEach(function (b) { set.appendChild(makeCell(b)); });
      track.appendChild(set);
    });
    root.querySelector('#' + mountId).appendChild(track);
  }

  /* ---------------- Lightbox ---------------- */
  function openLightbox(it) {
    closeLightbox();
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100;background:rgba(8,8,8,0.86);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:clamp(28px,5vw,72px) clamp(18px,4vw,56px);';
    overlay.addEventListener('click', closeLightbox);
    var frame = document.createElement('div');
    frame.style.cssText = 'position:relative;border:1.5px solid ' + INK + ';box-shadow:0 18px 50px rgba(0,0,0,0.5);line-height:0;animation:nrd-pop .22s var(--ease-snap);';
    frame.addEventListener('click', function (e) { e.stopPropagation(); });
    var media;
    if (it.type === 'video') {
      media = document.createElement('video');
      media.src = it.src.replace('w_480', 'w_900'); media.loop = true; media.controls = true; media.autoplay = true; media.playsInline = true;
      media.style.cssText = 'display:block;width:auto;height:auto;max-width:100%;max-height:min(86vh,820px);aspect-ratio:9 / 16;object-fit:cover;background:' + INK + ';';
      media.muted = false; media.volume = 1; media.play().catch(function () { media.muted = true; media.play().catch(function () {}); });
    } else {
      media = document.createElement('img');
      media.src = it.src; media.alt = it.brand;
      media.style.cssText = 'display:block;width:auto;height:auto;max-width:100%;max-height:min(86vh,820px);object-fit:contain;background:' + INK + ';';
    }
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = 'position:absolute;top:-13px;right:-13px;width:42px;height:42px;cursor:pointer;background:' + YEL + ';border:1.5px solid ' + INK + ';box-shadow:3px 3px 0 0 ' + INK + ';display:flex;align-items:center;justify-content:center;padding:0;z-index:2;';
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="#0C0C0C" stroke-width="2" stroke-linecap="square"/></svg>';
    closeBtn.addEventListener('click', closeLightbox);
    var caption = document.createElement('div');
    caption.style.cssText = 'position:absolute;left:0;bottom:-44px;display:flex;align-items:center;gap:10px;';
    var tag = document.createElement('span'); tag.textContent = it.type === 'video' ? 'Video creative' : 'Still creative';
    tag.style.cssText = 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:' + INK + ';background:' + (it.type === 'video' ? YEL : '#fff') + ';border:1px solid ' + INK + ';padding:4px 8px;line-height:1;';
    caption.appendChild(tag);
    frame.appendChild(media); frame.appendChild(closeBtn); frame.appendChild(caption);
    overlay.appendChild(frame); lbMount.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() { if (lbMount.firstChild) lbMount.innerHTML = ''; document.body.style.overflow = ''; }
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var els = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
    var show = function (el) { el.style.opacity = '1'; el.style.transform = 'none'; };
    if (!('IntersectionObserver' in window)) { els.forEach(show); return; }
    els.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)'; });
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(show); }, 2400);
  }

  /* ---------------- Mobile menu ---------------- */
  function initMobileMenu() {
    var menu = root.querySelector('#nrd-mobileMenu');
    root.querySelector('#nrd-hamburger').addEventListener('click', function () { menu.classList.toggle('open'); });
    Array.prototype.slice.call(menu.querySelectorAll('[data-close]')).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });
  }

  /* ---------------- Boot ---------------- */
  buildStats();
  buildGallery();
  buildLogoRow('nrd-logoRowA', [
    ['Wooden Street','woodenstreet.png'],['Lifelong','lifelong-k.png'],['Jewelsmars','jewelsmars.png'],['Silverfied','silverfied.png'],
    ['Spirit Animal','spiritanimal.png'],['Awenest','awenest.avif'],['Truth & Hair','truthandhair.png'],['Deep Impact','deepimpact.png'],
    ['Superbottoms','superbottoms.avif'],['Kisah','kisah.avif'],['Yoho','yoho.png']
  ], false, '50s');
  buildLogoRow('nrd-logoRowB', [
    ['Vaaree','vaaree-k.png'],['Supersox','supersox-k.png'],['Nourish You','nourishyou.png'],['Evara','evara.svg'],
    ['Mackly','mackly.avif'],['Vedansh','vedansh-k.png'],['Chowkhat','chowkhat.avif'],['Jaipuri Crown','jaipuricrown.png'],
    ['Ghani Putri','ghaniputri.png'],['Gataca','gataca.png'],['Loving Crafts','lovingcrafts.avif']
  ], true, '62s');
  initMobileMenu();
  if (window.requestAnimationFrame) requestAnimationFrame(initReveal); else initReveal();
})();
