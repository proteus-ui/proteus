# css-foundation harvest — implementable brief

- **Status:** Canonical. The source repo (`@ipf-ui/ds`, `/Users/tomasz.morawski/css-foundation`) is gone. Do not look for it.
- **Date:** 2026-08-30
- **Use:** Authoring Plan 2/3/stack implementation plans and expanding components. This file is the only required reference for those behaviors.
- **Parent spec:** `2026-08-29-proteus-component-library-design.md`

This is a **behavioral specification**, not a port. Implement in Proteus terms: slots + `data-*` + CSS variables + React Aria + `useId`. Never adopt nested Tailwind `classNames` / `stateModifier` maps or Redux Form `input`/`meta`.

**Source bugs to fix (do not reproduce):**
- Autocomplete used `uuid` for ids → use `useId`.
- Autocomplete `value` prop was mount-only (uncontrolled after mount) → Proteus uses `useControllableState`.
- Select compared options by `label` and used checkboxes → compare by `value`; listbox ARIA.
- Select/Tabset had almost no keyboard/ARIA → React Aria.
- Chips listened for `"Spacebar"` not `" "` → use `" "` and `"Enter"`.
- Declarative Modal did not forward `closeOnEsc`; overlay always closed (ignored `closeOnOverlayClick`) → honor both.
- `useModalTransition` overlay ref was never attached → 300 ms fallback always. Proteus already reads duration from the real element and uses **0** when there is no transition (keep that; do not add a 300 ms magic number).
- OTP had no group label / `aria-describedby` → add them.
- Accordion content stayed mounted with only `aria-hidden` → acceptable; also support `hidden`/`data-state` for CSS.

---

## 0. Inversion + already absorbed

**They:** branded wrapper injects Tailwind class maps into unstyled. **We:** core emits structure/state; theme styles it.

**Iteration-1 Dialog already has:** `useDialogTransition` + `getTransitionDurationMs` (sum longest duration + delay; **0 if none**), `usePreventScroll`, `ariaHideOutside`, `ariaLabel` / `ariaDescribedBy`, `FocusScope contain restoreFocus autoFocus`. Overlay close = `mousedown` and `event.target === event.currentTarget`.

**Modal stack** lives in the parent spec. Addenda from the source (honor these when implementing the stack):

| Topic | Required Proteus behavior |
| --- | --- |
| Overlay close | `mousedown` on overlay only (`target === currentTarget`); **respect `closeOnOverlayClick !== false`** on the **top** entry |
| Esc | document `keydown` while stack non-empty; top entry only; close if `closeOnEsc !== false`. **Declarative `behavior.closeOnEsc` must be passed into `modalConfig`** (source forgot this) |
| Z-index | `baseZIndex = 999`; entry `zIndex = 999 + index` |
| IDs | `useId` or `crypto.randomUUID()` — not a `uuid` package |
| Scroll lock | `usePreventScroll` while `stack.length > 0` (not raw `overflow: hidden`) |
| Overlay `aria-hidden` | `true` on backdrop |
| Transition | reuse `useDialogTransition`; attach the ref to the overlay/panel that has the CSS transition |

---

## 1. Combobox / Autocomplete → Plan 3 (`Select` evolution, `SearchBar`, `EntitySelector`)

Use this as the **behavior/a11y brief**. Implement with React Aria `useComboBox` / `useListBox` where it covers the same outcomes. The numbers below are the acceptance criteria.

### Types

```ts
type Suggestion = { value: string; label: string; data?: unknown };

// Proteus: controllable input
value?: string;
defaultValue?: string;
onValueChange?: (value: string) => void;
suggestions?: readonly Suggestion[];      // default []
isLoading?: boolean;                      // default false
disabled?: boolean;                       // default false
onlyDigits?: boolean;                     // default false — strip /\D+/g
placeholder?: string;
noResultsText?: string;                   // default "No results found"
minCharsToSearch?: number;                // default 2
invalid?: boolean;
errorMessage?: string;
hintMessage?: string;
onSuggestionSelect?: (s: Suggestion) => void;
onClear?: () => void;
```

Slots (typical): `root`, `input`, `label`, `list`, `option`, `clear`, `toggle`, `announcer`, `error`, `hint`. Icons are `children` / props, not Tailwind class maps.

