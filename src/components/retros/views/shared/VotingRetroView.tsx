import type { Retrospective } from "@prisma/client";
import { useState } from "react";
import { api } from "../../../../utils/api";
import { useColumnizedItems } from "./utils";
import VotingRetroColumn from "./VotingRetroColumn";

export default function VotingRetroView({
  retro,
  onRefetch,
  canParticipate,
}: {
  retro: Retrospective;
  onRefetch: () => void;
  canParticipate: boolean;
}) {
  const { data: items, refetch } = api.retroItem.getGroupedItems.useQuery({
    retroId: retro.id,
  });
  const vote = api.retroItem.vote.useMutation();
  const [positiveItems, negativeItems] = useColumnizedItems(items);

  const [votesRemaining, setVotesRemaining] = useState(
    retro.votesPerParticipant
  );
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});

  const handleVote = async (itemId: string, upOrDown: "UP" | "DOWN") => {
    const delta = upOrDown === "UP" ? 1 : -1;
    setVotesRemaining((v) => v - delta);
    setMyVotes((v) =>
      Object.assign({}, v, { [itemId]: (v[itemId] ?? 0) + delta })
    );
    await vote.mutateAsync({ id: itemId, upOrDown });
    onRefetch();
  };

  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-slate-500">Vote</h2>
      <div className="mx-auto my-4 flex w-full flex-row justify-center gap-8 rounded-md bg-gray-200 p-2 text-center">
        <div className="font-semibold">
          <span className="text-sm">My Votes:</span>{" "}
          <span className="text-indigo-600">{votesRemaining}</span>
        </div>
        <div className="font-semibold">
          <span className="text-sm">Team Votes:</span>{" "}
          <span className="text-indigo-600">NYI</span>
        </div>
      </div>
      <div className="mx-auto mt-4 mb-32 flex flex-grow flex-row justify-center gap-16">
        <VotingRetroColumn
          retroId={retro.id}
          column="POSITIVE"
          columnHeader="What's working?"
          canParticipate={canParticipate}
          items={positiveItems}
          onVote={(...args) => void handleVote(...args)}
          myVotes={myVotes}
          votesRemaining={votesRemaining}
        />
        <VotingRetroColumn
          retroId={retro.id}
          column="NEGATIVE"
          columnHeader="Where did you get stuck?"
          canParticipate={canParticipate}
          items={negativeItems}
          onVote={(...args) => void handleVote(...args)}
          myVotes={myVotes}
          votesRemaining={votesRemaining}
        />
      </div>
    </>
  );
}
