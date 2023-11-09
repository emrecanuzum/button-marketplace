"use client";
import { useSession } from "next-auth/react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
export function ProtectedComponent() {
  const { connected } = useWallet();
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
        <div>
          Welcome, {session.user.name}
          {". "}
          <div>
            {connected ? (
              <p>Thank you! for connecting</p>
            ) : (
              <p>Please complete the second phase of the login.</p>
            )}
          </div>
          <div>
            <WalletMultiButton className="bg-black" />
          </div>
        </div>
      ) : (
        <div>Access Denied</div>
      )}
    </div>
  );
}
