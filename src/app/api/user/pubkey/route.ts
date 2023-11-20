// pages/api/user/updatePublicKey.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Response) {
  try {
    // Parse the request body
    const { email, publicKey } = await req.json();

    // Update the user's publicKey in the database
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        publicKey: publicKey,
      },
    });

    // Return the updated user data
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error("Request error", e);
    // Return a generic error message
    return new Response(
      JSON.stringify({ error: "Error updating public key" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
