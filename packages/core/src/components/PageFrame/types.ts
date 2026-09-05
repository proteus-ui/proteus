import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type { PageFrameFooter, PageFrameHeader, PageFrameMain } from "./PageFrame";

export type PageFrameSlot = "root" | "header" | "main" | "footer";

export type PageFrameHeaderProps = HTMLAttributes<HTMLElement>;
export type PageFrameMainProps = HTMLAttributes<HTMLElement>;
export type PageFrameFooterProps = HTMLAttributes<HTMLElement>;

export type PageFrameSlotChild =
  | SlotElement<typeof PageFrameHeader>
  | SlotElement<typeof PageFrameMain>
  | SlotElement<typeof PageFrameFooter>;

export interface PageFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  classNames?: SlotClassNames<PageFrameSlot>;
  children?: CompoundChildren<PageFrameSlotChild>;
}
