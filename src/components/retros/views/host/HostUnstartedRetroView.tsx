import { useSession } from "next-auth/react";
import { env } from "../../../../env/client.mjs";
import type { RouterOutputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";

export default function HostUnstartedRetroView({
  retro,
  onRefetch,
}: {
  retro: RouterOutputs["retro"]["getBySlug"];
  onRefetch: () => void;
}) {
  const { data: sessionData } = useSession({ required: true });
  const startRetro = api.retro.updateStatus.useMutation();

  if (retro === null) return null;

  const handleStart = async () => {
    try {
      await startRetro.mutateAsync({
        status: "REFLECTION",
        id: retro.id,
        startedAt: new Date(),
      });
      onRefetch();
    } catch (e) {
      // TODO: error handling
    }
  };

  const shareUrl = `${env.NEXT_PUBLIC_URL}/retros/${retro.slug}`;

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="mx-auto flex flex-grow flex-col items-center justify-center">
      <h3 className="my-4 text-xl text-slate-600">
        This retro has not yet started.
      </h3>
      <button
        className="
          rounded-md border-blue-300 bg-sky-500 py-2 px-4 font-semibold text-white
          active:bg-sky-700
          disabled:bg-gray-500
          data-[error=true]:bg-red-500
        "
        onClick={() => void handleStart()}
        disabled={startRetro.status === "loading"}
        data-error={startRetro.status === "error"}
      >
        {startRetro.status === "idle" && "Click here to start it"}
        {startRetro.status === "loading" && "Starting..."}
        {startRetro.status === "error" &&
          "Something went wrong, please refresh and try again"}
      </button>
      <div className="my-4 flex flex-col justify-center text-center">
        <h4 className="text-sm font-bold uppercase">Host</h4>
        <span>{sessionData?.user?.displayName} (You)</span>
      </div>
      <div className="flex flex-col justify-center text-center">
        <h4 className="text-sm font-bold uppercase">Participants</h4>
        {retro.participants.length === 0 && (
          <span className="text-slate-400">None</span>
        )}
        {retro.participants.map((p) => (
          <span key={p.id}>{p.displayName}</span>
        ))}
      </div>
      <div className="my-4 flex flex-col justify-center text-center">
        <span>Invite participants by sharing this link:</span>
        <div className="rounded-lg bg-gray-200">
          <span className="px-4 py-2 font-mono text-sm">{shareUrl}</span>
          <button
            className="
            rounded-md border-blue-300 bg-sky-600 py-2 px-4 text-sm font-semibold text-white
            active:bg-sky-700
            disabled:bg-gray-500
            data-[error=true]:bg-red-500
            "
            onClick={handleCopyLink}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