### Internal flags (if not using React Aria’s equivalents)

| Flag | Meaning |
| --- | --- |
| `isOpen` | list intended open |
| `openedByToggle` | opened via chevron (allows showing list when query is shorter than `minCharsToSearch`, if there are results) |
| `isFocused` | input focused |
| `highlightedIndex` | keyboard active option; `-1` = none |

```
isEmpty        = value.length === 0 && !isFocused
showList       = isOpen && !isLoading && (value.length >= minCharsToSearch || (openedByToggle && suggestions.length > 0))
canOpen        = !isLoading && (value.length >= minCharsToSearch || suggestions.length > 0)
activeDescendantId = highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
```

Emit `data-empty`, `data-invalid`, `data-state="open|closed"` on the appropriate slots. `data-empty` ≡ `isEmpty`.

### Open / close / select

**Open:** typing (`isOpen=true`, `openedByToggle=false`, highlight `-1`); focus if `value.length >= minCharsToSearch`; toggle button; ArrowDown when closed and `canOpen` (if query short but has results → treat as toggle-open).

**Close:** select; clear; toggle while open; Escape; ArrowUp when `highlightedIndex < 0`; Tab (do **not** preventDefault); outside click (panel + toggler refs — §3).

**Blur does not close.** Outside click does.

**Select (click or Enter on highlighted):** set input to `suggestion.label`; `onSuggestionSelect(suggestion)`; close; refocus input. Option `onPointerDown` / `onMouseDown` → `preventDefault()` so the input does not blur first.

**Clear:** empty value; close; `onValueChange("")`; `onClear?.()`; refocus input. Show clear only when `value.length > 0 && !disabled`. Show toggle only when `!disabled && suggestions.length > 0` and a toggle icon exists. While `isLoading`, hide clear/toggle; show status “Loading suggestions”.

**Digit filter:** `onlyDigits ? value.replace(/\D+/g, "") : value` on every change. Input: `inputMode="numeric"` `pattern="[0-9]*"`.

Parent fetches suggestions from `onValueChange`. **No debounce/fetch inside the component.**

### Keyboard (`e.key` strings)

Navigation set: `ArrowDown`, `ArrowUp`, `Enter`, `Escape`, `Tab`. Ignore others.

| Key | preventDefault | Action |
| --- | --- | --- |
| ArrowDown | yes | If list hidden and `canOpen` → open; else `highlightedIndex = min(highlightedIndex+1, last)` |
| ArrowUp | yes | If `highlightedIndex < 0` → close; else decrement, floor `-1` |
| Enter | yes | If `highlightedIndex >= 0` and option exists → select; else no-op |
| Escape | yes | Close |
| Tab | **no** | Close; focus moves on |

After open/type/toggle: `highlightedIndex = -1`. ArrowDown at last item: stay. ArrowUp from `0` → `-1` (do not close). ArrowUp from `-1` → close.

### ARIA (acceptance)

| Node | Attributes |
| --- | --- |
| Input | `role="combobox"` `aria-expanded={showList}` `aria-haspopup="listbox"` `aria-autocomplete="list"` `aria-controls={listboxId}` (omit if closed) `aria-activedescendant` `aria-labelledby` `aria-invalid` `aria-describedby` (error and/or hint ids) `autoComplete="off"` |
| Label | real `<label htmlFor>` or `id` + `aria-labelledby` — prefer `<label>` |
| List | `role="listbox"` `id={listboxId}` `aria-label="Suggestions"` |
| Option | `role="option"` `id={`${listboxId}-option-${i}`}` `aria-selected={i === highlightedIndex}` |
| Visible no-results | when `showList && suggestions.length === 0 && value.length > 0`: `role="status"` + `noResultsText` |
| **Announcer (required)** | visually hidden: `role="status"` `aria-live="polite"` `aria-atomic="true"`. If `showList && suggestions.length > 0`: `` `${n} suggestion${n===1?"":"s"} available` ``. If `showList && suggestions.length===0 && value.length>0`: `noResultsText`. Else empty. |
| Loading | `role="status"` `aria-label="Loading suggestions"` |
| Clear | `type="button"` `aria-label="Clear search"` `tabIndex={-1}` |
| Toggle | `type="button"` `aria-label` Open/Close suggestions `aria-expanded` `tabIndex={-1}` `onPointerDown` preventDefault |
| Error | `role="alert"` + id |

