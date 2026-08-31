# Behavior-Heavy Inputs Implementation Plan

> **Status:** Only remaining implementation plan. Foundation, remaining primitives, and Storybook are shipped on `main`. `-like` themes / `createTheme` / modal stack stay on the [design spec roadmap](../specs/2026-08-29-proteus-component-library-design.md#roadmap-post-iteration-1) — no plan file until picked up.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship combobox/`Select`, `NumberStepper`, `TimeInput`, `OtpInput`, `Tooltip`, and `EntitySelector`, and extend `useCloseOnOutsideClick` to harvest §3.

**Architecture:** Headless `pr-` + `data-*` in `@proteus-ui/core`. Combobox is a custom implementation that matches harvest §1 tables exactly (React Aria `useComboBox` is allowed only if every listed ARIA/keyboard row still holds). Overlay dismiss uses capture-phase `click` + `togglerRef`. Tooltip uses `@floating-ui/react` for position and `@react-aria/tooltip` for hover/focus/delay. No fetch/debounce inside combobox.

**Tech Stack:** TypeScript strict, React peer `^18 || ^19`, Vitest + Testing Library + user-event, `@floating-ui/react`, `@react-aria/tooltip`, existing `@react-aria/focus` / `@react-aria/overlays`.

## Global Constraints

- Harvest is the only behavior spec: `docs/superpowers/specs/2026-08-29-css-foundation-harvest.md`. Do not look for css-foundation.
- npm scope `@proteus-ui/*`. React peer only. Zero style runtime. Local `cn()`. No `tailwind-merge`.
- Theme CSS: `pr-` prefix, single-class + `data-*`, no nesting, no `!important`.
- Slot names / `data-*` / `--pr-*` are SemVer surface. Prefer existing tokens.
- Do not change Button / TextInput / SearchBar / Dialog public APIs.
- Combobox: **blur does not close**; outside click does. Parent fetches suggestions. **No debounce inside the component.**
- Do not reproduce harvest “source bugs” (uuid ids, mount-only value, compare options by label, `"Spacebar"`, 300 ms magic transition).
- Do not stage `docs/notes/` or `.superpowers/`. Do not set `AI_REVIEW=0`.
- Trademark: never name a theme or package “Material” / “MUI” / “Ant” without `-like` (this plan does not add themes).

---

## File Structure

```
packages/core/src/
  utils/keyboard.ts
  hooks/useCloseOnOutsideClick.ts          # extend
  hooks/useCloseOnOutsideClick.test.ts
  components/Combobox.tsx
  components/Combobox.test.tsx
  components/Select.tsx                    # thin Combobox wrapper
  components/NumberStepper.tsx
  components/TimeInput.tsx
  components/OtpInput.tsx
  components/Tooltip.tsx
  components/EntitySelector.tsx
  index.ts
packages/core/package.json                 # + @floating-ui/react, @react-aria/tooltip
packages/theme-default/src/theme.css
apps/storybook/src/*.stories.tsx
```

---

### Task 1: `KEYBOARD_KEYS` + extend `useCloseOnOutsideClick`

**Files:**
- Create: `packages/core/src/utils/keyboard.ts`, `packages/core/src/hooks/useCloseOnOutsideClick.test.ts`
- Modify: `packages/core/src/hooks/useCloseOnOutsideClick.ts`, `packages/core/src/index.ts`, `packages/core/src/hooks/useModalCloseHandlers.test.ts`

**Interfaces:**

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

export type AutoClose = "outside" | "inside" | true | false;

export function useCloseOnOutsideClick(
  enabled: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  opts?: { togglerRef?: RefObject<HTMLElement | null>; mode?: AutoClose },
): void;
```

Listeners: `document.addEventListener("click", handler, true)` (capture). Default `mode` is `"outside"`.

| mode | Close when |
| --- | --- |
| `"outside"` | target is outside **both** panel and toggler. Null toggler ⇒ treat as outside toggler |
| `"inside"` | target is inside panel |
| `true` | inside **or** outside, but **not** on toggler |
| `false` | no listeners |

- [ ] **Step 1: Write the failing hook test**

Create `packages/core/src/hooks/useCloseOnOutsideClick.test.ts`:

```tsx
import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

function Probe({
  mode,
  onClose,
}: {
  mode?: "outside" | "inside" | true | false;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);
  useCloseOnOutsideClick(true, panelRef, onClose, { togglerRef, mode });
  return (
    <div>
      <button ref={togglerRef} type="button">
        Toggle
      </button>
      <div ref={panelRef}>Panel</div>
      <button type="button">Outside</button>
    </div>
  );
}

describe("useCloseOnOutsideClick", () => {
  it("outside: closes on outside click, not on panel or toggler", async () => {
    const onClose = vi.fn();
    render(<Probe mode="outside" onClose={onClose} />);
    await userEvent.click(screen.getByText("Panel"));
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("inside: closes only on panel click", async () => {
    const onClose = vi.fn();
    render(<Probe mode="inside" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Panel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("true: closes on inside or outside, not on toggler", async () => {
    const onClose = vi.fn();
    render(<Probe mode={true} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Panel"));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("false: never attaches", async () => {
    const onClose = vi.fn();
    render(<Probe mode={false} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd /Users/tomasz.morawski/proteus && pnpm test packages/core/src/hooks/useCloseOnOutsideClick.test.ts`

Expected: FAIL — current hook uses bubble `mousedown` and ignores `opts`.

- [ ] **Step 3: Implement**

Replace `packages/core/src/hooks/useCloseOnOutsideClick.ts` with:

```ts
import { useEffect, type RefObject } from "react";

export type AutoClose = "outside" | "inside" | true | false;

export function useCloseOnOutsideClick(
  enabled: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  opts?: {
    togglerRef?: RefObject<HTMLElement | null>;
    mode?: AutoClose;
  },
): void {
  const mode = opts?.mode ?? "outside";
  const togglerRef = opts?.togglerRef;

  useEffect(() => {
    if (!enabled || mode === false) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const panel = panelRef.current;
      const toggler = togglerRef?.current ?? null;
      const inPanel = Boolean(panel?.contains(target));
      const inToggler = Boolean(toggler?.contains(target));

      let shouldClose = false;
      if (mode === "outside") shouldClose = !inPanel && !inToggler;
      else if (mode === "inside") shouldClose = inPanel;
      else if (mode === true) shouldClose = !inToggler;
      if (shouldClose) onClose();
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [enabled, panelRef, onClose, mode, togglerRef]);
}
```

Create `packages/core/src/utils/keyboard.ts` with the exact `KEYBOARD_KEYS` / `NAVIGATION_KEYS` objects from harvest §14.

Export `KEYBOARD_KEYS`, `NAVIGATION_KEYS`, and `AutoClose` from `packages/core/src/index.ts`.

In `useModalCloseHandlers.test.ts`, change `fireEvent.mouseDown(outside)` to `fireEvent.click(outside)` (both cases). The composed hook now listens for capture-phase `click`, not bubble `mousedown`.

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test packages/core/src/hooks/useCloseOnOutsideClick.test.ts packages/core/src/hooks/useModalCloseHandlers.test.ts`

Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/hooks/useCloseOnOutsideClick.ts packages/core/src/hooks/useCloseOnOutsideClick.test.ts packages/core/src/hooks/useModalCloseHandlers.test.ts packages/core/src/utils/keyboard.ts packages/core/src/index.ts
git commit -m "feat(core): capture-phase outside-click with toggler modes"
```

---

### Task 2: `Combobox` (harvest §1)

**Files:**
- Create: `packages/core/src/components/Combobox.tsx`, `packages/core/src/components/Combobox.test.tsx`
- Modify: `packages/core/src/index.ts`, `packages/core/src/styles.css` (WebKit search-cancel already exists; add nothing unless needed)

**Interfaces:**

```ts
export type Suggestion = { value: string; label: string; data?: unknown };
export type ComboboxSlot =
  | "root" | "input" | "label" | "list" | "option" | "clear" | "toggle" | "announcer" | "error" | "hint";

export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  suggestions?: readonly Suggestion[];
  isLoading?: boolean;
  disabled?: boolean;
  onlyDigits?: boolean;
  placeholder?: string;
  noResultsText?: string;
  minCharsToSearch?: number;
  invalid?: boolean;
  errorMessage?: string;
  hintMessage?: string;
  label?: string;
  onSuggestionSelect?: (s: Suggestion) => void;
  onClear?: () => void;
  classNames?: SlotClassNames<ComboboxSlot>;
  toggleIcon?: ReactNode;
}
```

Root class `pr-combobox`. Input `pr-combobox__field`. List `pr-combobox__list`. Option `pr-combobox__option`. Clear `pr-combobox__clear`. Toggle `pr-combobox__toggle`. Announcer visually hidden (`pr-combobox__announcer`). Compare options by **`value`**, never by label.

Internal flags and derived values — copy harvest §1 (`isOpen`, `openedByToggle`, `isFocused`, `highlightedIndex`, `showList`, `canOpen`, `isEmpty`, `activeDescendantId`).

`useId()` for listbox, label, error, hint. Option ids: `${listboxId}-option-${i}`.

Use `useControllableState` for the input string (`defaultValue` default `""`). Use the extended `useCloseOnOutsideClick(showList || isOpen, rootRef, close, { togglerRef, mode: "outside" })`. `rootRef` is the Combobox root (input + clear + toggle + list). Do **not** pass the listbox alone as `panelRef` — clicks on the input or clear would then count as outside and close the list.

Select: set input to `suggestion.label`; `onSuggestionSelect`; close; refocus input. Option `onPointerDown` → `preventDefault()`.

Clear: empty; close; `onValueChange("")`; `onClear?.()`; refocus. Show clear only when `value.length > 0 && !disabled && !isLoading`. Show toggle only when `!disabled && !isLoading && suggestions.length > 0 && toggleIcon`.

`onlyDigits`: strip `/\D+/g` on every change; input `inputMode="numeric"` `pattern="[0-9]*"`.

Keyboard table from harvest §1 — use `KEYBOARD_KEYS`. After open/type/toggle: `highlightedIndex = -1`.

- [ ] **Step 1: Write the failing tests**

Create `packages/core/src/components/Combobox.test.tsx` covering every harvest §1 “Tests that must exist” row:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "../index";

const suggestions = [
  { value: "1", label: "Ada" },
  { value: "2", label: "Alan" },
];

describe("Combobox", () => {
  it("closed: no listbox", () => {
    render(<Combobox suggestions={suggestions} />);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("type >= minCharsToSearch shows list and announcer", async () => {
    render(<Combobox suggestions={suggestions} minCharsToSearch={2} />);
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent("2 suggestions available");
  });

  it("no results: announcer + visible status", async () => {
    render(<Combobox suggestions={[]} noResultsText="None" />);
    await userEvent.type(screen.getByRole("combobox"), "zz");
    expect(screen.getAllByRole("status").some((el) => el.textContent === "None")).toBe(true);
  });

  it("ArrowDown then Enter selects", async () => {
    const onSelect = vi.fn();
    render(<Combobox suggestions={suggestions} onSuggestionSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Ad");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith(suggestions[0]);
    expect(input).toHaveValue("Ada");
  });

  it("Escape closes", async () => {
    render(<Combobox suggestions={suggestions} />);
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("outside click closes", async () => {
    render(
      <>
        <Combobox suggestions={suggestions} />
        <button type="button">Away</button>
      </>,
    );
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    await userEvent.click(screen.getByRole("button", { name: "Away" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("clear empties and refocuses", async () => {
    render(<Combobox defaultValue="Ada" suggestions={suggestions} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("onlyDigits strips letters", async () => {
    render(<Combobox onlyDigits />);
    await userEvent.type(screen.getByRole("combobox"), "12ab3");
    expect(screen.getByRole("combobox")).toHaveValue("123");
  });

  it("loading hides list", async () => {
    render(<Combobox isLoading suggestions={suggestions} defaultValue="Ad" />);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("status", { name: "Loading suggestions" })).toBeInTheDocument();
  });

  it("disabled: no clear/toggle, input disabled", () => {
    render(
      <Combobox disabled defaultValue="x" suggestions={suggestions} toggleIcon={<span>v</span>} />,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    expect(screen.queryByRole("button", { name: /suggestions/ })).toBeNull();
  });

  it("blur does not close", async () => {
    render(<Combobox suggestions={suggestions} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Ad");
    input.blur();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});
```

Announcer query: if `name: ""` is flaky, query `.pr-combobox__announcer` by class / `aria-live="polite"`.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test packages/core/src/components/Combobox.test.tsx`

Expected: FAIL — not exported.

- [ ] **Step 3: Implement `Combobox.tsx`**

Implement the full harvest §1 machine in one file. Required markup/ARIA (copy the harvest table):

- Input: `role="combobox"` `aria-expanded={showList}` `aria-haspopup="listbox"` `aria-autocomplete="list"` `aria-controls` only when open `aria-activedescendant` `autoComplete="off"` `aria-invalid` `aria-describedby`
- Prefer `<label htmlFor>`
- List: `role="listbox"` `aria-label="Suggestions"`
- Option: `role="option"` `id={`${listboxId}-option-${i}`}` `aria-selected={i === highlightedIndex}` `data-highlighted` when selected-by-keyboard
- Announcer: visually hidden `role="status"` `aria-live="polite"` `aria-atomic="true"`
- Clear: `type="button"` `aria-label="Clear search"` `tabIndex={-1}`
- Toggle: `type="button"` `aria-label` `"Open suggestions"` / `"Close suggestions"` `aria-expanded` `tabIndex={-1}` `onPointerDown` preventDefault
- Error: `role="alert"`
- Root: `data-empty` when `isEmpty`, `data-invalid` when invalid, `data-state="open"|"closed"` from `showList`, `data-disabled` when disabled

Keyboard handler: ignore keys not in `NAVIGATION_KEYS`. `preventDefault` on ArrowDown/Up/Enter/Escape; **not** on Tab.

Root + list + input refs: Combobox root `ref` is `panelRef` (covers input, clear, toggle, and list); toggle button is also `togglerRef`.

Do **not** add debounce or fetch.

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test packages/core/src/components/Combobox.test.tsx`

Expected: PASS — all harvest rows. Fix announcer queries if needed; do not weaken keyboard/outside-click assertions.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/Combobox.tsx packages/core/src/components/Combobox.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add harvest-faithful Combobox"
```

---

### Task 3: `Select` (Combobox wrapper, not css-foundation Select)

**Files:**
- Create: `packages/core/src/components/Select.tsx`, `packages/core/src/components/Select.test.tsx`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- `SelectOption = { value: string; label: string }`
- `SelectProps`: `{ options: readonly SelectOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; disabled?: boolean; invalid?: boolean; label?: string; placeholder?: string; classNames?: ComboboxProps["classNames"] }`
- Compare options by **`value`** (id), never by label. `value` / `defaultValue` / `onValueChange` are option **ids** (`"de"`), not the visible string.
- Map the selected id → `label` for the Combobox field. On `onSuggestionSelect`, call `onValueChange(suggestion.value)` and show `suggestion.label`.
- Do **not** pass `value` / `defaultValue` / `onValueChange` through to Combobox as-is (Combobox’s string is the input label).
- Keep a **required** local `query` string for the Combobox field:
  - After select / when not typing: `query` = selected option’s `label` (from `selectedId`).
  - While the input is focused and the user types: Combobox `value` / `onValueChange` update `query` only; do **not** write the typed string into `selectedId` until a suggestion is chosen.
  - When a **controlled** `value` id changes and the field is **not** being typed, set `query` to that option’s `label` (or `""` if no match).
  - On `onSuggestionSelect`: set `selectedId` to `suggestion.value`, set `query` to `suggestion.label`, fire `onValueChange(suggestion.value)`.
- Always pass `options` as `suggestions`. `minCharsToSearch={0}`. Always pass a `toggleIcon` (chevron `▾`). Input is writable (filter) — this is a combobox-select, not a native `<select>`.

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../index";

const options = [
  { value: "pl", label: "Poland" },
  { value: "de", label: "Germany" },
];

describe("Select", () => {
  it("opens via toggle and selects by option value", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} onValueChange={onValueChange} label="Country" />);
    await userEvent.click(screen.getByRole("button", { name: "Open suggestions" }));
    await userEvent.click(screen.getByRole("option", { name: "Germany" }));
    expect(onValueChange).toHaveBeenCalledWith("de");
    expect(screen.getByRole("combobox")).toHaveValue("Germany");
  });

  it("types a filter without changing the selected option id", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} defaultValue="pl" onValueChange={onValueChange} label="Country" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("Poland");
    await userEvent.clear(input);
    await userEvent.type(input, "Ger");
    expect(input).toHaveValue("Ger");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("option", { name: "Germany" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2–4:** FAIL → implement the id↔label map above → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/Select.tsx packages/core/src/components/Select.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add Select as Combobox wrapper"
```

---

### Task 4: `NumberStepper`

**Files:**
- Create: `packages/core/src/components/NumberStepper.tsx`, `packages/core/src/components/NumberStepper.test.tsx`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Slots: `root` | `input` | `inc` | `dec`
- Props: `{ value?: number; defaultValue?: number; onValueChange?: (n: number) => void; min?: number; max?: number; step?: number; disabled?: boolean; invalid?: boolean; label?: string; classNames?: SlotClassNames<NumberStepperSlot> }`
- Defaults: `defaultValue=0`, `step=1`. Clamp to `min`/`max` when provided.
- Root: `div.pr-stepper` `role="group"` `data-invalid` `data-disabled`
- Input: `type="text"` `inputMode="numeric"` `aria-valuemin/max/now` `role="spinbutton"`
- Buttons: `aria-label="Decrease value"` / `"Increase value"` `type="button"`
- Keys (harvest §8 subset): ArrowUp/Down ± step (`preventDefault`); Home/End → min/max when defined (`preventDefault`).
- Readout not required (spinbutton carries the value).

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberStepper } from "../index";

describe("NumberStepper", () => {
  it("inc/dec clamp and keyboard steps", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={1} min={0} max={3} step={1} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    const input = screen.getByRole("spinbutton");
    input.focus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });
});
```

- [ ] **Step 2–4:** FAIL → implement with `useControllableState<number>` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/NumberStepper.tsx packages/core/src/components/NumberStepper.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add NumberStepper"
```

---

### Task 5: `TimeInput`

**Files:**
- Create: `packages/core/src/components/TimeInput.tsx`, `packages/core/src/components/TimeInput.test.tsx`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Slots: `root` | `input` | `error`
- Props: `{ value?: string; defaultValue?: string; onValueChange?: (v: string) => void; disabled?: boolean; invalid?: boolean; errorMessage?: string; label?: string; classNames?: SlotClassNames<TimeInputSlot> }`
- Store a committed `HH:MM` 24h value (`value` / `defaultValue` / `onValueChange`). Keep a **local draft** for the input while typing; do not write invalid keystrokes into the committed value.
- On blur: if the draft matches `/^([01]\d|2[0-3]):[0-5]\d$/`, commit it (`onValueChange`); else revert the field to the last committed value (or `""`).
- When a controlled `value` changes and the field is not focused, set the draft to that `value`.
- Input: `inputMode="numeric"` `placeholder="HH:MM"` `autoComplete="off"`
- Root `pr-time` `data-invalid` `data-disabled` `data-empty` when empty and not focused (harvest §6).

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TimeInput } from "../index";

describe("TimeInput", () => {
  it("keeps valid HH:MM and reverts invalid on blur", async () => {
    render(<TimeInput defaultValue="09:30" />);
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "25:99");
    await userEvent.tab();
    expect(input).toHaveValue("09:30");
    await userEvent.clear(input);
    await userEvent.type(input, "18:05");
    await userEvent.tab();
    expect(input).toHaveValue("18:05");
  });
});
```

- [ ] **Step 2–4:** FAIL → implement → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/TimeInput.tsx packages/core/src/components/TimeInput.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add TimeInput"
```

---

### Task 6: `OtpInput` (harvest §4)

**Files:**
- Create: `packages/core/src/components/OtpInput.tsx`, `packages/core/src/components/OtpInput.test.tsx`
- Modify: `packages/core/src/index.ts`

**Interfaces:** Copy harvest §4. Defaults: `otpLength=6`, `shouldAutoFocus=true`. Cells: `type="tel"` `inputMode="numeric"` `pattern="[0-9]*"` `maxLength={1}`. Group: `role="group"` + `aria-label` (prop `ariaLabel` default `"One-time code"`) + `aria-describedby` when `errorMessage`. **Per-cell type:** if the change is longer than 1 character, keep the last digit only; ignore non-digits. **Paste (harvest §4):** `preventDefault`; `digits = clipboard.replace(/\D/g, "").slice(0, otpLength)`; fill from the start; focus `min(digits.length, otpLength - 1)`; do **not** apply the per-cell “last char” rule to paste (e.g. `"12ab34"` → `"1234"`). Resize `otpLength` **must** resize the values array. IDs via `useId()`.

- [ ] **Step 1: Write failing tests** (harvest §4 “Tests”)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OtpInput } from "../index";

describe("OtpInput", () => {
  it("types 6 digits and fires onComplete", async () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    const cells = screen.getAllByRole("textbox");
    expect(cells).toHaveLength(6);
    await userEvent.type(cells[0], "123456");
    expect(onComplete).toHaveBeenCalledWith("123456");
  });

  it("paste 12ab34 into length 6 keeps digits and focuses", async () => {
    render(<OtpInput />);
    const cells = screen.getAllByRole("textbox");
    cells[0].focus();
    await userEvent.paste("12ab34");
    expect(cells.map((c) => (c as HTMLInputElement).value).join("")).toBe("1234");
  });

  it("Backspace on empty moves left", async () => {
    render(<OtpInput defaultValue="12" />);
    const cells = screen.getAllByRole("textbox");
    cells[2].focus();
    await userEvent.keyboard("{Backspace}");
    expect(cells[1]).toHaveFocus();
  });

  it("disabled skips autofocus", () => {
    render(<OtpInput disabled />);
    expect(screen.getAllByRole("textbox")[0]).not.toHaveFocus();
  });
});
```

If `defaultValue` is not in harvest, implement `defaultValue?: string` (joined cells) plus controllable `value` / `onChange` as specified.

- [ ] **Step 2–4:** FAIL → implement harvest §4 exactly (redirect flag, paste preventDefault, `onValidate`) → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/OtpInput.tsx packages/core/src/components/OtpInput.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add OtpInput"
```

---

### Task 7: `Tooltip`

**Files:**
- Create: `packages/core/src/components/Tooltip.tsx`, `packages/core/src/components/Tooltip.test.tsx`
- Modify: `packages/core/package.json` (add deps), `packages/core/src/index.ts`

**Interfaces:**
- Add deps (exact ranges already in lockfile style): `@floating-ui/react` and `@react-aria/tooltip` as **regular** dependencies of `@proteus-ui/core` (same as other `@react-aria/*`).
- Props: `{ content: ReactNode; children: ReactElement; placement?: "top" | "bottom" | "left" | "right"; delay?: number; classNames?: SlotClassNames<"root"> }`
- Trigger is the single child (clone with refs + aria). Tooltip surface: `role="tooltip"` `class="pr-tooltip"` `data-placement`.
- Use Floating UI `useFloating` + `offset(8)` + `flip` + `shift`. Use React Aria `useTooltipTrigger` / `useTooltip` for open/close. Controlled open is not required.
- Do not portal unless tests need it; default in-place is fine.

- [ ] **Step 1: Add deps, write failing test**

Run: `cd /Users/tomasz.morawski/proteus && pnpm --filter @proteus-ui/core add @floating-ui/react @react-aria/tooltip`

Test:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tooltip } from "../index";

describe("Tooltip", () => {
  it("shows role=tooltip on hover", async () => {
    render(
      <Tooltip content="Hint" delay={0}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    await userEvent.hover(screen.getByRole("button", { name: "Target" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Hint");
    expect(screen.getByRole("tooltip")).toHaveClass("pr-tooltip");
  });
});
```

- [ ] **Step 2:** `pnpm test packages/core/src/components/Tooltip.test.tsx` — FAIL.

- [ ] **Step 3:** Implement. If hover is flaky under user-event, also open on focus and assert via `userEvent.tab()`. Keep `role="tooltip"` and `pr-tooltip`.

- [ ] **Step 4:** PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/package.json pnpm-lock.yaml packages/core/src/components/Tooltip.tsx packages/core/src/components/Tooltip.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add Tooltip with Floating UI"
```

---

### Task 8: `EntitySelector` (harvest §1)

**Files:**
- Create: `packages/core/src/components/EntitySelector.tsx`, `packages/core/src/components/EntitySelector.test.tsx`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Same suggestion model. Props: `ComboboxProps` plus `onEntitySelect?: (s: Suggestion) => void` (alias of `onSuggestionSelect`) and required `label`.
- Root class `pr-entity-select` (wrap Combobox `classNames.root` merge). Do not reimplement the state machine — render `Combobox`.

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EntitySelector } from "../index";

describe("EntitySelector", () => {
  it("selects a suggestion and reports the entity", async () => {
    const onEntitySelect = vi.fn();
    render(
      <EntitySelector
        label="User"
        suggestions={[{ value: "u1", label: "Ada", data: { id: "u1" } }]}
        onEntitySelect={onEntitySelect}
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    await userEvent.click(screen.getByRole("option", { name: "Ada" }));
    expect(onEntitySelect).toHaveBeenCalledWith({ value: "u1", label: "Ada", data: { id: "u1" } });
  });
});
```

- [ ] **Step 2–4:** FAIL → thin wrapper → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/EntitySelector.tsx packages/core/src/components/EntitySelector.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add EntitySelector"
```

---

### Task 9: `theme-default` skins

**Files:**
- Modify: `packages/theme-default/src/theme.css`, `packages/theme-default/src/theme.test.ts`

**Interfaces:** Skins for `.pr-combobox` (+ `__field` `__list` `__option` `[data-highlighted]` `[data-state]` `[data-invalid]` `[data-empty]`), `.pr-stepper`, `.pr-time`, `.pr-otp` (group + cells), `.pr-tooltip`, `.pr-entity-select`. Existing tokens only. Visually hide announcer with `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)` on `.pr-combobox__announcer` — single class, no nesting.

- [ ] **Step 1:** Extend theme test `toContain` for `.pr-combobox`, `.pr-stepper`, `.pr-time`, `.pr-otp`, `.pr-tooltip`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Append CSS.
- [ ] **Step 4:** PASS (`!important` still forbidden).
- [ ] **Step 5: Commit**

```bash
git add packages/theme-default/src/theme.css packages/theme-default/src/theme.test.ts
git commit -m "feat(theme-default): skin behavior-heavy inputs"
```

---

### Task 10: Storybook stories

**Files:**
- Create: `apps/storybook/src/Combobox.stories.tsx`, `Select.stories.tsx`, `NumberStepper.stories.tsx`, `TimeInput.stories.tsx`, `OtpInput.stories.tsx`, `Tooltip.stories.tsx`, `EntitySelector.stories.tsx`

**Interfaces:** CSF3. Combobox/EntitySelector: static `suggestions` in `args` (no fetch). Named stories: Default, Open/Loading/Invalid where useful. Tooltip: button child + `delay: 0`.

- [ ] **Step 1:** Add the seven story files.
- [ ] **Step 2:** `pnpm build-storybook` — PASS.
- [ ] **Step 3: Commit**

```bash
git add apps/storybook/src/*.stories.tsx
git commit -m "feat(storybook): add behavior-heavy input stories"
```

---

### Task 11: Full suite gate

- [ ] **Step 1:** `pnpm test` — green.
- [ ] **Step 2:** `pnpm typecheck` — exit 0.
- [ ] **Step 3:** `pnpm --filter @proteus-ui/core build` — exit 0.

---

## Self-Review

**Spec coverage:** Harvest §1 (Combobox + tests), §3 (hook), §4 (OTP), §6 (`data-empty` on TimeInput), §8 (stepper keys), §14 (keyboard constants). Select is a wrapper, not css-foundation Select. EntitySelector reuses Combobox. Tooltip uses Floating UI + React Aria.

**Placeholder scan:** Combobox implementation is specified by harvest tables + required markup; implementers write the TSX to those tables. NumberStepper/TimeInput/Otp/Tooltip have complete tests and signatures.

**Type consistency:** `Suggestion` shared; `useControllableState`; `SlotClassNames`; `KEYBOARD_KEYS` used by Combobox and NumberStepper.
