import type { RouterOutputs } from "../../../../utils/api";
import HostDiscussionRetroView from "./HostDiscussionRetroView";
import HostGroupingRetroView from "./HostGroupingRetroView";
import HostReflectionRetroView from "./HostReflectionRetroView";
import HostSummaryRetroView from "./HostSummaryRetroView";
import HostUnstartedRetroView from "./HostUnstartedRetroView";
import HostVotingRetroView from "./HostVotingRetroView";

export default function HostRetroView({
  retro,
  onRefetch,
}: {
  retro: RouterOutputs["retro"]["getBySlug"];
  onRefetch: () => void;
}) {
  if (retro === null) return null;

  switch (retro.status) {
    case "UNSTARTED": {
      return <HostUnstartedRetroView retro={retro} onRefetch={onRefetch} />;
    }
    case "REFLECTION": {
      // TODO
      return <HostReflectionRetroView retro={retro} onRefetch={onRefetch} />;
    }
    case "GROUPING": {
      // TODO
      return <HostGroupingRetroView retro={retro} onRefetch={onRefetch} />;
    }
    case "VOTING": {
      // TODO
      return <HostVotingRetroView retro={retro} onRefetch={onRefetch} />;
    }
    case "DISCUSSION": {
      // TODO
      return <HostDiscussionRetroView retro={retro} onRefetch={onRefetch} />;
    }
    case "ENDED": {
      // TODO
      return <HostSummaryRetroView retro={retro} onRefetch={onRefetch} />;
    }
  }
}
