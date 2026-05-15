import { ClockIcon } from "lucide-react";

import { INSERT_DATETIME_COMMAND } from "@/lexical/date-time-extension";
import { ComponentPickerOption } from "@/lexical/component-picker-option";

/** Slash command: `/now` inserts the current date and time. */
export function NowPickerPlugin() {
  return new ComponentPickerOption("now", {
    icon: <ClockIcon className="size-4" />,
    keywords: ["now", "timestamp", "current", "time", "datetime"],
    onSelect: (_, editor) => {
      editor.dispatchCommand(INSERT_DATETIME_COMMAND, {
        dateTime: new Date(),
      });
    },
  });
}
