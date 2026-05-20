let cachedDictionary: readonly string[] | null = null;

/** Lazy-loads the English dictionary chunk (only when autocomplete uses it). */
export async function loadEnglishDictionary(): Promise<readonly string[]> {
  if (cachedDictionary !== null) {
    return cachedDictionary;
  }
  const mod = await import("./english-dictionary");
  cachedDictionary = mod.ENGLISH_DICTIONARY;
  return cachedDictionary;
}
