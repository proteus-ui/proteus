import { createContext, forwardRef, useContext } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { asSlot, collectNamedSlots } from "../../utils/compound";
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

export const PageFrameHeader = asSlot(
  PAGE_FRAME_DISPLAY_NAME.Header,
  forwardRef<HTMLElement, PageFrameHeaderProps>(function PageFrameHeader(
    { className, children, ...rest },
    ref,
  ) {
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
  }),
);

export const PageFrameMain = asSlot(
  PAGE_FRAME_DISPLAY_NAME.Main,
  forwardRef<HTMLElement, PageFrameMainProps>(function PageFrameMain(
    { className, children, ...rest },
    ref,
  ) {
    const classNames = useContext(PageFrameClassNamesContext);
    return (
      <main ref={ref} className={cn(PAGE_FRAME_CLASS.main, classNames?.main, className)} {...rest}>
        {children}
      </main>
    );
  }),
);

export const PageFrameFooter = asSlot(
  PAGE_FRAME_DISPLAY_NAME.Footer,
  forwardRef<HTMLElement, PageFrameFooterProps>(function PageFrameFooter(
    { className, children, ...rest },
    ref,
  ) {
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
  }),
);

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
