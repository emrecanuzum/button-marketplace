"use client";
import { useSession } from "next-auth/react";

export function ProtectedComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      {session && session.user ? (
        <div>Welcome, {session.user.name}</div>
      ) : (
        <div>Access Denied</div>
      )}
    </div>
  );
}
