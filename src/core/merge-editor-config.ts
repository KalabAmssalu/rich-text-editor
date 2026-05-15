import type {
  RichTextEditorBoxProps,
  RichTextEditorConfig,
} from "./types";

/** Flat props override nested `config` fields. */
export function mergeEditorConfig(
  props: RichTextEditorBoxProps,
): RichTextEditorConfig {
  const base = props.config ?? {};
  return {
    mentions: props.mentions ?? base.mentions,
    autocomplete: props.autocomplete ?? base.autocomplete,
    templates: props.templates ?? base.templates,
    signer: props.signer ?? base.signer,
    tools: props.tools ?? base.tools,
  };
}
