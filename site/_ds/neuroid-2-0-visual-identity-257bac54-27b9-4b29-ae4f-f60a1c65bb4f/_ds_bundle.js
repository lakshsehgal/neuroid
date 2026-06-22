/* @ds-bundle: {"format":3,"namespace":"NeuroidDesignSystem_257bac","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"e21d2db7e18b","components/core/Badge.jsx":"7b82c104d95e","components/core/Button.jsx":"4af37448479e","components/core/Card.jsx":"f8d97c38516f","components/core/Tag.jsx":"18d99aea58d0","components/forms/Checkbox.jsx":"6e5b2fb38d87","components/forms/Input.jsx":"fc3a4f37e78a","components/forms/Select.jsx":"fbdcbb9e4351","components/forms/Switch.jsx":"7a238065642d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NeuroidDesignSystem_257bac = window.NeuroidDesignSystem_257bac || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Avatar
 * Square (brand default) or round profile mark. Image with initials fallback.
 */
function Avatar({
  src = null,
  name = "",
  size = 40,
  round = false,
  style = {},
  ...rest
}) {
  const initials = name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: "none",
      overflow: "hidden",
      borderRadius: round ? "var(--radius-pill)" : "var(--radius-0)",
      border: "1.5px solid var(--neuroid-ink)",
      background: "var(--neuroid-yellow)",
      color: "var(--neuroid-ink)",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      letterSpacing: "-0.02em",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "•");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Badge
 * Compact status / category label. Square corners, uppercase, loud.
 */
