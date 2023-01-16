import type { Column } from "@prisma/client";
import type { RouterOutputs } from "../../../../utils/api";

export type ItemList = RouterOutputs["retroItem"]["getByRetroId"];

type Unpack<T> = T extends (infer U)[] ? U : T;
export type Item = Unpack<ItemList>;

interface GroupingRetroColumnProps {
  retroId: string;
  column: Column;
  columnHeader: string;
  canParticipate: boolean;
  items: ItemList;
  onRefetch: () => void;
}

export default function GroupingRetroColumn({
  retroId,
  column,
  columnHeader,
  canParticipate,
  items,
  onRefetch,
}: GroupingRetroColumnProps) {
  return (
    <div className="flex w-96 flex-col rounded-xl bg-gray-200 py-4 px-8">
      <h3 className="mb-4 text-center text-lg font-bold">{columnHeader}</h3>
      <div className="my-4 flex flex-grow flex-col justify-start gap-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-md bg-white py-2 px-4">
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
