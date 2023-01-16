import type { Column } from "@prisma/client";
import { Fragment } from "react";
import type { RouterOutputs } from "../../../../utils/api";

export type ItemList = RouterOutputs["retroItem"]["getByRetroId"];

type Unpack<T> = T extends (infer U)[] ? U : T;
export type Item = Unpack<ItemList>;

interface VotingRetroColumnProps {
  retroId: string;
  column: Column;
  columnHeader: string;
  canParticipate: boolean;
  items: ItemList;
  myVotes: Record<string, number>;
  votesRemaining: number;
  onVote: (itemId: string, upOrDown: "UP" | "DOWN") => void;
}

export default function VotingRetroColumn({
  retroId,
  column,
  columnHeader,
  canParticipate,
  items,
  myVotes,
  votesRemaining,
  onVote,
}: VotingRetroColumnProps) {
  return (
    <div className="flex w-96 flex-col rounded-xl bg-gray-200 py-4 px-8">
      <h3 className="mb-4 text-center text-lg font-bold">{columnHeader}</h3>
      <div className="my-4 flex flex-grow flex-col justify-start gap-2">
        {items.map((item) => (
          <Fragment key={item.id}>
            <VotingUI
              onVote={(upOrDown: "UP" | "DOWN") => onVote(item.id, upOrDown)}
              score={myVotes[item.id] || 0}
              hasVotesRemaining={votesRemaining > 0}
            />
            <div className="rounded-md bg-white py-2 px-4">{item.text}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function VotingUI({
  onVote,
  score,
  hasVotesRemaining,
}: {
  onVote: (upOrDown: "UP" | "DOWN") => void;
  score: number;
  hasVotesRemaining: boolean;
}) {
  return (
    <div className="flex flex-row justify-end gap-2 px-2">
      <button
        className="
      h-6 w-6 rounded-full text-xl leading-none 
      enabled:hover:bg-indigo-300
      disabled:cursor-not-allowed
      "
        disabled={score === 0}
        onClick={() => onVote("DOWN")}
      >
        -
      </button>
      {score}
      <button
        className="
      h-6 w-6 rounded-full text-xl leading-none 
      enabled:hover:bg-indigo-300
      disabled:cursor-not-allowed
      "
        onClick={() => onVote("UP")}
        disabled={!hasVotesRemaining}
      >
        +
      </button>
    </div>
  );
}
