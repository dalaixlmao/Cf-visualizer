"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = exports.signinValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const usernameSchema = zod_1.default.string().email();
const passwordSchema = zod_1.default.string().min(8);
const handleSchema = zod_1.default.string();
const userSignup = zod_1.default.object({
    username: usernameSchema,
    password: passwordSchema,
    handle: handleSchema
});
const userSignin = zod_1.default.object({
    username: usernameSchema,
    password: passwordSchema
});
function signupValidation(req, res, next) {
    const signUp = req.body;
    const response = userSignup.safeParse(signUp);
    if (response.success)
        next();
    else
        res.status(403).json({ message: "Invalid Inputs" });
}
exports.signupValidation = signupValidation;
function signinValidation(req, res, next) {
    const signIn = req.body;
    const response = userSignin.safeParse(signIn);
    if (response.success)
        next();
    else
        res.status(403).json({ message: "Invalid Inputs" });
}
exports.signinValidation = signinValidation;
