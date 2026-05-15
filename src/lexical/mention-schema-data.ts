import type {
  MentionEntry,
  MentionMenuNode,
  MentionSearchPatient,
  MentionsRuntimeConfig,
} from "@/lexical/mention-types";

export type {
  MentionEntry,
  MentionIconName,
  MentionMenuNode,
  MentionSearchPatient,
  MentionsRuntimeConfig,
} from "@/lexical/mention-types";

function walkTreeLeaves(
  nodes: MentionMenuNode[],
  parentPath: string,
  out: MentionEntry[],
): void {
  for (const node of nodes) {
    const path = parentPath ? `${parentPath} · ${node.label}` : node.label;
    if (node.children?.length) {
      walkTreeLeaves(node.children, path, out);
    } else if (node.insertValue) {
      out.push({
        id: node.id,
        label: node.label,
        icon: node.icon,
        categoryPath: path,
        kind: "insert",
        isCategory: false,
        insertValue: node.insertValue,
        keywords: [node.label, node.insertValue, path, node.sampleData ?? ""],
      });
    }
  }
}

export function buildMentionSearchIndex(
  categoryTree: MentionMenuNode[],
  options?: {
    patients?: MentionSearchPatient[];
    additionalEntries?: MentionEntry[];
  },
): MentionEntry[] {
  const entries: MentionEntry[] = [];
  walkTreeLeaves(categoryTree, "", entries);

  for (const p of options?.patients ?? []) {
    entries.push({
      id: `patient-${p.id}`,
      label: p.name,
      icon: "UserRound",
      categoryPath: "Patient",
      kind: "insert",
      isCategory: false,
      insertValue: p.name,
      keywords: [p.name, p.mrn ?? "", "patient"],
    });
  }

  if (options?.additionalEntries?.length) {
    entries.push(...options.additionalEntries);
  }

  return entries;
}

function scoreEntry(entry: MentionEntry, q: string): number {
  const label = entry.label.toLowerCase();
  const path = entry.categoryPath.toLowerCase();
  const keywords = (entry.keywords ?? []).join(" ").toLowerCase();
  const insert = (entry.insertValue ?? "").toLowerCase();

  if (label.startsWith(q)) return 100;
  if (label.includes(q)) return 80;
  if (path.includes(q)) return 60;
  if (insert.includes(q)) return 55;
  if (keywords.includes(q)) return 40;
  return 0;
}

export function searchMentionCatalog(
  query: string,
  config: MentionsRuntimeConfig,
  limit = 15,
): MentionEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const inserts = config.searchIndex
    .filter((e) => scoreEntry(e, q) > 0)
    .sort((a, b) => scoreEntry(b, q) - scoreEntry(a, q))
    .slice(0, limit);

  const matchingCategories = config.categoryTree
    .filter((cat) => {
      const label = cat.label.toLowerCase();
      if (label.includes(q)) return true;
      return cat.children?.some(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          (c.insertValue?.toLowerCase().includes(q) ?? false),
      );
    })
    .map(
      (cat): MentionEntry => ({
        id: cat.id,
        label: cat.label,
        icon: cat.icon,
        categoryPath: "Category",
        kind: "category",
        isCategory: true,
      }),
    );

  const seen = new Set(inserts.map((i) => i.id));
  const categories = matchingCategories
    .filter((c) => !seen.has(c.id))
    .slice(0, 5);

  return [...inserts, ...categories];
}

export function getRootCategories(
  config: MentionsRuntimeConfig,
): MentionEntry[] {
  return config.categoryTree.map((cat) => ({
    id: cat.id,
    label: cat.label,
    icon: cat.icon,
    categoryPath: "",
    kind: "category" as const,
    isCategory: true,
  }));
}

export function getQuickInserts(config: MentionsRuntimeConfig): MentionEntry[] {
  const quick: MentionEntry[] = [];

  if (config.activePatient) {
    quick.push({
      id: "quick-patient-name",
      label: config.activePatient.name,
      icon: "UserRound",
      categoryPath: "Patient · Chart",
      kind: "insert",
      isCategory: false,
      insertValue: config.activePatient.name,
      keywords: [config.activePatient.name, config.activePatient.mrn ?? ""],
    });
    if (config.activePatient.mrn) {
      quick.push({
        id: "quick-patient-mrn",
        label: config.activePatient.mrn,
        icon: "IdCard",
        categoryPath: "Patient · Chart",
        kind: "insert",
        isCategory: false,
        insertValue: config.activePatient.mrn,
      });
    }
  }

  const orderLike = config.searchIndex
    .filter((e) => e.categoryPath.toLowerCase().includes("order"))
    .slice(0, 4);
  quick.push(...orderLike);

  return quick;
}

export function getMentionLevelNodes(
  pathIds: string[],
  categoryTree: MentionMenuNode[],
): MentionMenuNode[] {
  let level: MentionMenuNode[] = categoryTree;
  for (const id of pathIds) {
    const parent = level.find((n) => n.id === id);
    if (!parent?.children?.length) return [];
    level = parent.children;
  }
  return level;
}

export function levelNodesToEntries(
  nodes: MentionMenuNode[],
  parentLabel: string,
): MentionEntry[] {
  return nodes.map((node) => {
    const branch = Boolean(node.children?.length);
    const path = parentLabel ? `${parentLabel} · ${node.label}` : node.label;
    return {
      id: node.id,
      label: node.label,
      icon: node.icon,
      categoryPath: branch ? "Category" : path,
      kind: branch ? "category" : "insert",
      isCategory: branch,
      insertValue: node.insertValue,
      keywords: [node.label, node.sampleData ?? "", path],
    };
  });
}

export type MentionMenuView =
  | { mode: "search"; rows: MentionEntry[] }
  | {
      mode: "browse";
      inserts: MentionEntry[];
      categories: MentionEntry[];
      fields: MentionEntry[];
      parentLabel: string;
    };

export function resolveMentionMenuView(
  query: string | null,
  navPath: string[],
  config: MentionsRuntimeConfig,
): MentionMenuView {
  const q = (query ?? "").trim();

  if (q.length > 0) {
    return { mode: "search", rows: searchMentionCatalog(q, config) };
  }

  if (navPath.length === 0) {
    return {
      mode: "browse",
      inserts: getQuickInserts(config),
      categories: getRootCategories(config),
      fields: [],
      parentLabel: "",
    };
  }

  const nodes = getMentionLevelNodes(navPath, config.categoryTree);
  const labels: string[] = [];
  let level = config.categoryTree;
  for (const id of navPath) {
    const n = level.find((x) => x.id === id);
    if (!n) break;
    labels.push(n.label);
    level = n.children ?? [];
  }
  const parentLabel = labels.join(" › ");

  return {
    mode: "browse",
    inserts: [],
    categories: [],
    fields: levelNodesToEntries(nodes, labels[labels.length - 1] ?? ""),
    parentLabel,
  };
}

export function isMentionBranch(node: MentionMenuNode): boolean {
  return Boolean(node.children?.length);
}

export function filterMentionNodesByQuery(
  nodes: MentionMenuNode[],
  query: string,
): MentionMenuNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  return nodes.filter(
    (n) =>
      n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q),
  );
}
