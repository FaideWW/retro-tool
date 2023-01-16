import { api } from "../../../../utils/api";
import ReflectionRetroColumn from "./ReflectionRetroColumn";
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
  const { data: myItems, refetch } = api.retroItem.getMyRetroItems.useQuery({
    retroId: retro.id,
  });
  const { data: countsByColumn } =
    api.retroItem.getColumnCountsByRetroId.useQuery({
      retroId: retro.id,
      columns: ["POSITIVE", "NEGATIVE"],
    });

  const [myPositiveItems, myNegativeItems] = useColumnizedItems(myItems);

  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-slate-500">Reflect</h2>
      <div className="mx-auto mt-12 mb-32 flex flex-grow flex-row justify-center gap-16">
        <ReflectionRetroColumn
          retroId={retro.id}
          column="POSITIVE"
          totalItems={countsByColumn?.[0] || 0}
          columnHeader="What's working?"
          canParticipate={canParticipate}
          myItems={myPositiveItems}
          onAddItem={() => void refetch()}
        />
        <ReflectionRetroColumn
          retroId={retro.id}
          column="NEGATIVE"
          totalItems={countsByColumn?.[1] || 0}
          columnHeader="Where did you get stuck?"
          canParticipate={canParticipate}
          myItems={myNegativeItems}
          onAddItem={() => void refetch()}
        />
      </div>
    </>
  );
}
