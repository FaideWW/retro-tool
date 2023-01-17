import type { Retrospective } from "@prisma/client";
import DiscussionRetroView from "../shared/DiscussionRetroView";

export default function ParticipantSummaryRetroView({
  retro,
  onRefetch,
}: {
  retro: Retrospective;
  onRefetch: () => void;
}) {
  return (
    <>
      <DiscussionRetroView retro={retro} onRefetch={onRefetch} isSummary />
    </>
  );
}
