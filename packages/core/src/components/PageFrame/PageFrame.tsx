import { createContext, forwardRef, useContext } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { collectNamedSlots } from "../../utils/compound";
import { PAGE_FRAME_CLASS, PAGE_FRAME_DISPLAY_NAME } from "./consts";
import type {
  PageFrameFooterProps,
  PageFrameHeaderProps,
  PageFrameMainProps,
  PageFrameProps,
  PageFrameSlot,
} from "./types";

const PageFrameClassNamesContext = createContext<SlotClassNames<PageFrameSlot> | undefined>(
  undefined,
);

export const PageFrameHeader = forwardRef<HTMLElement, PageFrameHeaderProps>(
  function PageFrameHeader({ className, children, ...rest }, ref) {
    const classNames = useContext(PageFrameClassNamesContext);
    return (
      <header
        ref={ref}
        className={cn(PAGE_FRAME_CLASS.header, classNames?.header, className)}
        {...rest}
      >
        {children}
      </header>
    );
  },
);
PageFrameHeader.displayName = PAGE_FRAME_DISPLAY_NAME.Header;

export const PageFrameMain = forwardRef<HTMLElement, PageFrameMainProps>(function PageFrameMain(
  { className, children, ...rest },
  ref,
) {
  const classNames = useContext(PageFrameClassNamesContext);
  return (
    <main ref={ref} className={cn(PAGE_FRAME_CLASS.main, classNames?.main, className)} {...rest}>
      {children}
    </main>
  );
});
PageFrameMain.displayName = PAGE_FRAME_DISPLAY_NAME.Main;

export const PageFrameFooter = forwardRef<HTMLElement, PageFrameFooterProps>(
  function PageFrameFooter({ className, children, ...rest }, ref) {
    const classNames = useContext(PageFrameClassNamesContext);
    return (
      <footer
        ref={ref}
        className={cn(PAGE_FRAME_CLASS.footer, classNames?.footer, className)}
        {...rest}
      >
        {children}
      </footer>
    );
  },
);
PageFrameFooter.displayName = PAGE_FRAME_DISPLAY_NAME.Footer;

const PageFrameRoot = forwardRef<HTMLDivElement, PageFrameProps>(function PageFrame(
  { classNames, className, children, ...rest },
  ref,
) {
  const slots = collectNamedSlots(
    children,
    { Header: PageFrameHeader, Main: PageFrameMain, Footer: PageFrameFooter },
    PAGE_FRAME_DISPLAY_NAME.Root,
  );
  return (
    <PageFrameClassNamesContext.Provider value={classNames}>
      <div ref={ref} className={cn(PAGE_FRAME_CLASS.root, classNames?.root, className)} {...rest}>
        {slots.Header}
        {slots.Main}
        {slots.Footer}
      </div>
    </PageFrameClassNamesContext.Provider>
  );
});
PageFrameRoot.displayName = PAGE_FRAME_DISPLAY_NAME.Root;

export const PageFrame = Object.assign(PageFrameRoot, {
  Header: PageFrameHeader,
  Main: PageFrameMain,
  Footer: PageFrameFooter,
});
