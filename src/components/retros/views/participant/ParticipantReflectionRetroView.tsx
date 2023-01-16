import type { Retrospective } from "@prisma/client";
import ReflectionRetroView from "../shared/ReflectionRetroView";

export default function ParticipantReflectionRetroView({
  retro,
  onRefetch,
}: {
  retro: Retrospective;
  onRefetch: () => void;
}) {
  return (
    <ReflectionRetroView retro={retro} onRefetch={onRefetch} canParticipate />
  );
}
