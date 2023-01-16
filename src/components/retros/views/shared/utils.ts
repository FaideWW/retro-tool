import type { Column } from "@prisma/client";
import { useMemo } from "react";

export function useColumnizedItems<T extends { column: Column }>(
  items: T[] | undefined
): [T[], T[]] {
  return useMemo(() => {
    if (!items) return [[], []];
    return items.reduce<[T[], T[]]>(
      ([positives, negatives], item) => {
        if (item.column === "POSITIVE") {
          return [[...positives, item], negatives];
        } else {
          return [positives, [...negatives, item]];
        }
      },
      [[], []]
    );
  }, [items]);
}
