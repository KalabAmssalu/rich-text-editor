'use client';

import {
  Children,
  useEffect,
  useMemo,
  type JSX,
  type ReactNode,
  type RefObject,
} from 'react';

import { LexicalBuilder, getExtensionDependencyFromEditor } from '@lexical/extension';
import type { LexicalComposerContextWithEditor } from '@lexical/react/LexicalComposerContext';
import { ReactExtension } from '@lexical/react/ReactExtension';
import { ReactProviderExtension } from '@lexical/react/ReactProviderExtension';
import { configExtension } from 'lexical';
import type { AnyLexicalExtensionArgument } from 'lexical';

type EditorChildrenComponentProps = {
  context: LexicalComposerContextWithEditor;
  contentEditable: null | JSX.Element;
  children?: ReactNode;
};

type EditorChildrenComponentType = (
  props: EditorChildrenComponentProps,
) => JSX.Element | null;

function defaultToolbarFirstEditorChildren({
  contentEditable,
  children,
  context: _context,
}: EditorChildrenComponentProps) {
  return (
    <>
      {children}
      {contentEditable}
    </>
  );
}

function makeToolbarFirstEditorChildren(
  shellRef: RefObject<HTMLElement | null> | undefined,
  shellClassName: string | undefined,
): EditorChildrenComponentType {
  if (!shellRef || !shellClassName) {
    return defaultToolbarFirstEditorChildren;
  }

  return function ToolbarFirstEditorChildrenWithShell({
    contentEditable,
    children,
    context: _context,
  }: EditorChildrenComponentProps) {
    const nodes = Children.toArray(children);
    const [chrome, ...rest] = nodes;
    return (
      <>
        <div ref={shellRef as RefObject<HTMLDivElement | null>} className={shellClassName}>
          {chrome}
          {contentEditable}
        </div>
        {rest}
      </>
    );
  };
}

export interface LexicalExtensionComposerToolbarFirstProps {
  extension: AnyLexicalExtensionArgument;
  children?: ReactNode;
  contentEditable?: JSX.Element | null;
  /**
   * When set together with `editorShellClassName`, the first React child (toolbar + plugins)
   * and the Lexical `contentEditable` surface are wrapped in one column inside this element.
   * Without this, the surface renders as a sibling after `children`, which breaks bordered layouts.
   */
  editorShellRef?: RefObject<HTMLElement | null>;
  editorShellClassName?: string;
}

/**
 * Same as {@link LexicalExtensionComposer}, but renders `children` (toolbar + plugins)
 * above the `contentEditable` surface so the formatting bar sits on top of the editor.
 */
export function LexicalExtensionComposerToolbarFirst({
  extension,
  children,
  contentEditable,
  editorShellRef,
  editorShellClassName,
}: LexicalExtensionComposerToolbarFirstProps) {
  const EditorChildrenComponent = useMemo(
    () => makeToolbarFirstEditorChildren(editorShellRef, editorShellClassName),
    [editorShellRef, editorShellClassName],
  );

  const editor = useMemo(() => {
    return LexicalBuilder.fromExtensions([
      ReactProviderExtension,
      configExtension(ReactExtension, {
        ...(contentEditable === undefined ? {} : { contentEditable }),
        EditorChildrenComponent,
      }),
      extension,
    ]).buildEditor();
  }, [EditorChildrenComponent, contentEditable, extension]);

  useEffect(() => {
    let didMount = false;
    queueMicrotask(() => {
      didMount = true;
    });
    return () => {
      if (didMount) {
        editor.dispose();
      }
    };
  }, [editor]);

  const { Component } = getExtensionDependencyFromEditor(editor, ReactExtension).output;
  return <Component>{children}</Component>;
}
