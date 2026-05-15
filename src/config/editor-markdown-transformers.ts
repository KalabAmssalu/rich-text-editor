import type { Transformer } from '@lexical/markdown';
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';

import { EMOJI } from '@/lexical/markdown-emoji-transformer';
import { HR } from '@/lexical/markdown-hr-transformer';
import { IMAGE } from '@/lexical/markdown-image-transformer';
import { TABLE } from '@/lexical/markdown-table-transformer';
import { TWEET } from '@/lexical/markdown-tweet-transformer';

/** Markdown transformers used by {@link MarkdownShortcutsExtension} and {@link MarkdownTogglePlugin}. */
export const EDITOR_MARKDOWN_TRANSFORMERS: Array<Transformer> = [
  TABLE,
  HR,
  IMAGE,
  EMOJI,
  TWEET,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];
