'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react';

import { Button } from '@/ui/button';
import { Separator } from '@/ui/separator';
import { cn } from '@/lib/utils';

type FormatState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

function readFormat(): FormatState {
  let bold = false;
  let italic = false;
  let underline = false;
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    bold = selection.hasFormat('bold');
    italic = selection.hasFormat('italic');
    underline = selection.hasFormat('underline');
  }
  return { bold, italic, underline };
}

export function RichTextToolbar({ disabled }: { disabled?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [fmt, setFmt] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const sync = useCallback(() => {
    editor.getEditorState().read(() => {
      setFmt(readFormat());
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          sync();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, sync]);

  useEffect(() => {
    sync();
  }, [sync]);

  const dispatch = useCallback(
    (fn: () => void) => {
      if (disabled) return;
      fn();
    },
    [disabled],
  );

  const toggleLink = useCallback(() => {
    if (disabled) return;
    const url = window.prompt('Link URL (leave empty to remove)');
    if (url === null) return;
    const trimmed = url.trim();
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, trimmed || null);
  }, [editor, disabled]);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5',
        disabled && 'pointer-events-none opacity-60',
      )}
      role="toolbar"
      aria-label="Rich text formatting"
    >
      <Button
        type="button"
        variant={fmt.bold ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        title="Bold"
        onClick={() =>
          dispatch(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'))
        }
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={fmt.italic ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        title="Italic"
        onClick={() =>
          dispatch(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'))
        }
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={fmt.underline ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        title="Underline"
        onClick={() =>
          dispatch(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'))
        }
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Bullet list"
        onClick={() =>
          dispatch(() =>
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
          )
        }
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Numbered list"
        onClick={() =>
          dispatch(() =>
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
          )
        }
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Remove list"
        onClick={() =>
          dispatch(() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined))
        }
      >
        <span className="text-xs font-semibold">¶</span>
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Link"
        onClick={toggleLink}
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Undo"
        disabled={!canUndo || disabled}
        onClick={() =>
          dispatch(() => editor.dispatchCommand(UNDO_COMMAND, undefined))
        }
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Redo"
        disabled={!canRedo || disabled}
        onClick={() =>
          dispatch(() => editor.dispatchCommand(REDO_COMMAND, undefined))
        }
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
