"use client";
import { SessionProvider, useSession } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerProviders>{children}</InnerProviders>
    </SessionProvider>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  return <>{children}</>;
}
