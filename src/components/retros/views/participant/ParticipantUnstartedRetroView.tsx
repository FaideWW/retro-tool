import { useSession } from "next-auth/react";
import type { RouterOutputs } from "../../../../utils/api";

export default function ParticipantUnstartedRetroView({
  retro,
}: {
  retro: RouterOutputs["retro"]["getBySlug"];
  onRefetch: () => void;
}) {
  const { data: sessionData } = useSession({ required: true });

  if (retro === null) return null;

  return (
    <div className="mx-auto flex flex-grow flex-col items-center justify-center">
      <h3 className="my-4 text-xl text-slate-600">
        Waiting for the host to start the session...
      </h3>
      <div className="my-4 flex flex-col justify-center text-center">
        <h4 className="text-sm font-bold uppercase">Host</h4>
        <span>{sessionData?.user?.displayName} (You)</span>
      </div>
      <div className="flex flex-col justify-center text-center">
        <h4 className="text-sm font-bold uppercase">Participants</h4>
        {retro.participants.map((p) => (
          <span key={p.id}>{p.displayName}</span>
        ))}
      </div>
    </div>
  );
}
