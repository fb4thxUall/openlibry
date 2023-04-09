import { UserType } from "@/entities/UserType";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { addUser, getAllUsers } from "@/entities/user";

const prisma = new PrismaClient();

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | UserType | Array<UserType>>
) {
  if (req.method === "POST") {
    const user = req.body as UserType;
    try {
      const result = (await addUser(prisma, user)) as UserType;
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({ result: "ERROR: " + error });
    }
  }

  if (req.method === "GET") {
    try {
      const users = (await getAllUsers(prisma)) as Array<UserType>;
      if (!users)
        return res.status(400).json({ result: "ERROR: User not found" });
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ result: "ERROR: " + error });
    }
  }
}
