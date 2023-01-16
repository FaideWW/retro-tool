import type { Retrospective } from "@prisma/client";
import { api } from "../../../../utils/api";
import GroupingRetroView from "../shared/GroupingRetroView";

export default function HostGroupingRetroView({
  retro,
  onRefetch,
}: {
  retro: Retrospective;
  onRefetch: () => void;
}) {
  const changeStatus = api.retro.updateStatus.useMutation();

  const advanceToGrouping = async () => {
    await changeStatus.mutateAsync({ id: retro.id, status: "VOTING" });
    onRefetch();
  };

  return (
    <>
      <GroupingRetroView retro={retro} onRefetch={onRefetch} canParticipate />
      <div className="mx-auto bg-gray-200 p-4">
        <button
          className="
            rounded-md border-blue-300 bg-sky-500 py-2 px-4 font-semibold text-white
            active:bg-sky-700
            disabled:bg-gray-500
            data-[error=true]:bg-red-500
          "
          onClick={() => void advanceToGrouping()}
          disabled={changeStatus.status === "loading"}
        >
          Proceed
        </button>
      </div>
    </>
  );
}
