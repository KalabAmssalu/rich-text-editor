'use client';

import { useMemo, useState } from 'react';

import { FileClockIcon } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/popover';
import { ScrollArea } from '@/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';

export type NoteAuditLogEntry = {
  id: string;
  versionLabel: string;
  action: string;
  actor: string;
  occurredAt: string;
  summary: string;
  detail: string;
};

const MOCK_AUDIT_ENTRIES: NoteAuditLogEntry[] = [
  {
    id: '1',
    versionLabel: 'v12 — current draft',
    action: 'Autosave',
    actor: 'System',
    occurredAt: '2026-05-13 09:41',
    summary: 'Encounter note autosaved while editing.',
    detail:
      'No structural changes detected. Word count increased by 42. Session id: sess_8k2…',
  },
  {
    id: '2',
    versionLabel: 'v11',
    action: 'Edited',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-13 09:12',
    summary: 'Assessment section updated; plan bullets reordered.',
    detail:
      'Diff: assessment paragraph expanded. Plan items 2 and 3 swapped. ICD-10 references unchanged.',
  },
  {
    id: '3',
    versionLabel: 'v10',
    action: 'Signed',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-12 16:03',
    summary: 'Note cosigned and locked for billing.',
    detail:
      'Signature applied. Lock policy: edits require addendum. Billing export queue: OK.',
  },
  {
    id: '4',
    versionLabel: 'v9',
    action: 'Edited',
    actor: 'Nurse Patel',
    occurredAt: '2026-05-12 14:22',
    summary: 'Vitals and ROS pasted from intake.',
    detail: 'Imported block from intake form id INT-44921. Source verified.',
  },
  {
    id: '5',
    versionLabel: 'v8',
    action: 'Restored',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-12 11:50',
    summary: 'Restored from v6 after accidental deletion.',
    detail: 'Restore token rst_9912. Previous v7 discarded per user request.',
  },
  {
    id: '6',
    versionLabel: 'v7',
    action: 'Edited',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-12 11:02',
    summary: 'Shortened HPI narrative.',
    detail: 'Approx. 180 characters removed. Reading level unchanged.',
  },
  {
    id: '7',
    versionLabel: 'v6',
    action: 'Comment',
    actor: 'Coding review',
    occurredAt: '2026-05-11 17:30',
    summary: 'Internal comment: clarify laterality for procedure.',
    detail: 'Comment thread #CR-882 (not visible to patient).',
  },
  {
    id: '8',
    versionLabel: 'v5',
    action: 'Edited',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-11 09:00',
    summary: 'Plan: added follow-up window.',
    detail: 'Follow-up set to 2 weeks. Template applied from org library.',
  },
  {
    id: '9',
    versionLabel: 'v4',
    action: 'Created',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-10 08:15',
    summary: 'Encounter note shell created from template.',
    detail: 'Template: Ambulatory follow-up v3. Sections: CC, HPI, ROS, PE, A/P.',
  },
  {
    id: '10',
    versionLabel: 'v3',
    action: 'Imported',
    actor: 'System',
    occurredAt: '2026-05-10 08:14',
    summary: 'Demographics and payer context linked.',
    detail: 'FHIR DocumentReference stub created. MRN verified.',
  },
  {
    id: '11',
    versionLabel: 'v2',
    action: 'Policy',
    actor: 'Compliance bot',
    occurredAt: '2026-05-10 08:14',
    summary: 'Retention and break-glass policy attached.',
    detail: 'Policies POL-RET-01, POL-BG-02 acknowledged for this encounter type.',
  },
  {
    id: '12',
    versionLabel: 'v1',
    action: 'Opened',
    actor: 'Dr. Chen',
    occurredAt: '2026-05-10 08:10',
    summary: 'Encounter opened; note workspace initialized.',
    detail: 'Encounter id ENC-20260510-4412. Location: Clinic 3B.',
  },
];

export function NoteVersionAuditLogPlugin() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<NoteAuditLogEntry | null>(null);

  const entries = useMemo(() => MOCK_AUDIT_ENTRIES, []);

  function openEntry(entry: NoteAuditLogEntry) {
    setSelected(entry);
    setPopoverOpen(false);
    setDialogOpen(true);
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="p-2"
                aria-label="Version history and audit log"
              >
                <FileClockIcon className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Versioning & audit log</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="end"
          side="top"
          sideOffset={8}
          className="flex w-[min(calc(100vw-1.5rem),20rem)] flex-col overflow-hidden p-0 shadow-lg"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="text-sm font-medium text-foreground">Versioning & audit log</p>
            <p className="text-xs text-muted-foreground">
              Click a row to open the full audit entry.
            </p>
          </div>

          <ScrollArea className="h-[min(280px,42vh)]">
            <ul className="flex flex-col p-1" role="list">
              {entries.map((entry) => (
                <li key={entry.id} className="list-none">
                  <button
                    type="button"
                    onClick={() => openEntry(entry)}
                    className="flex w-full flex-col gap-0.5 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-medium text-foreground">{entry.versionLabel}</span>
                    <span className="text-muted-foreground">
                      {entry.action} · {entry.actor} · {entry.occurredAt}
                    </span>
                    <span className="line-clamp-2 text-muted-foreground">{entry.summary}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelected(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.versionLabel}</DialogTitle>
                <DialogDescription>
                  {selected.action} · {selected.actor} · {selected.occurredAt}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="font-medium text-foreground">Summary</p>
                <p className="text-muted-foreground">{selected.summary}</p>
                <p className="font-medium text-foreground">Detail</p>
                <p className="whitespace-pre-wrap text-muted-foreground">{selected.detail}</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
