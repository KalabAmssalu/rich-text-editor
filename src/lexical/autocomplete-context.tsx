"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_AUTOCOMPLETE_STORAGE_KEY } from "@/core/types";

type AutocompleteContextValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

const AutocompleteContext = createContext<AutocompleteContextValue | null>(
  null,
);

function readStoredEnabled(storageKey: string): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(storageKey);
  if (stored === null) return true;
  return stored === "true";
}

export function AutocompleteProvider({
  children,
  storageKey = DEFAULT_AUTOCOMPLETE_STORAGE_KEY,
}: {
  children: ReactNode;
  storageKey?: string;
}) {
  const [enabled, setEnabledState] = useState(() =>
    readStoredEnabled(storageKey),
  );

  const setEnabled = useCallback(
    (value: boolean) => {
      setEnabledState(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, String(value));
      }
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, String(next));
      }
      return next;
    });
  }, [storageKey]);

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle }),
    [enabled, setEnabled, toggle],
  );

  return (
    <AutocompleteContext.Provider value={value}>
      {children}
    </AutocompleteContext.Provider>
  );
}

export function useAutocompleteEnabled(): AutocompleteContextValue {
  const ctx = useContext(AutocompleteContext);
  if (!ctx) {
    throw new Error(
      "useAutocompleteEnabled must be used within AutocompleteProvider",
    );
  }
  return ctx;
}

/** Safe when provider is optional (returns enabled=true). */
export function useAutocompleteEnabledOptional(): AutocompleteContextValue {
  const ctx = useContext(AutocompleteContext);
  return useMemo(
    () =>
      ctx ?? {
        enabled: true,
        setEnabled: () => {},
        toggle: () => {},
      },
    [ctx],
  );
}
