"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type ScrollbarVariant = "default" | "on-hover";

const ScrollbarVariantContext = React.createContext<ScrollbarVariant>("default");

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  scrollbarVariant?: ScrollbarVariant;
};

function ScrollArea({
  className,
  children,
  scrollbarVariant = "default",
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollbarVariantContext.Provider value={scrollbarVariant}>
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        className={cn(
          "relative",
          scrollbarVariant === "on-hover" && "group/scroll-area",
          className,
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          data-slot="scroll-area-viewport"
          className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="vertical" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </ScrollbarVariantContext.Provider>
  );
}

type ScrollBarProps = React.ComponentProps<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> & {
  /** When set, overrides the variant from the nearest ScrollArea (for standalone use). */
  variantOverride?: ScrollbarVariant;
};

function ScrollBar({
  className,
  orientation = "vertical",
  variantOverride,
  ...props
}: ScrollBarProps) {
  const fromContext = React.useContext(ScrollbarVariantContext);
  const variant = variantOverride ?? fromContext;

  const hoverOpacity =
    variant === "on-hover" &&
    "pointer-events-none opacity-0 transition-opacity duration-200 group-hover/scroll-area:pointer-events-auto group-hover/scroll-area:opacity-100 group-focus-within/scroll-area:pointer-events-auto group-focus-within/scroll-area:opacity-100";

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        hoverOpacity,
        orientation === "vertical" &&
          cn(
            "h-full shrink-0 justify-center border-l border-l-transparent",
            variant === "on-hover"
              ? "w-[11px] pl-1.5 pr-0.5"
              : "w-2 pl-1 pr-0.5",
          ),
        orientation === "horizontal" &&
          cn(
            "h-2 flex-col border-t border-t-transparent pt-1",
            variant === "on-hover" && "h-[11px] pt-1.5 pb-0.5",
          ),
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full bg-border",
          variant === "on-hover" &&
            orientation === "vertical" &&
            "mx-auto max-w-[5px] bg-slate-400/55",
          variant === "on-hover" &&
            orientation === "horizontal" &&
            "my-auto max-h-[5px] bg-slate-400/55",
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
