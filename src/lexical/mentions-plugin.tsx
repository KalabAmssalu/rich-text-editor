import {
  type JSX,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  MenuOption,
  type MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { LexicalTypeaheadMenuPlugin } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { TextNode } from "lexical";

import {
  Activity,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ClipboardSignature,
  FileText,
  FlaskConical,
  HeartPulse,
  History,
  Hospital,
  IdCard,
  Microscope,
  Package,
  Pill,
  PillBottle,
  Scan,
  type LucideIcon,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react";

import { useRichTextEditorConfig } from "@/core/editor-config-context";
import { $createMentionNode } from "@/lexical/mention-node";
import {
  type MentionEntry,
  type MentionIconName,
  resolveMentionMenuView,
} from "@/lexical/mention-schema-data";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/ui/popover";
import { cn } from "@/lib/utils";

import "./mentions-popover.css";

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ["@"].join("");

const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

const VALID_JOINS =
  "(?:" +
  "\\.[ |$]|" +
  " |" +
  "[" +
  PUNC +
  "]|" +
  ")";

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    VALID_JOINS +
    "){0," +
    LENGTH_LIMIT +
    "})" +
    ")$",
);

const ALIAS_LENGTH_LIMIT = 50;

const AtSignMentionsRegexAliasRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    "){0," +
    ALIAS_LENGTH_LIMIT +
    "})" +
    ")$",
);

const MENTION_ICONS: Record<MentionIconName, LucideIcon> = {
  UserRound,
  Stethoscope,
  Pill,
  ClipboardList,
  Activity,
  Microscope,
  HeartPulse,
  Hospital,
  CalendarDays,
  FileText,
  IdCard,
  History,
  PillBottle,
  Syringe,
  ClipboardSignature,
  Building2,
  Scan,
  FlaskConical,
  Package,
};

function MentionSchemaIcon({
  name,
  className,
}: {
  name: MentionIconName;
  className?: string;
}) {
  const Icon = MENTION_ICONS[name] ?? UserRound;
  return <Icon className={className} />;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 0);
}

class MentionTypeaheadOption extends MenuOption {
  entry: MentionEntry;

  constructor(entry: MentionEntry) {
    super(entry.id);
    this.entry = entry;
  }

  get schemaId(): string {
    return this.entry.id;
  }

  get label(): string {
    return this.entry.label;
  }

  get name(): string {
    return this.entry.insertValue ?? this.entry.label;
  }

  get isParent(): boolean {
    return this.entry.isCategory;
  }
}

function entryToOption(entry: MentionEntry): MentionTypeaheadOption {
  return new MentionTypeaheadOption(entry);
}

function MentionMenuRow({
  entry,
  selected,
  onActivate,
}: {
  entry: MentionEntry;
  selected: boolean;
  onActivate: () => void;
}) {
  return (
    <CommandItem
      value={entry.id}
      onSelect={onActivate}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5",
        selected ? "bg-accent" : "bg-transparent",
      )}
    >
      <MentionSchemaIcon
        name={entry.icon}
        className="text-muted-foreground size-4 shrink-0"
      />
      <span className="min-w-0 flex-1 truncate text-sm">{entry.label}</span>
      {entry.categoryPath ? (
        <span className="text-muted-foreground max-w-[45%] shrink-0 truncate text-xs">
          {entry.categoryPath}
        </span>
      ) : null}
      {entry.isCategory ? (
        <ChevronRight className="text-muted-foreground size-3.5 shrink-0 opacity-70" />
      ) : null}
    </CommandItem>
  );
}

/** Syncs a mirror element to Lexical’s typeahead anchor so Radix `Popover` can position content. */
function MentionsPopoverMirror({
  anchorRef,
  revision,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  revision: string;
}) {
  const mirrorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const mirror = mirrorRef.current;
    if (!anchor || !mirror) return;

    const sync = () => {
      const r = anchor.getBoundingClientRect();
      mirror.style.position = "fixed";
      mirror.style.left = `${r.left}px`;
      mirror.style.top = `${r.top}px`;
      mirror.style.width = `${Math.max(r.width, 1)}px`;
      mirror.style.height = `${Math.max(r.height, 1)}px`;
      mirror.style.pointerEvents = "none";
    };

    sync();
    const ro = new ResizeObserver(() => sync());
    ro.observe(anchor);
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [anchorRef, revision]);

  return (
    <PopoverAnchor asChild>
      <div ref={mirrorRef} aria-hidden className="box-border" />
    </PopoverAnchor>
  );
}

