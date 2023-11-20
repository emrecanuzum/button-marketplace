"use client";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";

const Market = () => {
  const { data: session, status } = useSession();
  return (
    <main>
      <div className="flex justify-between items-center w-screen p-10 border-b">
        <h1 className="text-xl font-bold">Button Marketplace</h1>
        <Link
          className=" hover:bg-neutral-100 p-4 rounded-xl border"
          href={session?.user.email || "/market"}
        >
          Profile
        </Link>
      </div>
      <div className=""></div>
    </main>
  );
};

export default Market;
