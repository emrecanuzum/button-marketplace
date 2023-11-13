// src/app/api/user/create/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, publicKey } = await req.json();

  try {
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          publicKey: publicKey,
        },
      });
    }

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        publicKey: user.publicKey,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.error("Request error", e);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
