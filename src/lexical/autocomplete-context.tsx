"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "emr-rich-text-autocomplete-enabled";

type AutocompleteContextValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

const AutocompleteContext = createContext<AutocompleteContextValue | null>(
  null,
);

function readStoredEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === null) return true;
  return stored === "true";
}

export function AutocompleteProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(readStoredEnabled);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }, []);

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
