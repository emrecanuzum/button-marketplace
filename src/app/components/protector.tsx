"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export function ProtectedComponent() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Assuming the session object contains a `user` object with a `id` property
    if (session && session.user && connected && publicKey) {
      // Convert publicKey to a string to send to your API
      const publicKeyString = publicKey.toString();
      updatePublicKey(session.user, publicKeyString);
    }
  }, [session, publicKey, connected]);

  const updatePublicKey = async (user: any, publicKeyString: string) => {
    try {
      const res = await fetch("/api/user/pubkey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email, // This should match the user ID property in your database
          publicKey: publicKeyString,
        }),
      });
      if (!res.ok) {
        throw new Error("Error updating public key");
      }

      const data = await res.json();
      console.log("Public key updated:", data);
      router.push("/market");
    } catch (error) {
      console.error("Failed to update public key:", error);
    }
  };

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