function Badge({
  children,
  variant = "solid",
  size = "md",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: "10px",
      padding: "2px 7px",
      letterSpacing: "0.1em"
    },
    md: {
      fontSize: "11px",
      padding: "3px 9px",
      letterSpacing: "0.12em"
    }
  };
  const variants = {
    solid: {
      background: "var(--neuroid-ink)",
      color: "var(--neuroid-paper)",
      border: "1.5px solid var(--neuroid-ink)"
    },
    yellow: {
      background: "var(--neuroid-yellow)",
      color: "var(--neuroid-ink)",
      border: "1.5px solid var(--neuroid-ink)"
    },
    red: {
      background: "var(--neuroid-red)",
      color: "var(--neuroid-paper)",
      border: "1.5px solid var(--neuroid-ink)"
    },
    outline: {
      background: "transparent",
      color: "var(--neuroid-ink)",
      border: "1.5px solid var(--neuroid-ink)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      textTransform: "uppercase",
      lineHeight: 1.4,
      borderRadius: "var(--radius-0)",
      whiteSpace: "nowrap",
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Button
 * Brutalist, sharp-cornered action. Optional hard "printed" shadow block
 * that presses on click. Variants map to the brand pairings.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: "13px",
      padding: "8px 14px",
      gap: "7px"
    },
    md: {
      fontSize: "15px",
      padding: "12px 20px",
      gap: "9px"
    },
    lg: {
      fontSize: "17px",
      padding: "16px 28px",
      gap: "10px"
    }
  };
  const variants = {
    primary: {
      background: "var(--neuroid-yellow)",
      color: "var(--neuroid-ink)",
      border: "1.5px solid var(--neuroid-ink)"
    },
    inverse: {
      background: "var(--neuroid-ink)",
      color: "var(--neuroid-paper)",
      border: "1.5px solid var(--neuroid-ink)"
    },
    outline: {
      background: "transparent",
      color: "var(--neuroid-ink)",
      border: "1.5px solid var(--neuroid-ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--neuroid-ink)",
      border: "1.5px solid transparent"
    },
    danger: {
      background: "var(--neuroid-paper)",
      color: "var(--neuroid-red)",
      border: "1.5px solid var(--neuroid-red)"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes[size].gap,
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.01em",
    borderRadius: "var(--radius-0)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    width: full ? "100%" : "auto",
    transition: "transform var(--dur-fast) var(--ease-snap), box-shadow var(--dur-fast) var(--ease-snap), background var(--dur-fast) var(--ease-out)",
    boxShadow: block ? "3px 3px 0 0 var(--neuroid-ink)" : "none",
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const onDown = e => {
    if (disabled) return;
    if (block) {
      e.currentTarget.style.transform = "translate(3px, 3px)";
      e.currentTarget.style.boxShadow = "0 0 0 0 var(--neuroid-ink)";
    } else {
      e.currentTarget.style.transform = "translateY(1px)";
    }
  };
  const reset = e => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = block ? "3px 3px 0 0 var(--neuroid-ink)" : "none";
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: base,
    onMouseDown: onDown,
    onMouseUp: reset,
    onMouseLeave: reset
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Card
 * Sharp-cornered container. Hairline by default; "block" adds the
 * printed hard-shadow; "ink" inverts to the dark surface.
 */
function Card({
  children,
  variant = "default",
  padding = "var(--space-6)",
  style = {},
  ...rest
}) {
  const variants = {
    default: {
      background: "var(--neuroid-paper)",
      color: "var(--text-body)",
      border: "1.5px solid var(--neuroid-ink)",
      boxShadow: "none"
    },
    block: {
      background: "var(--neuroid-paper)",
      color: "var(--text-body)",
      border: "1.5px solid var(--neuroid-ink)",
      boxShadow: "6px 6px 0 0 var(--neuroid-ink)"
    },
    ink: {
      background: "var(--neuroid-ink)",
      color: "var(--fg-inv)",
      border: "1.5px solid var(--neuroid-ink)",
      boxShadow: "none"
    },
    yellow: {
      background: "var(--neuroid-yellow)",
      color: "var(--neuroid-ink)",
      border: "1.5px solid var(--neuroid-ink)",
      boxShadow: "none"
    },
    sunken: {
      background: "var(--surface-sunken)",
      color: "var(--text-body)",
      border: "1.5px solid var(--border-soft)",
      boxShadow: "none"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: "var(--radius-0)",
      padding,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Tag
 * Filter / category chip. Square by default, optional pill + remove button.
 */
function Tag({
  children,
  active = false,
  pill = false,
  onRemove = null,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: "13px",
      lineHeight: 1,
      padding: "7px 12px",
      borderRadius: pill ? "var(--radius-pill)" : "var(--radius-0)",
      border: "1.5px solid var(--neuroid-ink)",
      background: active ? "var(--neuroid-ink)" : "transparent",
      color: active ? "var(--neuroid-paper)" : "var(--neuroid-ink)",
      cursor: "pointer",
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Remove",
    style: {
      all: "unset",
      cursor: "pointer",
      fontSize: "14px",
      lineHeight: 1,
      opacity: 0.7
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Checkbox
 * Square box, ink border, yellow fill + ink check when on.
 */
function Checkbox({
  checked = false,
  onChange = () => {},
  label = null,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const cbId = id || React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-sans)",
      fontSize: "15px",
      color: "var(--neuroid-ink)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange(e.target.checked, e),
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 20,
      height: 20,
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1.5px solid var(--neuroid-ink)",
      background: checked ? "var(--neuroid-yellow)" : "var(--neuroid-paper)",
      transition: "background var(--dur-fast) var(--ease-out)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 13 13",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 7L5 10L11 3",
    stroke: "var(--neuroid-ink)",
    strokeWidth: "2.2",
    strokeLinecap: "square"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Input
 * Sharp text field. Hairline ink border, red focus, optional label/hint/error.
 */
function Input({
  label = null,
  hint = null,
  error = null,
  prefix = null,
  size = "md",
  id,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || React.useId();
  const sizes = {
    sm: {
      fontSize: "14px",
      padding: "8px 11px"
    },
    md: {
      fontSize: "15px",
      padding: "11px 13px"
    },
    lg: {
      fontSize: "16px",
      padding: "14px 15px"
    }
  };
  const borderColor = error ? "var(--neuroid-red)" : focused ? "var(--neuroid-ink)" : "var(--gray-300)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "13px",
      fontWeight: 700,
      color: "var(--neuroid-ink)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "var(--neuroid-paper)",
      border: `1.5px solid ${borderColor}`,
      borderRadius: "var(--radius-0)",
      boxShadow: focused && !error ? "3px 3px 0 0 var(--neuroid-ink)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-snap)",
      padding: prefix ? "0 0 0 13px" : 0
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--gray-500)",
      fontSize: sizes[size].fontSize
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      color: "var(--neuroid-ink)",
      fontFamily: "var(--font-sans)",
      ...sizes[size]
    }
  }))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: error ? "var(--neuroid-red)" : "var(--gray-500)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Select
 * Styled native select. Sharp, ink border, custom chevron.
 */
function Select({
  label = null,
  hint = null,
  children,
  id,
  size = "md",
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const selId = id || React.useId();
  const sizes = {
    sm: {
      fontSize: "14px",
      padding: "8px 36px 8px 11px"
    },
    md: {
      fontSize: "15px",
      padding: "11px 38px 11px 13px"
    },
    lg: {
      fontSize: "16px",
      padding: "14px 40px 14px 15px"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontSize: "13px",
      fontWeight: 700,
      color: "var(--neuroid-ink)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      all: "unset",
      width: "100%",
      boxSizing: "border-box",
      cursor: "pointer",
      color: "var(--neuroid-ink)",
      background: "var(--neuroid-paper)",
      border: `1.5px solid ${focused ? "var(--neuroid-ink)" : "var(--gray-300)"}`,
      borderRadius: "var(--radius-0)",
      boxShadow: focused ? "3px 3px 0 0 var(--neuroid-ink)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-snap)",
      ...sizes[size]
    }
  }), children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: 13,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "8",
    viewBox: "0 0 12 8",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1.5L6 6.5L11 1.5",
    stroke: "var(--neuroid-ink)",
    strokeWidth: "2",
    strokeLinecap: "square"
  })))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: "var(--gray-500)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neuroid — Switch
 * Rectangular brutalist toggle. Ink track fills yellow when on; square knob slides.
 */
function Switch({
  checked = false,
  onChange = () => {},
  label = null,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const swId = id || React.useId();
  const W = 46,
    H = 26,
    PAD = 3,
    KNOB = H - PAD * 2;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-sans)",
      fontSize: "15px",
      color: "var(--neuroid-ink)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: swId,
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange(e.target.checked, e),
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "relative",
      width: W,
      height: H,
      flex: "none",
      border: "1.5px solid var(--neuroid-ink)",
      background: checked ? "var(--neuroid-yellow)" : "var(--neuroid-paper)",
      transition: "background var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: PAD - 1.5,
      left: checked ? W - KNOB - PAD - 1.5 : PAD - 1.5,
      width: KNOB,
      height: KNOB,
      background: "var(--neuroid-ink)",
      transition: "left var(--dur-base) var(--ease-snap)"
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
