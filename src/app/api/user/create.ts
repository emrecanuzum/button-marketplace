// src/app/api/user/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody {
  email: string;
}

interface ResponseData {
  id: string;
  email: string;
  publicKey: string | null;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorResponse>
) {
  if (req.method === "POST") {
    const { email } = req.body as RequestBody;

    try {
      let user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email,
          },
        });
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        publicKey: user.publicKey,
      });
    } catch (e) {
      console.error("Request error", e);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
