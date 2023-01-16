import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";

export default function NonParticipantRetroView({
  retro,
  onRefetch,
}: {
  retro: RouterOutputs["retro"]["getBySlug"];
  onRefetch: () => void;
}) {
  const joinRetro = api.retro.joinById.useMutation();
  if (retro === null) {
    return null;
  }

  const handleJoin = async () => {
    try {
      await joinRetro.mutateAsync({ id: retro.id });
      onRefetch();
    } catch (e) {
      // TODO: error logging
    }
  };

  return (
    <>
      <button
        className="
            rounded-md border-blue-300 bg-sky-500 py-2 px-4 font-semibold text-white
            active:bg-sky-700
            disabled:bg-gray-500
            data-[error=true]:bg-red-500
        "
        onClick={() => void handleJoin()}
        data-error={joinRetro.status === "error"}
        disabled={joinRetro.status !== "idle"}
      >
        {joinRetro.status === "idle" && "Join this retro"}
        {joinRetro.status === "loading" && "Joining..."}
        {joinRetro.status === "error" &&
          "Join failed, please refresh and try again"}
      </button>
    </>
  );
}
