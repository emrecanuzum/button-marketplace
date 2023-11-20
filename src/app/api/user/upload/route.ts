import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest) {
  // Ensure only POST requests are handled
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const form = new formidable.IncomingForm() as any;
  form.uploadDir = "./uploads";
  form.keepExtensions = true;

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return new Response(JSON.stringify({ error: "Form parsing error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const fileUpload = fileArray[0];

    if (!fileUpload) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
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

      return new Response(JSON.stringify(file), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (dbError) {
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  });
}
