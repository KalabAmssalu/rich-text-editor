import { editorStateFromSerializedDocument } from '@lexical/file';
import { $generateNodesFromDOM } from '@lexical/html';
import {
  $createParagraphNode,
  $getRoot,
  CLEAR_HISTORY_COMMAND,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical';

type FileReadMode = 'text' | 'arrayBuffer';

function pickFile(
  accept: string,
  readAs: FileReadMode,
  onFile: (content: string | ArrayBuffer, fileName: string) => void,
): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result == null) {
        return;
      }
      onFile(reader.result as string | ArrayBuffer, file.name);
    };

    if (readAs === 'text') {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
  input.click();
}

function $setRootChildren(nodes: LexicalNode[]): void {
  const root = $getRoot();
  root.clear();

  if (nodes.length === 0) {
    root.append($createParagraphNode());
  } else {
    for (const node of nodes) {
      root.append(node);
    }
  }

  root.selectStart();
}

function replaceEditorWithHtml(editor: LexicalEditor, html: string): void {
  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    $setRootChildren(nodes);
  });
  editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
}

/** Import a `.lexical` JSON snapshot (Lexical EditorState). */
export function importLexicalFile(
  editor: LexicalEditor,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    pickFile('.lexical,application/json', 'text', (content) => {
      try {
        editor.setEditorState(
          editorStateFromSerializedDocument(editor, content as string),
        );
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
        resolve({ ok: true });
      } catch {
        resolve({
          ok: false,
          error: 'Invalid Lexical file. Choose a .lexical export from this editor.',
        });
      }
    });
  });
}

/** Import a Word `.docx` document via mammoth (DOCX → HTML → Lexical nodes). */
export async function importDocxFile(
  editor: LexicalEditor,
): Promise<
  { ok: true; warnings: string[] } | { ok: false; error: string }
> {
  return new Promise((resolve) => {
    pickFile(
      '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'arrayBuffer',
      async (buffer) => {
        try {
          const mammoth = await import('mammoth');
          const result = await mammoth.convertToHtml({
            arrayBuffer: buffer as ArrayBuffer,
          });

          if (!result.value.trim()) {
            resolve({
              ok: false,
              error: 'The document appears to be empty.',
            });
            return;
          }

          replaceEditorWithHtml(editor, result.value);

          const warnings = result.messages
            .filter((message) => message.type === 'warning')
            .map((message) => message.message);

          resolve({ ok: true, warnings });
        } catch {
          resolve({
            ok: false,
            error: 'Could not read the Word document. Ensure it is a valid .docx file.',
          });
        }
      },
    );
  });
}
