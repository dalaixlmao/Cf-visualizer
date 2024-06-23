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
exports.userAuthCheck = exports.userSignupCheck = exports.userSigninCheck = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const prisma = new client_1.PrismaClient();
function userSignupCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (user)
            res.status(403).json({ message: "User already exist" });
        else
            next();
    });
}
exports.userSignupCheck = userSignupCheck;
function userSigninCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (user)
            next();
        else
            res
                .status(403)
                .json({ message: "Invalid Credentials, user doesn't exist" });
    });
}
exports.userSigninCheck = userSigninCheck;
function userAuthCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = req.headers.authorization || "";
        const token = a.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default);
            console.log(typeof decoded, typeof decoded.id, decoded.id);
            if (typeof decoded.id !== "string" && decoded.id) {
                console.log("working");
                const user = yield prisma.user.findUnique({
                    where: { id: decoded.id },
                });
                console.log(user);
                if (user) {
                    req.id = decoded.id;
                    next();
                }
                else {
                    res.status(403).json({ message: "Invalid credentials" });
                }
            }
            else {
                res.status(403).json({ message: "Invalid credentials" });
            }
        }
        catch (e) {
            res.status(403).json({ message: "Invalid credentials" });
        }
    });
}
exports.userAuthCheck = userAuthCheck;
