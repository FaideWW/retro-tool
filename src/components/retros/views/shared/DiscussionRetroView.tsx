import type { Retrospective } from "@prisma/client";
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useEffect,
  useState,
} from "react";
import { api, type RouterOutputs } from "../../../../utils/api";

type Unpack<T> = T extends (infer U)[] ? U : T;
export type DiscussionItem = Unpack<
  RouterOutputs["retroItem"]["getRankedGroups"]
>;

export default function DiscussionRetroView({
  retro,
  isSummary,
}: {
  retro: Retrospective;
  isSummary?: boolean;
  onRefetch: () => void;
  isHost?: boolean;
}) {
  const { data: items, refetch } = api.retroItem.getRankedGroups.useQuery({
    retroId: retro.id,
  });

  const addComment = api.itemComment.create.useMutation();

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>("");

  const activeItem: DiscussionItem | null =
    activeItemId === null
      ? null
      : items?.find((i) => i.id === activeItemId) ?? null;

  const handleCommentText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmitComment: FormEventHandler = (e) => {
    e.preventDefault();
    void submitComment();
  };

  const submitComment = async () => {
    if (activeItem === null || commentText.length === 0) return;
    setCommentText("");

    try {
      await addComment.mutateAsync({
        retroId: retro.id,
        parentId: activeItem.id,
        text: commentText,
      });
      await refetch();
    } catch (e) {
      // TODO: handle errors
    }
  };

  useEffect(() => {
    if (activeItem === null && items?.[0] !== undefined) {
      setActiveItemId(items[0].id);
    }
  }, [activeItem, items]);

  console.log(activeItem?.comments);

  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-slate-500">Discussion</h2>
      {isSummary && (
        <div className="inset-0 w-full bg-yellow-200 py-2 text-center font-semibold">
          This retro has ended.
        </div>
      )}
      <div className="mx-auto mt-12 mb-32 flex w-full flex-grow flex-col">
        <div className="flex flex-grow flex-row items-stretch justify-center gap-16">
          <div className="flex w-1/4 flex-col">
            {items &&
              items.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItemId(item.id)}
                    className="
                      flex flex-row justify-between py-2 px-4
                      hover:cursor-pointer hover:bg-sky-200
                      data-[active=true]:bg-sky-200
                    "
                    data-active={item.id === activeItem?.id}
                  >
                    <span>{truncateItemText(item.text, 20)}</span>
                    <span className="rounded-md bg-gray-100 py-1 px-2 font-semibold">
                      +{item.voteCount}
                    </span>
                  </div>
                );
              })}
          </div>
          <div className="w-1/2">
            {activeItem && (
              <div className="flex flex-col">
                <div className="flex flex-row items-start justify-center gap-4">
                  <h3 className="text-center text-xl">{activeItem.text}</h3>
                  <div className="whitespace-nowrap rounded-full bg-gray-100 py-1 px-4 font-semibold">
                    {activeItem.voteCount} Votes
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  {[activeItem, ...activeItem.children].map((item) => (
                    <div key={item.id} className="">
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex w-1/4 flex-col">
            <h3 className="text-md font-bold">Discussion</h3>
            {activeItem && (
              <>
                <div className="flex flex-grow flex-col justify-end gap-4">
                  {activeItem.comments.map((comment) => (
                    <div key={comment.id}>
                      <div className="text-xs font-bold">
                        {comment.author
                          ? comment.author.displayName
                          : "Someone"}
                      </div>
                      {comment.text}
                    </div>
                  ))}
                </div>
                {!isSummary && (
                  <div>
                    <form onSubmit={handleSubmitComment}>
                      <input
                        type="text"
                        className="
                        mt-0 block w-full border-0 border-b-2 border-gray-200 px-0.5
                        focus:border-black focus:ring-0
                        aria-invalid:border-red-500 
                      "
                        disabled={addComment.status === "loading"}
                        placeholder="Add a comment"
                        value={commentText}
                        onChange={handleCommentText}
                      />
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function truncateItemText(originalText: string, maxLength: number): string {
  if (originalText.length < maxLength) return originalText;

  let lastSpace = 0;
  while (lastSpace < maxLength) {
    const nextSpace = originalText.substring(lastSpace).indexOf(" ");
    if (nextSpace === -1) {
      lastSpace = maxLength;
    } else {
      lastSpace += nextSpace + 1;
    }
  }

  return `${originalText.substring(0, lastSpace)}...`;
}
