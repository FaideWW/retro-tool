import type { RouterOutputs } from "../../../../utils/api";
import ParticipantDiscussionRetroView from "./ParticipantDiscussionRetroView";
import ParticipantGroupingRetroView from "./ParticipantGroupingRetroView";
import ParticipantReflectionRetroView from "./ParticipantReflectionRetroView";
import ParticipantSummaryRetroView from "./ParticipantSummaryRetroView";
import ParticipantUnstartedRetroView from "./ParticipantUnstartedRetroView";
import ParticipantVotingRetroView from "./ParticipantVotingRetroView";

export default function ParticipantRetroView({
  retro,
  onRefetch,
}: {
  retro: RouterOutputs["retro"]["getBySlug"];
  onRefetch: () => void;
}) {
  if (retro === null) return null;

  switch (retro.status) {
    case "UNSTARTED": {
      return (
        <ParticipantUnstartedRetroView retro={retro} onRefetch={onRefetch} />
      );
    }
    case "REFLECTION": {
      return (
        <ParticipantReflectionRetroView retro={retro} onRefetch={onRefetch} />
      );
    }
    case "GROUPING": {
      return (
        <ParticipantGroupingRetroView retro={retro} onRefetch={onRefetch} />
      );
    }
    case "VOTING": {
      return <ParticipantVotingRetroView retro={retro} onRefetch={onRefetch} />;
    }
    case "DISCUSSION": {
      return (
        <ParticipantDiscussionRetroView retro={retro} onRefetch={onRefetch} />
      );
    }
    case "ENDED": {
      return (
        <ParticipantSummaryRetroView retro={retro} onRefetch={onRefetch} />
      );
    }
  }
}