### IDs

`useId()` for listbox, label, error, hint. Option ids derived from listbox id + index.

### Tests that must exist

Closed → no listbox. Type ≥ `minCharsToSearch` → list + announcer text. No results → announcer + visible status. ArrowDown/Enter selects. Escape closes. Outside click closes. Clear empties and refocuses. `onlyDigits` strips letters. Loading hides list. Disabled: no clear/toggle, input disabled.

---

## 2. Accordion → Plan 2 `CollapsibleSection`

### Item

```ts
type Item = { id: string; title: ReactNode; children: ReactNode; defaultOpen?: boolean };
type Mode = "single" | "multiple"; // default "single"
```

Controllable: `openIds?: string[]` + `onOpenChange?: (ids: string[]) => void`, or uncontrolled from `defaultOpen`.

### Reducers (source semantics — keep)

**single:** click id → if that item was open, close it; else open it and close all others. At most one open.

**multiple:** click id → toggle only that item.

When `items` identity/content changes: preserve `isOpen` for ids that still exist; new ids take `defaultOpen`.

### ARIA

| Node | Attributes |
| --- | --- |
| Trigger | `<button type="button">` `id={`accordion-trigger-${id}`}` `aria-expanded` `aria-controls={`accordion-panel-${id}`}` |
| Panel | `id={`accordion-panel-${id}`}` `role="region"` `aria-labelledby={`accordion-trigger-${id}`}` `data-state="open\|closed"`; hide from a11y when closed (`hidden` or `aria-hidden`) |

Native button handles Enter/Space. No arrow-key roving required (source had none; add later if needed). Chevron decorative: `aria-hidden`.

### Tests

Single: opening B closes A. Clicking open A closes A. Multiple: A and B can both be open. Closed panel not exposed (or `aria-hidden`). `aria-expanded` tracks state.

---

## 3. Overlay dismiss — extend `useCloseOnOutsideClick`

```ts
type AutoClose = "outside" | "inside" | true | false;

function useCloseOnOutsideClick(
  enabled: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  opts?: {
    togglerRef?: RefObject<HTMLElement | null>;
    mode?: AutoClose; // default "outside"
  },
): void;
```

Listeners: `document.addEventListener("click", handler, true)` (**capture**).

| mode | Close when |
| --- | --- |
| `"outside"` | target is outside **both** panel and toggler. Null toggler ⇒ treat as outside toggler |
| `"inside"` | target is inside panel |
| `true` | inside **or** outside (not on toggler — toggler click must not close-from-outside) |
| `false` | no listeners |

Why capture + toggler: otherwise opening a menu immediately “outside-clicks” itself, or the trigger click closes it.

Also keep a bubble-phase single-ref variant if existing tests depend on it; new overlays use this API.

**Select option:** `onPointerDown={(e) => e.preventDefault()}` on each option (stops blur-before-select).

---

## 4. OTP (only if a consumer appears)

```ts
otpLength?: number;          // default 6
disabled?: boolean;
shouldAutoFocus?: boolean;   // default true
invalid?: boolean;
errorMessage?: string;
onChange?: (value: string) => void;      // joined cells
onComplete?: (value: string) => void;    // all cells non-empty
onBlur?: () => void;                     // debounce setTimeout(0) so intra-group focus moves don't fire
onValidate?: (value: string, index?: number) => boolean;
```

Cells: `type="tel"` `inputMode="numeric"` `pattern="[0-9]*"` `maxLength={1}` `aria-invalid` when invalid.

**Sanitize on change:** if `value.length > 1`, keep last char; if non-empty and not `/^\d$/`, ignore.

**After valid digit:** write cell; `onChange(joined)`; if `onValidate(joined, index)===false` → error; if more cells, focus next (set a `shouldRedirectFocus=false` flag so the next cell’s `onFocus` does not bounce to “first empty”); if all filled → `onComplete`.

**Focus redirect:** unless the flag is false, focusing any cell jumps to first empty (or last if full). Then reset the flag.

**Backspace:** empty cell + index>0 → focus previous; else clear current, stay, `onChange`. **ArrowLeft/Right:** move focus, set redirect flag false. No preventDefault required.

