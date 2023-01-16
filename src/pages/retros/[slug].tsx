import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import Navigation from "../../components/Navigation";
import RetroView from "../../components/retros/RetroView";
import { api } from "../../utils/api";
import { normalizeQueryParam } from "../../utils/query";
import { makeTitle } from "../../utils/title";

const Retro: NextPage = () => {
  const router = useRouter();
  const slug = normalizeQueryParam(router.query.slug);

  const {
    data: retro,
    status: retroStatus,
    refetch,
  } = api.retro.getBySlug.useQuery({
    slug: slug ?? "",
  });

  const { status: sessionStatus } = useSession({ required: true });
  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{makeTitle(retro?.title || "Loading...")}</title>
      </Head>
      <Navigation />
      <main className="container mx-auto flex min-h-screen flex-col px-4 text-slate-800">
        <div className="py-8" />
        {retroStatus === "loading" && <RetroSkeleton />}
        {retro && (
          <>
            <h1 className="text-3xl font-bold">{retro.title}</h1>
            <RetroView retro={retro} onRefetch={() => void refetch()} />
          </>
        )}
      </main>
    </>
  );
};

export default Retro;

function RetroSkeleton() {
  return <div>Put a retro skeleton here</div>;
}
