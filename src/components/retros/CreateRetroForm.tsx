import { useState } from "react";
import { api } from "../../utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";

type CreateRetroFormInputs = {
  title: string;
  hostCanParticipate: string;
  votesPerParticipant: number;
};

export default function CreateRetroForm({
  defaultTitle,
}: {
  defaultTitle: string;
}) {
  const router = useRouter();
  const [apiError, setApiError] = useState(false);
  const createRetro = api.retro.create.useMutation();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitted, isSubmitting },
  } = useForm<CreateRetroFormInputs>({
    mode: "onBlur",
    defaultValues: {
      title: defaultTitle,
      hostCanParticipate: "true",
      votesPerParticipant: 5,
    },
  });
  const onSubmit: SubmitHandler<CreateRetroFormInputs> = async (data) => {
    try {
      // Convert to the proper types
      const wellFormedData = {
        ...data,
        hostCanParticipate: data.hostCanParticipate === "true" ? true : false,
      };
      const newRetro = await createRetro.mutateAsync(wellFormedData);
      await router.push(`/retros/${newRetro.slug}`);
    } catch (e) {
      setApiError(true);
    }
  };

  let submitText = "Create";
  if (isSubmitting) {
    submitText = "Creating...";
  }

  const submitEnabled = isValid && !isSubmitting && !isSubmitted;

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      className="flex flex-col gap-2"
    >
      <label className="block">
        <span className="text-sm font-bold">Title</span>
        <input
          type="text"
          className="
            mt-0
            block
            w-full
            border-0
            border-b-2 border-gray-200 px-0.5
            focus:border-black focus:ring-0
            aria-invalid:border-red-500 
          "
          aria-invalid={errors.title ? true : false}
          {...register("title", { required: true, maxLength: 50 })}
        />
        <span className="my-2 text-sm text-red-500">
          {errors.title ? <>Title is required</> : <>&nbsp;</>}
        </span>
      </label>
      <div className="my-2 block flex-col">
        <span className="text-sm font-bold">Host can participate</span>
        <div className="flex flex-row justify-start gap-8">
          <label className="flex flex-row items-center gap-1">
            Yes
            <input
              type="radio"
              value="true"
              className="mt-1"
              {...register("hostCanParticipate")}
            />
          </label>
          <label className="flex flex-row items-center gap-1">
            No
            <input
              type="radio"
              value="false"
              className="mt-1"
              {...register("hostCanParticipate")}
            />
          </label>
        </div>
      </div>
      <label className="block">
        <span className="text-sm font-bold">Vote allotment</span>
        <input
          type="number"
          className="
            mt-0
            block
            w-1/4
            border-0
            border-b-2 border-gray-200 px-0.5
            focus:border-black focus:ring-0
            aria-invalid:border-red-500 
          "
          aria-invalid={errors.votesPerParticipant ? true : false}
          {...register("votesPerParticipant", {
            valueAsNumber: true,
            required: true,
            validate: (v) => {
              return v >= 0 && v <= 100 && v % 1 === 0;
            },
          })}
        />
        <span className="my-2 text-sm text-red-500">
          {errors.votesPerParticipant ? (
            <>Must be a whole number between 0 and 100</>
          ) : (
            <>&nbsp;</>
          )}
        </span>
      </label>
      <hr className="my-2" />
      {!isSubmitted || !apiError ? (
        <input
          type="submit"
          value={submitText}
          className="
            float-right cursor-pointer rounded-md bg-green-600 px-5 py-2.5 font-semibold leading-5 text-white 
            hover:bg-green-700 
            disabled:cursor-not-allowed disabled:bg-gray-500 disabled:hover:bg-gray-500
          "
          disabled={!submitEnabled}
        />
      ) : (
        <span className="float-right text-red-500">
          Could not create the retro, please try again later.
        </span>
      )}
    </form>
  );
}
