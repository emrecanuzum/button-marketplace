"use client";
import { SessionProvider, useSession } from "next-auth/react";
import WalletContextProvider from "./WalletContextProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      <SessionProvider>
        <InnerProviders>{children}</InnerProviders>
      </SessionProvider>
    </WalletContextProvider>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  return <>{children}</>;
}
