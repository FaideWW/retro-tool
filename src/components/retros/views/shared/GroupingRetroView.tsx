import { api } from "../../../../utils/api";
import GroupingRetroColumn from "./GroupingRetroColumn";
import { useColumnizedItems } from "./utils";

export default function ReflectionRetroView({
  retro,
  onRefetch,
  canParticipate,
}: {
  retro: { id: string };
  onRefetch: () => void;
  canParticipate: boolean;
}) {
  const { data: items, status } = api.retroItem.getByRetroId.useQuery({
    retroId: retro.id,
  });

  const [positiveItems, negativeItems] = useColumnizedItems(items);
  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-slate-500">Grouping</h2>
      <div className="mx-auto mt-12 mb-32">
        <div className="flex flex-grow flex-row justify-center gap-16">
          <GroupingRetroColumn
            retroId={retro.id}
            column="POSITIVE"
            columnHeader="What's working?"
            canParticipate={canParticipate}
            items={positiveItems}
            onRefetch={onRefetch}
          />
          <GroupingRetroColumn
            retroId={retro.id}
            column="NEGATIVE"
            columnHeader="Where did you get stuck?"
            canParticipate={canParticipate}
            items={negativeItems}
            onRefetch={onRefetch}
          />
        </div>
      </div>
    </>
  );
}