**Paste:** `preventDefault`; digits = `clipboard.replace(/\D/g,"").slice(0, otpLength)`; fill from start; focus `min(digits.length, otpLength-1)`; validate without index; `onComplete` if full.

**Auto-focus:** if `shouldAutoFocus && !disabled`, focus first empty (or 0 if full). Resizing `otpLength` must resize **values** (source forgot — fix it).

**A11y Proteus must add:** group `role="group"` + `aria-label` / labelledby; error `aria-describedby` on the group.

**Tests:** type 6 digits → `onComplete`; paste `"12ab34"` into length 6 → `"1234"` + focus; Backspace on empty goes left; disabled skips autofocus.

---

## 5. Segmented Toggle (later; better Tabs seed than source Tabset)

`role="radiogroup"` + native `<input type="radio">` (browser arrow keys). `aria-label` on the group.

Selection: `defaultValue` / controllable `value` + `onValueChange`. First selection: no “slide” class; later changes: `data-state` / class so CSS can animate. **Slider position is CSS-only** — no `getBoundingClientRect`. Theme uses `[data-index]` or `nth-child` / grid.

Disabled: radios `disabled`; optional `onDisabledClick` on the group if the product needs a tap target when disabled.

**Do not copy source Tabset** (no roving tabindex, no `aria-selected`). If Tabs are needed: React Aria `useTabList`.

---

## 6. Input chrome states → `data-*`

Source derived classes from:

```
isEmpty    = value.length === 0 && !isFocused
isNonEmpty = !isEmpty          // ≡ length>0 || focused
isWithRightIcon = Boolean(passwordIcon || calendarIcon)
```

| Source class key | Proteus attribute |
| --- | --- |
| empty | `data-empty` on root when `isEmpty` |
| nonEmpty | omit `data-empty` (or `data-empty="false"` — prefer omit) |
| error | `data-invalid` (already in Task 5) |
| prefixed | `data-prefixed` when prefix slot present |
| withRightIcon | `data-has-icon` |
| withSuffix | `data-has-suffix` |

Date-picker webkit hacks stay in **theme CSS** if ever needed, not in core JS.

---

## 7. Compound Dialog slots (optional DX after prop API)

Marker children render `null`. Parse `React.Children.toArray(children)`:

1. Every direct child must be a known slot component (**reference equality** on `child.type`). Else throw: `Dialog direct children must be slot elements (Title, Body, Actions, …). Invalid at index {i}: {label}.`
2. Each slot at most once. Else throw: `Duplicate Dialog.{Name}. Each slot may appear at most once.`
3. Order of children does not affect layout. Render order: title → (optional image) → body → actions → footer.

**Content rules (source):**
- Title: only `string` \| `number` (Proteus: also any `ReactNode` is fine if we drop IntlMsg; if we keep a tight rule, document it).
- Image (if added): only intrinsic `<img>`.
- Body / Footer: any `ReactNode`.
- Actions: props `primary` / `secondary` `{ text, onClick, … }`, not children.

`Object.assign(Dialog, { Title, Body, Actions, Footer, displayName: "Dialog" })`. Prop API (`title`, `actions`) remains; compound is additive.

---

## 8. Slider a11y (only if a slider is added)

- Input: `role="slider"` `aria-valuemin/max/now` `aria-valuetext` (formatted, e.g. currency/time). `aria-label` only if no `<label htmlFor>`.
- Inc/dec buttons: `aria-label="Increase value"` / `"Decrease value"`.
- Value readout: `role="status"` `aria-live="polite"` `aria-atomic="true"`.
- Widget: `role="group"` `aria-labelledby`.
- Keys: Home/End → min/max (`preventDefault`). Discrete steps: Arrows ±1, PageUp/Down ±~10% of step count. Numeric step: PageUp/Down ±10% of range, minimum one `step`.

Do not port the Immer Cartesian product (standard×declarative×full×compact).

---

## 9. Pagination window

`extractPages(currentPage /* 1-based */, totalPages): number[]`

```
limit = min(3, totalPages)
// For each index 0..limit-1:
if (currentPage + 1 === totalPages) raw = currentPage - index + 1
else if (currentPage > totalPages - 2) raw = currentPage - index
else raw = index + currentPage
return raw.sort((a,b) => a-b)
```

