import type { JSX } from "react";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";

import { SignatureBlockComponent } from "@/lexical/signature-block-component";
import {
  buildSignatureBlockExportElement,
} from "@/lexical/signature-block-html";

export type SerializedSignatureBlockNode = Spread<
  {
    signerName: string;
    signerTitle?: string;
    signedAtIso: string;
  },
  SerializedLexicalNode
>;

function $convertSignatureElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const signedAt = domNode.getAttribute("data-signed-at");
  const signerName = domNode.getAttribute("data-signer-name");
  if (!signedAt || !signerName) return null;
  return {
    node: $createSignatureBlockNode({
      signerName,
      signerTitle: domNode.getAttribute("data-signer-title") ?? undefined,
      signedAtIso: signedAt,
    }),
  };
}

function formatSignedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export class SignatureBlockNode extends DecoratorNode<JSX.Element> {
  __signerName: string;
  __signerTitle?: string;
  __signedAtIso: string;

  static getType(): string {
    return "signature-block";
  }

  static clone(node: SignatureBlockNode): SignatureBlockNode {
    return new SignatureBlockNode(
      node.__signerName,
      node.__signedAtIso,
      node.__signerTitle,
      node.__key,
    );
  }

  static importJSON(
    serialized: SerializedSignatureBlockNode,
  ): SignatureBlockNode {
    return $createSignatureBlockNode({
      signerName: serialized.signerName,
      signerTitle: serialized.signerTitle,
      signedAtIso: serialized.signedAtIso,
    }).updateFromJSON(serialized);
  }

  updateFromJSON(
    serialized: LexicalUpdateJSON<SerializedSignatureBlockNode>,
  ): this {
    return super.updateFromJSON(serialized);
  }

  constructor(
    signerName: string,
    signedAtIso: string,
    signerTitle?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__signerName = signerName;
    this.__signedAtIso = signedAtIso;
    this.__signerTitle = signerTitle;
  }

  exportJSON(): SerializedSignatureBlockNode {
    return {
      ...super.exportJSON(),
      signerName: this.__signerName,
      signerTitle: this.__signerTitle,
      signedAtIso: this.__signedAtIso,
      type: "signature-block",
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-signature")) return null;
        return { conversion: $convertSignatureElement, priority: 2 };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    return {
      element: buildSignatureBlockExportElement({
        signerName: this.__signerName,
        signerTitle: this.__signerTitle,
        signedAtIso: this.__signedAtIso,
        signedAtLabel: formatSignedAt(this.__signedAtIso),
      }),
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    const className = config.theme?.paragraph;
    if (className) div.className = className;
    return div;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  getTextContent(): string {
    return `Signed by ${this.__signerName} on ${formatSignedAt(this.__signedAtIso)}`;
  }

  decorate(): JSX.Element {
    return (
      <SignatureBlockComponent
        signerName={this.__signerName}
        signerTitle={this.__signerTitle}
        signedAtLabel={formatSignedAt(this.__signedAtIso)}
      />
    );
  }
}

export function $createSignatureBlockNode(payload: {
  signerName: string;
  signerTitle?: string;
  signedAtIso?: string;
}): SignatureBlockNode {
  return $applyNodeReplacement(
    new SignatureBlockNode(
      payload.signerName,
      payload.signedAtIso ?? new Date().toISOString(),
      payload.signerTitle,
    ),
  );
}

export function $isSignatureBlockNode(
  node: LexicalNode | null | undefined,
): node is SignatureBlockNode {
  return node instanceof SignatureBlockNode;
}
