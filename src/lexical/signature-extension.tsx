import { $createParagraphNode, $getRoot, COMMAND_PRIORITY_EDITOR, createCommand, defineExtension, type LexicalCommand } from "lexical";

import {
  $createSignatureBlockNode,
  $isSignatureBlockNode,
} from "@/lexical/signature-block-node";
export type InsertSignaturePayload = {
  signerName?: string;
  signerTitle?: string;
};

export const INSERT_SIGNATURE_COMMAND: LexicalCommand<InsertSignaturePayload | undefined> =
  createCommand("INSERT_SIGNATURE_COMMAND");

export function $appendSignatureBlock(payload?: InsertSignaturePayload): void {
  const root = $getRoot();

  const last = root.getLastChild();
  if (last && $isSignatureBlockNode(last)) {
    return;
  }

  const spacer =
    root.getTextContentSize() > 0 ? $createParagraphNode() : null;
  if (spacer) {
    root.append(spacer);
  }

  root.append(
    $createSignatureBlockNode({
      signerName: payload?.signerName ?? "Signer",
      signerTitle: payload?.signerTitle ?? "",
    }),
  );
  root.selectEnd();
}

export const SignatureExtension = defineExtension({
  name: "@emr/SignatureBlock",
  nodes: [],
  register: (editor) =>
    editor.registerCommand(
      INSERT_SIGNATURE_COMMAND,
      (payload) => {
        editor.update(() => {
          $appendSignatureBlock(payload ?? undefined);
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
