import { useSession } from "next-auth/react";
import type { RouterOutputs } from "../../utils/api";
import HostRetroView from "./views/host/HostRetroView";
import ParticipantRetroView from "./views/participant/ParticipantRetroView";

interface RetroViewProps {
  retro: RouterOutputs["retro"]["getBySlug"];
  onRefetch: () => void;
}

export default function RetroView({ retro, onRefetch }: RetroViewProps) {
  const { data: sessionData } = useSession({ required: true });
  if (retro === null) {
    return null;
  }

  const isHost = retro.hostId == sessionData?.user?.id;
  const isParticipant = retro.participants.some(
    (p) => p.id === sessionData?.user?.id
  );

  if (isHost) {
    return <HostRetroView retro={retro} onRefetch={onRefetch} />;
  } else if (isParticipant) {
    // TODO
    return <ParticipantRetroView retro={retro} onRefetch={onRefetch} />;
  } else {
    // TODO
    return null;
  }
}
