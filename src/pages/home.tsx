import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Loading from "../components/Loading";
import Navigation from "../components/Navigation";
import MyRetrosList from "../components/retros/MyRetrosList";
import { makeTitle } from "../utils/title";

const Home: NextPage = () => {
  const { status: sessionStatus } = useSession({ required: true });
  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{makeTitle("Home")}</title>
      </Head>
      <Navigation />
      <main className="container mx-auto flex flex-col  px-4 py-16 text-slate-800">
        <MyRetrosList />
      </main>
    </>
  );
};

export default Home;
