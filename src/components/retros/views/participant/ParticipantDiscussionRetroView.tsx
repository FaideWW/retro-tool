import type { Retrospective } from "@prisma/client";
import { api } from "../../../../utils/api";
import DiscussionRetroView from "../shared/DiscussionRetroView";

export default function ParticipantDiscussionRetroView({
  retro,
  onRefetch,
}: {
  retro: Retrospective;
  onRefetch: () => void;
}) {
  const changeStatus = api.retro.updateStatus.useMutation();

  const advanceToGrouping = async () => {
    await changeStatus.mutateAsync({ id: retro.id, status: "ENDED" });
    onRefetch();
  };

  return (
    <>
      <DiscussionRetroView retro={retro} onRefetch={onRefetch} />
    </>
  );
}
