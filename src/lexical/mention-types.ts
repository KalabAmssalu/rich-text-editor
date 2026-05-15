export const MENTION_ICON_NAMES = [
  "UserRound",
  "Stethoscope",
  "Pill",
  "ClipboardList",
  "Activity",
  "Microscope",
  "HeartPulse",
  "Hospital",
  "CalendarDays",
  "FileText",
  "IdCard",
  "History",
  "PillBottle",
  "Syringe",
  "ClipboardSignature",
  "Building2",
  "Scan",
  "FlaskConical",
  "Package",
] as const;

export type MentionIconName = (typeof MENTION_ICON_NAMES)[number];

export type MentionRowKind = "insert" | "category";

export interface MentionEntry {
  id: string;
  label: string;
  icon: MentionIconName;
  categoryPath: string;
  kind: MentionRowKind;
  isCategory: boolean;
  insertValue?: string;
  keywords?: string[];
}

export interface MentionMenuNode {
  id: string;
  label: string;
  icon: MentionIconName;
  children?: MentionMenuNode[];
  insertValue?: string;
  sampleData?: string;
}

export interface MentionSearchPatient {
  id: string;
  name: string;
  mrn?: string;
}

export interface MentionsRuntimeConfig {
  categoryTree: MentionMenuNode[];
  searchIndex: MentionEntry[];
  patients: MentionSearchPatient[];
  activePatient?: { id: string; name: string; mrn?: string };
}
