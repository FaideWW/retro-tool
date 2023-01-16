import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data } = useSession();
  const navCss =
    "leading-10 h-full px-2 hover:bg-blue-500 hover:text-white cursor-pointer";
  return (
    <nav className="fixed flex h-12 w-full items-center justify-end border-b-2 border-blue-500 bg-white px-4 text-gray-800">
      <Link
        href="/home"
        className="font-italic mr-auto font-bold text-orange-600"
      >
        Varafy Retros
      </Link>
      <Link href="/profile" className={navCss}>
        {data?.user?.displayName}
      </Link>
      <a className={navCss} onClick={() => void signOut()}>
        Log out
      </a>
    </nav>
  );
}
