'use client';

import { createContext, useContext, type RefObject } from 'react';

/** When set, Radix overlays (dropdown / select / popover / tooltip) portal into this element instead of `document.body`. */
export const OverlayPortalRootContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function useOverlayPortalRoot(): RefObject<HTMLElement | null> | null {
  return useContext(OverlayPortalRootContext);
}