Examples (`totalPages=10`): page 1 → `[1,2,3]`; 5 → `[5,6,7]`; 8/9/10 → `[8,9,10]`. Guard `currentPage` in `1..totalPages` (source could emit `4` when `totalPages=3`).

---

## 10. Snackbar / toast

**Do not implement in Proteus.** `noti-diva` owns toasts.

If anything needs an auto-dismiss timer: `setTimeout(onClose, duration)` while open; clear on `isOpen`/`duration`/`onClose` change. Source stories used **3000 ms**; no unstyled default.

---

## 11. Progress ARIA

Source `ProgressBar` only set `role="progressbar"` — **insufficient**. Proteus Spinner/progress must also set `aria-valuemin={0}` `aria-valuemax={100}` (or steps length) `aria-valuenow` `aria-valuetext` optional `aria-label` `aria-live="polite"` `aria-atomic` when the value is announced.

Step tracker (if ever): `aria-valuemax={steps.length}` `aria-valuenow` `aria-valuetext`.

---

## 12. Countdown timer hook (OTP resend / session)

```ts
useCountdownTimer({ duration: number /* ms */, interval: number, onComplete?: () => void })
// → { timeLeft: number, reset: () => void }
```

Tick: `timeLeft = max(0, prev - interval)`; at `<=0` call `onComplete` once and stop. `reset` / `duration` change → `timeLeft = duration`. If start is already 0, do not fire `onComplete`. Display helper: `Math.ceil(timeLeft/1000)` → `MM:SS` zero-padded.

Prefer a single interval and functional updates (source recreated the interval every tick — works, wasteful).

---

## 13. Chip / toggle button

`role="button"` `tabIndex={disabled ? -1 : 0}` `aria-pressed={!!selected}` `aria-disabled={disabled}`. Parent owns `selected`. Activate on click and key `"Enter"` or `" "` (`preventDefault` on those keys). **Not `"Spacebar"`.**

---

## 14. Shared keyboard constants

```ts
export const KEYBOARD_KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ENTER: "Enter",
  ESCAPE: "Escape",
  TAB: "Tab",
  BACKSPACE: "Backspace",
  SPACE: " ",
} as const;

export const NAVIGATION_KEYS = [
  KEYBOARD_KEYS.ARROW_DOWN,
  KEYBOARD_KEYS.ARROW_UP,
  KEYBOARD_KEYS.ENTER,
  KEYBOARD_KEYS.ESCAPE,
  KEYBOARD_KEYS.TAB,
] as const;
```

---

## 15. Type helpers (zero runtime)

```ts
export type ValueOf<T> = T[keyof T];
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type PrettifyUnion<T> = T extends any ? Prettify<T> : never;
export type PreciseRequire<O, K extends keyof O> = Required<Pick<O, K>> & Omit<O, K>;
export type Maybe<T> = T | undefined;
```

Add to `@proteus-ui/tokens` or core utils when branded unions get hard to hover.

---

## 16. `useBindedActions` (optional)

```ts
function bindActions<A extends Record<string, (...args: never[]) => { type: string; payload?: unknown }>>(
  creators: A,
  dispatch: (action: ReturnType<A[keyof A]>) => void,
): { [K in keyof A]: (...args: Parameters<A[K]>) => void }
```

Only needed if a reducer+action-creator style is chosen. Most Proteus hooks can dispatch inline.

---

## 17. Skip forever

Redux Form `input`/`meta`. `uuid` package for React ids. Tailwind Grid (`xs="w-full"`). Navbar, Footer, Header, LanguageBar, PromoBar, CTAText, Navlink chrome. LoanCalculator, LegalTable, PrivacyConsent, CurrencyBanner, InfoBox, IntegerButton, StepTracker-as-loan-flow. Snackbar (noti-diva). `NextLink` in core. Source Select / Tabset / full RangeSlider as architecture to clone. Appearance token names (`pink-500`, `c24_n-50`) in the contract.

---

## 18. How a later plan should use this file

1. Open the parent design spec for contract, tokens, a11y strategy, methodology.
2. Open **this** file for the component’s section; treat tables as acceptance tests.
3. Implement with TDD against those tests. Prefer React Aria when it satisfies the same ARIA/keyboard table.
4. Do not reopen css-foundation. If something is not here, it was intentionally dropped.
