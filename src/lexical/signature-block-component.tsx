"use client";

import { QrCode } from "lucide-react";

import { cn } from "@/lib/utils";

export function SignatureBlockComponent({
  signerName,
  signerTitle,
  signedAtLabel,
  className,
}: {
  signerName: string;
  signerTitle?: string;
  signedAtLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-muted/30 my-4 rounded-lg border px-4 py-4",
        className,
      )}
      contentEditable={false}
      data-lexical-signature="true"
    >
      <div className="border-border mb-3 border-t pt-3" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-foreground text-sm font-semibold tracking-tight">
            {signerName}
          </p>
          {signerTitle ? (
            <p className="text-muted-foreground text-xs">{signerTitle}</p>
          ) : null}
          <p className="text-muted-foreground text-xs tabular-nums">
            {signedAtLabel}
          </p>
        </div>
        <div
          className="border-border bg-background text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-md border"
          aria-hidden
        >
          <QrCode className="size-8 stroke-[1.25]" />
        </div>
      </div>
      <p className="text-muted-foreground mt-2 text-[10px] uppercase tracking-wider">
        Electronically signed
      </p>
    </div>
  );
}
