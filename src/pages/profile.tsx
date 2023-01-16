import type { NextPage } from "next";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Loading from "../components/Loading";
import Navigation from "../components/Navigation";
import { api } from "../utils/api";
import { makeTitle } from "../utils/title";

const Profile: NextPage = () => {
  const { status, data: session } = useSession({ required: true });

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{makeTitle("Profile")}</title>
      </Head>
      <Navigation />
      <main className="container mx-auto flex flex-col px-4 py-16 text-slate-800">
        <h1 className="text-3xl font-bold">Edit User Profile</h1>
        <hr />
        <div className="my-4 w-96">
          <EditUserProfile user={session?.user} />
        </div>
      </main>
    </>
  );
};

export default Profile;

type EditUserProfileFormInputs = {
  displayName: string;
};

function EditUserProfile({ user }: { user?: User }) {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, isSubmitted, isSubmitting, errors },
  } = useForm<EditUserProfileFormInputs>({
    mode: "onBlur",
    defaultValues: {
      displayName: user?.displayName,
    },
  });
  const [apiError, setApiError] = useState(false);
  const editUser = api.user.editUser.useMutation();

  let submitText = "Save";
  if (isSubmitting) {
    submitText = "Saving...";
  } else if (isSubmitted) {
    submitText = "Saved!";
  }

  const submitEnabled = isDirty && isValid && !isSubmitting && !isSubmitted;

  const onSubmit: SubmitHandler<EditUserProfileFormInputs> = async (data) => {
    try {
      await editUser.mutateAsync(data);
    } catch (e) {
      setApiError(true);
    }
  };

  return (
    <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
      <div className="flex flex-col">
        <label className="block">
          <span>Display Name</span>
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
            aria-invalid={errors.displayName ? true : false}
            {...register("displayName", { required: true, maxLength: 50 })}
          />
          <span className="my-2 text-sm text-red-500">
            {errors.displayName ? <>Name can&apos;t be empty</> : <>&nbsp;</>}
          </span>
        </label>
      </div>
      {!isSubmitted || !apiError ? (
        <input
          type="submit"
          value={submitText}
          className="
        float-right cursor-pointer rounded-md bg-sky-500 px-5 py-2.5 font-semibold leading-5 text-white 
        hover:bg-sky-700 
        disabled:cursor-not-allowed disabled:bg-gray-500 disabled:hover:bg-gray-500
        "
          disabled={!submitEnabled}
        />
      ) : (
        <span className="float-right text-red-500">
          An error occurred while saving, please try again later.
        </span>
      )}
    </form>
  );
}
