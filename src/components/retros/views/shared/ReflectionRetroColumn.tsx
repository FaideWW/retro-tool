import type { Column, RetroItem } from "@prisma/client";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useState } from "react";
import { api } from "../../../../utils/api";

interface ReflectionRetroColumnProps {
  retroId: string;
  column: Column;
  columnHeader: string;
  canParticipate: boolean;
  myItems: RetroItem[];
  totalItems: number;
  onAddItem: () => void;
}

export default function ReflectionRetroColumn({
  retroId,
  column,
  columnHeader,
  canParticipate,
  myItems,
  totalItems,
  onAddItem,
}: ReflectionRetroColumnProps) {
  const [pendingText, setPendingText] = useState("");
  const addItem = api.retroItem.create.useMutation();

  const handleSetPendingText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPendingText(e.target.value);
  };

  const handleCommitItem: FormEventHandler = (e) => {
    e.preventDefault();
    void handleAddItem();
  };

  const handleAddItem = async () => {
    setPendingText("");
    await addItem.mutateAsync({ retroId, column, text: pendingText });
    onAddItem();
  };

  return (
    <div className="flex w-96 flex-col rounded-xl bg-gray-200 py-4 px-8">
      <h3 className="mb-4 text-center text-lg font-bold">{columnHeader}</h3>
      {canParticipate && (
        <form onSubmit={handleCommitItem}>
          <input
            className="
            w-full rounded-sm p-2
            drop-shadow-md
            focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            "
            placeholder={columnHeader}
            value={pendingText}
            onChange={handleSetPendingText}
            disabled={addItem.status === "loading"}
          />
        </form>
      )}
      <div className="my-4 flex flex-grow flex-col justify-start gap-2">
        {myItems.map((item) => (
          <div key={item.id} className="rounded-md bg-white py-2 px-4">
            {item.text}
          </div>
        ))}
      </div>
      <div className="">
        {[...Array<unknown>(totalItems)].map((_, i) => (
          <span
            className="m-1 inline-block h-4 w-8 border-2 border-gray-100 bg-white drop-shadow-sm"
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
