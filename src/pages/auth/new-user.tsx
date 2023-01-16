import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import { normalizeQueryParam } from "../../utils/query";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return { props: { session } };
};

type ChangeDisplayNameFormInputs = {
  displayName: string;
};

export default function NewUser() {
  const { data: session } = useSession();
  const setDisplayName = api.user.setDisplayName.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting, errors },
  } = useForm<ChangeDisplayNameFormInputs>({
    mode: "onBlur",
    defaultValues: {
      displayName: session?.user?.name ?? "",
    },
  });
  const [apiError, setApiError] = useState(false);
  const router = useRouter();
  const callbackUrl = normalizeQueryParam(router.query.callbackUrl);
  const onSubmit: SubmitHandler<ChangeDisplayNameFormInputs> = async (data) => {
    try {
      await setDisplayName.mutateAsync({ displayName: data.displayName });
      const redirect = callbackUrl || "/home";
      await router.push(redirect);
    } catch (e) {
      setApiError(true);
    }
  };

  const currentName = watch("displayName");

  return (
    <>
      <Head>
        <title>New User</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h2 className="text-3xl font-bold">
            Welcome{currentName && ` ${currentName}`}!
          </h2>
          {!apiError && (
            <>
              <span>Please take a moment and confirm your display name:</span>
              <form
                onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
                className="flex flex-col"
              >
                <div className="flex flex-row gap-1">
                  <input
                    type="text"
                    className="
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                    aria-invalid:border-red-500 aria-invalid:ring aria-invalid:ring-red-200 aria-invalid:ring-opacity-50
                  "
                    aria-invalid={errors.displayName ? true : false}
                    {...register("displayName", {
                      required: true,
                      maxLength: 50,
                    })}
                  />
                  <input
                    type="submit"
                    value="Set"
                    className="mt-0.25 cursor-pointer rounded-md bg-sky-500 px-5 py-2.5 font-semibold leading-5 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:hover:bg-gray-500"
                    disabled={!isValid || isSubmitting}
                  />
                </div>
                <span className="my-2 text-sm text-red-500">
                  {errors.displayName ? (
                    <>Name can&apos;t be empty</>
                  ) : (
                    <>&nbsp;</>
                  )}
                </span>
              </form>
            </>
          )}
          {apiError && (
            <div className="flex flex-col items-center gap-4">
              <span>
                Sorry, something went wrong when saving your info. You can try
                again later on the Profile page.
              </span>
              <Link
                href="/home"
                className="mt-0.25 cursor-pointer rounded-md bg-gray-200 px-5 py-2.5 font-semibold leading-5 hover:bg-gray-300"
              >
                Continue to Home
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
