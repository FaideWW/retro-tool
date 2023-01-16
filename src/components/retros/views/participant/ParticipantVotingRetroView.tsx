import type { Retrospective } from "@prisma/client";
import VotingRetroView from "../shared/VotingRetroView";

export default function ParticipantVotingRetroView({
  retro,
  onRefetch,
}: {
  retro: Retrospective;
  onRefetch: () => void;
}) {
  return (
    <>
      <VotingRetroView retro={retro} onRefetch={onRefetch} canParticipate />
    </>
  );
}
