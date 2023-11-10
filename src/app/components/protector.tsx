"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export function ProtectedComponent() {
  const { connected } = useWallet();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if session exists and if user is newly logged in
    if (session && session.user) {
      createUser(session.user);
    }
  }, [session]);

  useEffect(() => {
    // Check if session exists and if user is newly logged in
    if (session && session.user) {
      createUser(session.user);
    }
  }, [session]);

  const createUser = async (user: any) => {
    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email, // Assuming the email is the unique identifier
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
