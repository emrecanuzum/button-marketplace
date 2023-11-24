import { PrismaClient } from "@prisma/client";
import { IncomingForm } from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    res.status(401).json({ error: "Unauthorized" });
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
          userId: session.user.email,
        },
      });

      res.status(200).json(file);
    } catch (dbError) {
      res.status(500).json({ error: "Database error" });
    }
  });
}
