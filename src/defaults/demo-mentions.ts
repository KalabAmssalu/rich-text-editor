import type { MentionMenuNode } from "@/lexical/mention-types";

export const DEMO_MENTION_CATEGORY_TREE: MentionMenuNode[] = [
  {
    id: "people",
    label: "People",
    icon: "UserRound",
    children: [
      {
        id: "author",
        label: "Author",
        icon: "IdCard",
        insertValue: "Document author",
        sampleData: "Insert author name",
      },
    ],
  },
  {
    id: "document",
    label: "Document",
    icon: "FileText",
    children: [
      {
        id: "date",
        label: "Today's date",
        icon: "CalendarDays",
        insertValue: new Date().toLocaleDateString(),
        sampleData: "Current date",
      },
    ],
  },
];

export const DEMO_MENTION_PATIENTS = [
  { id: "demo-1", name: "Alex Morgan", mrn: "DEMO-001" },
];

export const DEMO_ACTIVE_PATIENT = {
  id: "demo-1",
  name: "Alex Morgan",
  mrn: "DEMO-001",
};
