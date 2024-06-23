"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const userAuthMiddleware_1 = require("../middleware/userAuthMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const createData_1 = __importDefault(require("../controllers/createData"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.use(body_parser_1.default.json());
router.post("/signup", validationMiddleware_1.signupValidation, userAuthMiddleware_1.userSignupCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const handle = req.body.handle;
    const username = req.body.username;
    const password = req.body.password;
    const user = yield prisma.user.create({
        data: {
            username: username,
            password: password,
            handle: handle,
        },
    });
    const id = user.id;
    const token = jsonwebtoken_1.default.sign({ id: id }, config_1.default);
    res.status(200).json({ message: "Signed in succesfully", token: token });
}));
router.post("/signin", validationMiddleware_1.signinValidation, userAuthMiddleware_1.userSigninCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user = yield prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    const id = user === null || user === void 0 ? void 0 : user.id;
    const token = jsonwebtoken_1.default.sign({ id: id }, config_1.default);
    res.status(200).json({ message: "signed in successfully", token: token });
}));
router.get("/dashboard", userAuthMiddleware_1.userAuthCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    if (!id) {
        return res.status(400).json({ message: "User ID not provided" });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        try {
            const url = "https://codeforces.com/api/user.info?handles=" + user.handle;
            console.log(url);
            const response = yield axios_1.default.get(url);
            const url2 = "https://codeforces.com/api/user.status?handle=" + user.handle;
            const response2 = yield axios_1.default.get(url2);
            const tagRatingData = yield (0, createData_1.default)(response2);
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
            };
            res
                .status(200)
                .json({
                result: requiredObj,
                tagRating: tagRatingData
            });
        }
        catch (axiosError) {
            res.status(500).json({
                message: "Error fetching data from Codeforces API",
                user: user,
            });
        }
    }
    catch (prismaError) {
        res.status(500).json({ message: "Error querying the database" });
    }
}));
exports.default = router;
