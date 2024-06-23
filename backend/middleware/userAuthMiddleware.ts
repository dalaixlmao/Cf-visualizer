import z from "zod";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import jwtPassword from "../config";
import { CustomRequest } from "../controllers/customInterface";
const prisma = new PrismaClient();

async function userSignupCheck(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const username = req.body.username;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) res.status(403).json({ message: "User already exist" });
  else next();
}

async function userSigninCheck(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const username = req.body.username;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) next();
  else
    res
      .status(403)
      .json({ message: "Invalid Credentials, user doesn't exist" });
}

async function userAuthCheck(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {

  const a = req.headers.authorization || "";
  const token = a.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtPassword) as JwtPayload;
    console.log(typeof decoded, typeof decoded.id, decoded.id)
    if (typeof decoded.id !== "string" && decoded.id) {
        console.log("working");
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      console.log(user);
      if (user) {
        req.id = decoded.id;
        next();
      } else {
        res.status(403).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(403).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(403).json({ message: "Invalid credentials" });
  }
}

export { userSigninCheck, userSignupCheck, userAuthCheck };
