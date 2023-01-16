import type { Status } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { api } from "../../utils/api";
import Portal from "../Portal";
import CreateRetroForm from "./CreateRetroForm";

const statusTexts: Record<Status, string> = {
  UNSTARTED: "Unstarted",
  REFLECTION: "In Progress",
  GROUPING: "In Progress",
  VOTING: "In Progress",
  DISCUSSION: "In Progress",
  ENDED: "Ended",
};

export default function MyRetrosList() {
  const { data: session } = useSession();
  const { data: myRetros, status } = api.retro.myRetros.useQuery();
  const router = useRouter();
  const nextRetroTitle = useMemo(() => {
    return `${session?.user?.displayName || "Someone"}'s Retro #${
      (myRetros?.length || 0) + 1
    }`;
  }, [session, myRetros]);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <div className="py-8" />
      <div className="flex flex-row items-center justify-start gap-4">
        <h1 className="text-3xl font-bold">My Retros</h1>
        <button
          className="
            float-right cursor-pointer rounded-md bg-green-600 px-4 py-2 font-semibold leading-5 text-white 
            hover:bg-green-700 
            disabled:cursor-not-allowed disabled:bg-gray-500 disabled:hover:bg-gray-500
        "
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </button>
      </div>
      <div className="mt-4 flex flex-row justify-start gap-2">
        {status === "loading" && (
          <>
            <RetroSkeleton />
            <RetroSkeleton />
            <RetroSkeleton />
          </>
        )}
        {myRetros &&
          myRetros.map((retro) => (
            <div
              key={retro.id}
              onClick={() => void router.push(`/retros/${retro.slug}`)}
              className="
              w-72 max-w-sm rounded-md border border-blue-300 p-4 shadow
              hover:cursor-pointer hover:ring hover:ring-blue-100 hover:ring-opacity-50
              "
            >
              <div>
                {retro.title}{" "}
                <span className="text-sm text-slate-500">
                  ({statusTexts[retro.status]})
                </span>
              </div>
            </div>
          ))}
      </div>
      <Portal>
        {createModalOpen && (
          <div className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
              <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold">Create New Retro</h2>
                <button
                  className="
                h-8 w-8 rounded-full text-2xl leading-6
                hover:bg-gray-200
                "
                  onClick={() => setCreateModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <CreateRetroForm defaultTitle={nextRetroTitle} />
            </div>
          </div>
        )}
      </Portal>
    </>
  );
}

function RetroSkeleton() {
  // TODO: replace with something that looks more like a retro card
  return (
    <div className="w-72 max-w-sm rounded-md border border-blue-300 p-4 shadow">
      <div className="flex animate-pulse space-x-4">
        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-slate-200"></div>
              <div className="col-span-1 h-2 rounded bg-slate-200"></div>
            </div>
            <div className="h-2 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
