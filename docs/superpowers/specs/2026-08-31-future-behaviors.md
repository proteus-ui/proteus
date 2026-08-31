# Future behaviors

- **Status:** Backlog of ideas. Not an in-flight plan.
- **Date:** 2026-08-31
- **Parent spec:** `2026-08-29-proteus-component-library-design.md`

Ideas for later components and behaviors. Implement in Proteus terms: slots + `data-*` + CSS variables + React Aria + `useId`. Prefer a new plan when something is picked up.

Already in core (do not re-spec here): `Dialog`, `Select`, `SearchBar`, `CollapsibleSection`, `OtpInput`, `useCloseOnOutsideClick`, `KEYBOARD_KEYS`.

---

## Modal stack

The parent spec owns the stack architecture. When implementing, honor:

| Topic | Behavior |
| --- | --- |
| Overlay close | `mousedown` on overlay only (`target === currentTarget`); respect `closeOnOverlayClick !== false` on the **top** entry |
| Esc | document `keydown` while stack non-empty; top entry only; close if `closeOnEsc !== false`. Pass declarative `closeOnEsc` into the stack entry config |
| Z-index | `baseZIndex = 999`; entry `zIndex = 999 + index` |
| IDs | `useId` or `crypto.randomUUID()` |
| Scroll lock | `usePreventScroll` while `stack.length > 0` (not raw `overflow: hidden`) |
| Overlay `aria-hidden` | `true` on backdrop |
| Transition | reuse `useDialogTransition`; attach the ref to the overlay/panel that has the CSS transition. Duration is **0** when there is no CSS transition |

---

## Segmented toggle (better Tabs seed than a custom Tabset)

`role="radiogroup"` + native `<input type="radio">` (browser arrow keys). `aria-label` on the group.

Selection: `defaultValue` / controllable `value` + `onValueChange`. First selection: no “slide” class; later changes: `data-state` / class so CSS can animate. **Slider position is CSS-only** — no `getBoundingClientRect`. Theme uses `[data-index]` or `nth-child` / grid.

Disabled: radios `disabled`; optional `onDisabledClick` on the group if the product needs a tap target when disabled.

If Tabs are needed later: React Aria `useTabList` (roving tabindex + `aria-selected`).

---

## Input chrome states

When adding prefix / suffix / icon slots to inputs:

```
isEmpty    = value.length === 0 && !isFocused
```

| State | Attribute |
| --- | --- |
| empty | `data-empty` on root when `isEmpty` |
| error | `data-invalid` |
| prefixed | `data-prefixed` when prefix slot present |
| withRightIcon | `data-has-icon` |
| withSuffix | `data-has-suffix` |

Date-picker webkit hacks stay in **theme CSS** if ever needed, not in core JS.

---

## Compound Dialog slots (optional DX)

Marker children render `null`. Parse `React.Children.toArray(children)`:

1. Every direct child must be a known slot component (**reference equality** on `child.type`). Else throw: `Dialog direct children must be slot elements (Title, Body, Actions, …). Invalid at index {i}: {label}.`
2. Each slot at most once. Else throw: `Duplicate Dialog.{Name}. Each slot may appear at most once.`
3. Order of children does not affect layout. Render order: title → (optional image) → body → actions → footer.

**Content rules:**
- Title: `ReactNode`.
- Image (if added): only intrinsic `<img>`.
- Body / Footer: any `ReactNode`.
- Actions: props `primary` / `secondary` `{ text, onClick, … }`, not children.

`Object.assign(Dialog, { Title, Body, Actions, Footer, displayName: "Dialog" })`. Prop API (`title`, `actions`) remains; compound is additive.

---

## Slider a11y (only if a slider is added)

- Input: `role="slider"` `aria-valuemin/max/now` `aria-valuetext` (formatted, e.g. currency/time). `aria-label` only if no `<label htmlFor>`.
- Inc/dec buttons: `aria-label="Increase value"` / `"Decrease value"`.
- Value readout: `role="status"` `aria-live="polite"` `aria-atomic="true"`.
- Widget: `role="group"` `aria-labelledby`.
- Keys: Home/End → min/max (`preventDefault`). Discrete steps: Arrows ±1, PageUp/Down ±~10% of step count. Numeric step: PageUp/Down ±10% of range, minimum one `step`.

---

## Pagination window

`extractPages(currentPage /* 1-based */, totalPages): number[]`

```
limit = min(3, totalPages)
// For each index 0..limit-1:
if (currentPage + 1 === totalPages) raw = currentPage - index + 1
else if (currentPage > totalPages - 2) raw = currentPage - index
else raw = index + currentPage
return raw.sort((a,b) => a-b)
```

Examples (`totalPages=10`): page 1 → `[1,2,3]`; 5 → `[5,6,7]`; 8/9/10 → `[8,9,10]`. Guard `currentPage` in `1..totalPages`.

---

## Snackbar / toast

Do not implement in Proteus. `noti-diva` owns toasts.

If anything needs an auto-dismiss timer: `setTimeout(onClose, duration)` while open; clear on `isOpen`/`duration`/`onClose` change. Stories often use **3000 ms**; no unstyled default.

---

## Progress ARIA

If a determinate progress control is added: `role="progressbar"` plus `aria-valuemin={0}` `aria-valuemax={100}` (or steps length) `aria-valuenow` `aria-valuetext` optional `aria-label` `aria-live="polite"` `aria-atomic` when the value is announced.

Step tracker (if ever): `aria-valuemax={steps.length}` `aria-valuenow` `aria-valuetext`.

---

## Countdown timer hook (OTP resend / session)

```ts
useCountdownTimer({ duration: number /* ms */, interval: number, onComplete?: () => void })
// → { timeLeft: number, reset: () => void }
```

Tick: `timeLeft = max(0, prev - interval)`; at `<=0` call `onComplete` once and stop. `reset` / `duration` change → `timeLeft = duration`. If start is already 0, do not fire `onComplete`. Display helper: `Math.ceil(timeLeft/1000)` → `MM:SS` zero-padded.

Prefer a single interval and functional updates.

---

## Chip / toggle button

`role="button"` `tabIndex={disabled ? -1 : 0}` `aria-pressed={!!selected}` `aria-disabled={disabled}`. Parent owns `selected`. Activate on click and key `"Enter"` or `" "` (`preventDefault` on those keys). Not `"Spacebar"`.

---

## Type helpers (zero runtime)

```ts
export type ValueOf<T> = T[keyof T];
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type PrettifyUnion<T> = T extends any ? Prettify<T> : never;
export type PreciseRequire<O, K extends keyof O> = Required<Pick<O, K>> & Omit<O, K>;
export type Maybe<T> = T | undefined;
```

Add to `@proteus-ui/tokens` or core utils when branded unions get hard to hover.

---

## `useBindedActions` (optional)

```ts
function bindActions<A extends Record<string, (...args: never[]) => { type: string; payload?: unknown }>>(
  creators: A,
  dispatch: (action: ReturnType<A[keyof A]>) => void,
): { [K in keyof A]: (...args: Parameters<A[K]>) => void }
```

Only needed if a reducer + action-creator style is chosen. Most Proteus hooks can dispatch inline.

---

## Out of scope

Redux Form `input`/`meta`. `uuid` package for React ids. Tailwind Grid (`xs="w-full"`). App chrome (navbar, footer, header, language bar, promo). Domain widgets (loan calculator, legal table, privacy consent, currency banner). Snackbar (`noti-diva`). `NextLink` in core. Appearance token names (`pink-500`, `c24_n-50`) in the contract.
