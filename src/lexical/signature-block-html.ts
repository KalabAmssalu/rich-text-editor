/** Static HTML for signature blocks (export / print — no React). */

const QR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`;

export function buildSignatureBlockExportElement({
  signerName,
  signerTitle,
  signedAtIso,
  signedAtLabel,
}: {
  signerName: string;
  signerTitle?: string;
  signedAtIso: string;
  signedAtLabel: string;
}): HTMLDivElement {
  const root = document.createElement("div");
  root.setAttribute("data-lexical-signature", "true");
  root.setAttribute("data-signer-name", signerName);
  root.setAttribute("data-signed-at", signedAtIso);
  if (signerTitle) {
    root.setAttribute("data-signer-title", signerTitle);
  }
  root.className = "emr-signature-block";
  root.setAttribute("contenteditable", "false");
  root.style.cssText =
    "margin:1rem 0;padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;background:#f9fafb;";

  const titleHtml = signerTitle
    ? `<p style="margin:0;font-size:0.75rem;color:#6b7280;">${escapeHtml(signerTitle)}</p>`
    : "";

  root.innerHTML = `
    <div style="border-top:1px solid #e5e7eb;margin-bottom:0.75rem;padding-top:0.75rem;"></div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;">
      <div style="min-width:0;flex:1;">
        <p style="margin:0 0 0.25rem;font-size:0.875rem;font-weight:600;color:#111827;">${escapeHtml(signerName)}</p>
        ${titleHtml}
        <p style="margin:0;font-size:0.75rem;color:#6b7280;font-variant-numeric:tabular-nums;">${escapeHtml(signedAtLabel)}</p>
      </div>
      <div style="flex-shrink:0;width:3.5rem;height:3.5rem;display:flex;align-items:center;justify-content:center;border:1px solid #e5e7eb;border-radius:0.375rem;background:#fff;color:#6b7280;" aria-hidden="true">
        ${QR_SVG}
      </div>
    </div>
    <p style="margin:0.5rem 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Electronically signed</p>
  `.trim();

  return root;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
