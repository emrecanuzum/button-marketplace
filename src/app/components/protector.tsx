"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export function ProtectedComponent() {
  const { connected, publicKey } = useWallet();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.user && publicKey) {
      // Convert publicKey to a string to send to your API
      const publicKeyString = publicKey.toString();
      createUser(session.user, publicKeyString);
    }
  }, [session, publicKey]);

  const createUser = async (user: any, publicKey: string) => {
    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          publicKey: user.publicKey,
        }),
      });
      if (!res.ok) {
        throw new Error("Error processing request");
      }

      const data = await res.json();
      console.log("User processed:", data);
    } catch (error) {
      console.error("Failed to process user:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Access Denied</div>;
  }
  console.log(session.user);
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
