import type { Retrospective } from "@prisma/client";
import { api } from "../../../../utils/api";
import DiscussionRetroView from "../shared/DiscussionRetroView";

export default function HostSummaryRetroView({
  retro,
  onRefetch,
}: {
  retro: Retrospective;
  onRefetch: () => void;
}) {
  return (
    <>
      <DiscussionRetroView
        retro={retro}
        onRefetch={onRefetch}
        isHost
        isSummary
      />
      <div className="mx-auto bg-gray-200 p-4">
        <button
          className="
            rounded-md border-blue-300 bg-sky-500 py-2 px-4 font-semibold text-white
            active:bg-sky-700
            disabled:bg-gray-500
            data-[error=true]:bg-red-500
          "
          disabled
        >
          Finish
        </button>
      </div>
    </>
  );
}
