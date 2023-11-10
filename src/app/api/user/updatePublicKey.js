// pages/api/user/updatePublicKey.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userID, publicKey } = req.body;

  try {
    const user = await prisma.user.update({
      where: {
        userID: userID,
      },
      data: {
        publicKey: publicKey,
      },
    });

    res.status(200).json(user);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Kullanıcının publicKey güncellenirken bir hata oluştu" });
  }
}
