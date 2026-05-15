'use client';

import { useCallback } from 'react';

import { exportFile } from '@lexical/file';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import {
  DownloadIcon,
  FileJsonIcon,
  FileTextIcon,
  UploadIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  importDocxFile,
  importLexicalFile,
} from '@/lexical/import-editor-document';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';

export function ImportExportPlugin() {
  const [editor] = useLexicalComposerContext();

  const handleImportLexical = useCallback(async () => {
    const result = await importLexicalFile(editor);
    if (result.ok) {
      toast.success('Lexical document imported');
    } else {
      toast.error(result.error);
    }
  }, [editor]);

  const handleImportDocx = useCallback(async () => {
    const result = await importDocxFile(editor);
    if (result.ok) {
      if (result.warnings.length > 0) {
        toast.success('Word document imported', {
          description: `${result.warnings.length} conversion warning(s).`,
        });
      } else {
        toast.success('Word document imported');
      }
    } else {
      toast.error(result.error);
    }
  }, [editor]);

  return (
    <>
      <DropdownMenu>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                title="Import"
                aria-label="Import document"
                size="sm"
                className="p-2"
              >
                <UploadIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Import document</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Import as</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleImportLexical}>
            <FileJsonIcon className="size-4" />
            Lexical file (.lexical)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleImportDocx}>
            <FileTextIcon className="size-4" />
            Word document (.docx)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() =>
              exportFile(editor, {
                fileName: `Editor ${new Date().toISOString()}`,
                source: 'Editor',
              })
            }
            title="Export"
            aria-label="Export editor state to JSON"
            size="sm"
            className="p-2"
          >
            <DownloadIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Export Content</TooltipContent>
      </Tooltip>
    </>
  );
}
