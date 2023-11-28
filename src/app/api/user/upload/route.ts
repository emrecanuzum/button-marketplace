// src/app/api/user/upload/route.ts
import { PrismaClient } from "@prisma/client";
import { IncomingForm } from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  // Update this line to pass req and res as separate arguments
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.mongo_id) {
    res.status(401).end("Unauthorized");
    return;
  }

  const form = new IncomingForm() as any;
  form.uploadDir = "./uploads";
  form.keepExtensions = true;

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      res.status(500).json({ error: "Form parsing error" });
      return;
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const fileUpload = fileArray[0];

    if (!fileUpload) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filePath = fileUpload.filepath;
    const fileName = fileUpload.originalFilename ?? "unnamed";
    const fileType = fileUpload.mimetype ?? "unknown";
    const fileSize = fileUpload.size;

    try {
      const file = await prisma.file.create({
        data: {
          path: filePath,
          filename: fileName,
          mimetype: fileType,
          size: fileSize,
          userId: session.user.mongo_id,
        },
      });

      res.status(200).json(file);
    } catch (dbError) {
      res.status(500).json({ error: "Database error" });
    }
  });
}
