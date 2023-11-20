import Link from "next/link";
import React from "react";

const Market = () => {
  return (
    <main>
      <div className="flex justify-between items-center w-screen p-10 border-b">
        <h1 className="text-xl font-bold">Button Marketplace</h1>
        <Link className=" hover:bg-neutral-100 p-4 rounded-xl border" href={""}>
          Profile
        </Link>
      </div>
      <div className=""></div>
    </main>
  );
};

export default Market;
