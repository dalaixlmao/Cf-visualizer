import { Router } from "express";
import { Jwt } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import jwtPassword from "../config";
import { CustomRequest } from "../controllers/customInterface";
import { Response } from "express";
import {
  userAuthCheck,
  userSigninCheck,
  userSignupCheck,
} from "../middleware/userAuthMiddleware";
import {
  signinValidation,
  signupValidation,
} from "../middleware/validationMiddleware";
import axios from "axios";
import { Axios } from "axios";
import bodyParser from "body-parser";
import createData from "../controllers/createData";

const prisma = new PrismaClient();
const router = Router();
router.use(bodyParser.json());

router.post("/signup", signupValidation, userSignupCheck, async (req, res) => {
  const handle = req.body.handle;
  const email = req.body.email;
  const password = req.body.password;
  const user = await prisma.user.create({
    data: {
      email: email,
      password: password,
      handle: handle,
    },
  });
  const id = user.id;
  const token = jwt.sign({ id: id }, jwtPassword);
  res.status(200).json({ message: "Signed up succesfully", token: token });
});

router.post(
  "/signin",
  signinValidation,
  userSigninCheck,
  async (req: CustomRequest, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(500).json({ message: "server error" });
    }
    if (user?.password == password) {
      const id = user?.id;
      const token = jwt.sign({ id: id }, jwtPassword);
      res.status(200).json({ message: "Signed in successfully", token: token });
    }
  }
);

router.get("/handle/:handle", async (req: CustomRequest, res: Response) => {
  const handle = req.params.handle;
  console.log(handle);
  try {
    const url = "https://codeforces.com/api/user.info?handles=" + handle;
    const response = await axios.get(url);
    const url2 = "https://codeforces.com/api/user.status?handle=" + handle;
    const response2 = await axios.get(url2);
    const tagRatingData = createData(response2);
    const result = response.data.result[0];
    const requiredObj = {
      firstname: result.firstName,
      lastname: result.lastName,
      rank: result.rank,
      maxRank: result.maxRank,
      maxRating: result.maxRating,
      avatar: result.avatar,
      titlePhoto: result.titlePhoto,
      country: result.country,
      currentRating: result.rating,
      handle: handle,
    };
    res.status(200).json({
      result: requiredObj,
      tagRating: tagRatingData,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error fetching data from Codeforces API",
    });
  }
});

router.get("/nav", userAuthCheck, async (req: CustomRequest, res: Response) => {
  const id = req.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      res.status(500).json({ message: "server error" });
    }
    const handle = user?.handle;

    const url =
          "https://codeforces.com/api/user.info?handles=" + handle;
        console.log("valid url?", url);
        const response = await axios.get(url);
        const avatar = response.data.result[0].titlePhoto;
    res.status(200).json({ handle: handle, avatar:avatar });
  } catch (e) {
    res.status(500).json({ message: "error in fetching data from cf" });
  }
});

router.get(
  "/dashboard",
  userAuthCheck,
  async (req: CustomRequest, res: Response) => {
    const id = req.id;
    console.log("working after middlewares");

    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      try {
        const url =
          "https://codeforces.com/api/user.info?handles=" + user.handle;
        console.log("valid url?", url);
        const response = await axios.get(url);
        console.log("info response fetched", response);
        const url2 =
          "https://codeforces.com/api/user.status?handle=" + user.handle;
        const response2 = await axios.get(url2);
        const tagRatingData = await createData(response2);
        const result = response.data.result[0];
        const requiredObj = {
          firstname: result.firstName,
          lastname: result.lastName,
          rank: result.rank,
          maxRank: result.maxRank,
          maxRating: result.maxRating,
          avatar: result.avatar,
          titlePhoto: result.titlePhoto,
          country: result.country,
          currentRating: result.rating,
          handle: user.handle,
        };
        res.status(200).json({
          result: requiredObj,
          tagRating: tagRatingData,
        });
      } catch (axiosError) {
        res.status(500).json({
          message: "Error fetching data from Codeforces API",
          user: user,
        });
      }
    } catch (prismaError) {
      res.status(500).json({ message: "Error querying the database" });
    }
  }
);
export default router;