function CursorStyleMentionsMenu({
  anchorElementRef,
  queryString,
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex,
  navPath,
  setNavPath,
}: {
  anchorElementRef: React.RefObject<HTMLElement | null>;
  queryString: string | null;
  options: MentionTypeaheadOption[];
  selectedIndex: number | null;
  selectOptionAndCleanUp: (option: MentionTypeaheadOption) => void;
  setHighlightedIndex: (index: number) => void;
  navPath: string[];
  setNavPath: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { mentions } = useRichTextEditorConfig();
  const view = useMemo(
    () =>
      mentions
        ? resolveMentionMenuView(queryString, navPath, mentions)
        : { mode: "search" as const, rows: [] },
    [mentions, queryString, navPath],
  );

  const handleActivate = useCallback(
    (option: MentionTypeaheadOption) => {
      if (option.isParent) {
        setNavPath((p) => [...p, option.schemaId]);
        setHighlightedIndex(0);
        return;
      }
      selectOptionAndCleanUp(option);
    },
    [selectOptionAndCleanUp, setHighlightedIndex, setNavPath],
  );

  const handleBack = useCallback(() => {
    setNavPath((p) => p.slice(0, -1));
    setHighlightedIndex(0);
  }, [setHighlightedIndex, setNavPath]);

  if (!anchorElementRef.current || !options.length) {
    return null;
  }

  const renderRows = (entries: MentionEntry[], indexOffset: number) =>
    entries.map((entry, i) => {
      const option = options[indexOffset + i];
      if (!option || option.entry.id !== entry.id) return null;
      const index = indexOffset + i;
      return (
        <MentionMenuRow
          key={entry.id}
          entry={entry}
          selected={selectedIndex === index}
          onActivate={() => handleActivate(option)}
        />
      );
    });

  return createPortal(
    <div className="relative isolate">
      <Popover open={true} modal={false}>
        <MentionsPopoverMirror
          anchorRef={anchorElementRef}
          revision={`${queryString ?? ""}-${navPath.join("/")}-${options.length}-${selectedIndex ?? ""}`}
        />
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="w-[min(100vw-2rem,420px)] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Command
            className="overflow-hidden"
            shouldFilter={false}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex(
                  selectedIndex !== null
                    ? (selectedIndex - 1 + options.length) % options.length
                    : options.length - 1,
                );
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex(
                  selectedIndex !== null
                    ? (selectedIndex + 1) % options.length
                    : 0,
                );
              } else if (e.key === "ArrowLeft" && navPath.length > 0) {
                e.preventDefault();
                handleBack();
              } else if (e.key === "ArrowRight") {
                const idx = selectedIndex ?? 0;
                const option = options[idx];
                if (option?.isParent) {
                  e.preventDefault();
                  handleActivate(option);
                }
              }
            }}
          >
            {view.mode === "browse" && navPath.length > 0 ? (
              <div className="flex items-center gap-1 border-b px-2 py-1.5">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-accent"
                  aria-label="Back"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleBack}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-muted-foreground truncate text-xs">
                  {view.parentLabel}
                </span>
              </div>
            ) : null}
            <CommandList className="mentions-popover-scroll max-h-[min(60vh,360px)] p-1">
              {view.mode === "search" ? (
                <CommandGroup>{renderRows(view.rows, 0)}</CommandGroup>
              ) : (
                <>
                  {view.inserts.length > 0 ? (
                    <CommandGroup>{renderRows(view.inserts, 0)}</CommandGroup>
                  ) : null}
                  {view.inserts.length > 0 && view.categories.length > 0 ? (
                    <CommandSeparator className="my-1" />
                  ) : null}
                  {view.categories.length > 0 ? (
                    <CommandGroup>
                      {renderRows(view.categories, view.inserts.length)}
                    </CommandGroup>
                  ) : null}
                  {view.fields.length > 0 ? (
                    <CommandGroup>
                      {renderRows(
                        view.fields,
                        view.inserts.length + view.categories.length,
                      )}
                    </CommandGroup>
                  ) : null}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>,
    anchorElementRef.current,
  );
}

export function MentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { mentions, showMentions } = useRichTextEditorConfig();

  const [queryString, setQueryString] = useState<string | null>(null);
  const [navPath, setNavPath] = useState<string[]>([]);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  useLayoutEffect(() => {
    setNavPath([]);
  }, [queryString]);

  const view = useMemo(
    () =>
      mentions
        ? resolveMentionMenuView(queryString, navPath, mentions)
        : { mode: "search" as const, rows: [] },
    [mentions, queryString, navPath],
  );

  if (!showMentions || !mentions) {
    return null;
  }

  const flatEntries = useMemo((): MentionEntry[] => {
    if (view.mode === "search") return view.rows;
    return [...view.inserts, ...view.categories, ...view.fields];
  }, [view]);

  const options = useMemo(
    () => flatEntries.map(entryToOption),
    [flatEntries],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
      _matchingString: string,
    ) => {
      if (selectedOption.isParent) {
        setNavPath((p) => [...p, selectedOption.schemaId]);
        return;
      }
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => (
        <CursorStyleMentionsMenu
          anchorElementRef={anchorElementRef}
          queryString={queryString}
          options={options}
          selectedIndex={selectedIndex}
          selectOptionAndCleanUp={selectOptionAndCleanUp}
          setHighlightedIndex={setHighlightedIndex}
          navPath={navPath}
          setNavPath={setNavPath}
        />
      )}
    />
  );
}
